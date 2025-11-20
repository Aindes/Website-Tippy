import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react'
import Web3 from 'web3'
import axios from 'axios'

function Payment() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const toast = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`)
        setOrder(response.data)
      } catch (error) {
        console.error('Error fetching order:', error)
      }
    }

    fetchOrder()
  }, [orderId])

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        toast({
          title: 'Wallet Connected',
          description: 'Your Ethereum wallet has been connected successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } catch (error) {
        console.error('Error connecting wallet:', error)
        toast({
          title: 'Connection Error',
          description: 'Could not connect to your wallet.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } else {
      toast({
        title: 'MetaMask Not Found',
        description: 'Please install MetaMask to make payments.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const processPayment = async () => {
    if (!walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    try {
      const response = await axios.post('http://localhost:3001/api/payment', {
        orderId,
        walletAddress,
        amount: order.total_amount
      })

      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (!order) {
    return <Container>Loading...</Container>
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Heading>Payment Details</Heading>
        <Box borderWidth="1px" borderRadius="lg" p={6}>
          <Text mb={4}>Order ID: {orderId}</Text>
          <Text mb={4}>Total Amount: Rp{order.total_amount}</Text>
          <Text mb={4}>Status: {order.status}</Text>
          
          {!walletAddress ? (
            <Button colorScheme="pink" onClick={connectWallet} size="lg">
              Connect Wallet
            </Button>
          ) : (
            <>
              <Text mb={4}>Connected Wallet: {walletAddress}</Text>
              <Button colorScheme="pink" onClick={processPayment} size="lg">
                Process Payment
              </Button>
            </>
          )}
        </Box>
      </VStack>
    </Container>
  )
}

export default Payment