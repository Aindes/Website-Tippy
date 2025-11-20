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
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const toast = useToast();

  const handleCheckout = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/orders', {
        items: cartItems,
        total_amount: getCartTotal(),
      });
      
      const orderId = response.data.orderId;
      navigate(`/payment/${orderId}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not create order. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
          <Button colorScheme="pink" size="lg" onClick={handleCheckout} px={8}>
            Checkout
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

export default Cart;