import { useState, useEffect } from 'react'
import { Container, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react'
import axios from 'axios'

function Orders() {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3001/api/orders/${orderId}`)
      fetchOrders() // refresh data setelah hapus
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

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
              <Td>
                <button
                  style={{ color: 'white', background: 'red', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Hapus
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}

export default Orders