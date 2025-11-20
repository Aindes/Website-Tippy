import { useState, useEffect } from 'react'
import { Container, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react'
import axios from 'axios'

function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders')
        setOrders(response.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <Container maxW="container.xl" py={10}>
      <Heading mb={6}>Your Orders</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Order ID</Th>
            <Th>Total Amount</Th>
            <Th>Status</Th>
            <Th>Payment Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.id}</Td>
              <Td>Rp{order.total_amount}</Td>
              <Td>{order.status}</Td>
              <Td>{order.payment_status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export default Orders