import {
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Text,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
    // Blockchain payment function
    // Kurs ETH/IDR (update sesuai harga ETH terbaru)
    const ETH_IDR_RATE = 30000000; // 1 ETH = Rp30.000.000

    async function payWithBlockchain() {
      if (!window.ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Silakan install MetaMask di browser kamu.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      try {
        // Pastikan order sudah dibuat di backend
        let orderId = lastOrderId;
        if (!orderId) {
          const response = await axios.post('http://localhost:3001/api/orders', {
            items: cartItems,
            total_amount: getCartTotal(),
          });
          orderId = response.data.orderId;
          setLastOrderId(orderId);
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xaa36a7') {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        // Konversi total cart (rupiah) ke ETH
        const ethAmount = (getCartTotal() / ETH_IDR_RATE).toFixed(6); // 6 digit desimal
        const tx = await signer.sendTransaction({
          to: '0xb034dff1a12f962c2d88d3c1c23d62b0135eb811',
          value: ethers.parseEther(ethAmount)
        });
        await tx.wait();
        // Update status order di backend
        if (orderId) {
          await axios.patch(`http://localhost:3001/api/orders/${orderId}/pay`);
        }
        clearCart();
        toast({
          title: 'Blockchain Payment Success',
          description: `Transaksi blockchain berhasil! Terima kasih. Dibayar: ${ethAmount} ETH`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/orders');
      } catch (err) {
        toast({
          title: 'Blockchain Payment Error',
          description: err.message || 'Transaksi gagal. Coba cek jaringan dan saldo.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, lastOrderId, setLastOrderId } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    let orderId = lastOrderId;
    try {
      // 1. Cek apakah sudah ada order pending
      if (!orderId) {
        const response = await axios.post('http://localhost:3001/api/orders', {
          items: cartItems,
          total_amount: getCartTotal(),
        });
        orderId = response.data.orderId;
        setLastOrderId(orderId);
      }

      // 2. Request snapToken ke backend
      const paymentRes = await axios.post('http://localhost:3001/api/payment', {
        orderId,
        amount: getCartTotal(),
      });
      const snapToken = paymentRes.data.snapToken;

      // 3. Panggil MidTrans Snap popup
      if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
          onSuccess: async function(result){
            await axios.patch(`http://localhost:3001/api/orders/${orderId}/pay`);
            clearCart();
            setLastOrderId(null);
            toast({
              title: 'Pembayaran Berhasil',
              description: 'Transaksi berhasil! Terima kasih.',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setIsProcessing(false);
            navigate('/orders');
          },
          onPending: function(result){
            toast({
              title: 'Pembayaran Pending',
              description: 'Transaksi masih menunggu pembayaran.',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
            setIsProcessing(false);
          },
          onError: function(result){
            toast({
              title: 'Pembayaran Gagal',
              description: 'Terjadi kesalahan pembayaran.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            setIsProcessing(false);
          },
        });
      } else {
        toast({
          title: 'Error',
          description: 'Gagal memproses pembayaran. Snap.js belum ter-load atau token kosong.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsProcessing(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Could not create order or process payment. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container maxW="container.xl" py={10}>
        <Text fontSize="xl">Your cart is empty</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              <Th>Total</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cartItems.map((item) => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>Rp{item.price}</Td>
                <Td>
                  <NumberInput
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(value) => updateQuantity(item.id, parseInt(value))}
                    w="100px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Td>
                <Td>Rp{item.price * item.quantity}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <HStack justify="flex-end" spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Total: Rp{getCartTotal()}
          </Text>
          <Button colorScheme="pink" size="lg" onClick={handleCheckout} px={8} isDisabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Checkout'}
          </Button>
          <Button colorScheme="blue" size="lg" onClick={payWithBlockchain} px={8}>
            Pay with Blockchain
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

export default Cart;