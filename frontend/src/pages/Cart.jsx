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
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
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
        </HStack>
      </VStack>
    </Container>
  );
}

export default Cart;