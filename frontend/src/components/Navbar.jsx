import {
  Box,
  Flex,
  Link as ChakraLink,
  Spacer,
  Button,
  Icon,
  useColorModeValue,
  Badge
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaClipboardList, FaStore } from 'react-icons/fa'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { cartItems } = useCart()
  return (
    <Box 
      bg="pink.700" 
      px={4} 
      py={5} 
      position="sticky" 
      top={0} 
      zIndex={1000}
      shadow="md"
    >
      <Flex maxW="container.xl" mx="auto" align="center">
        <ChakraLink 
          as={Link} 
          to="/" 
          color="white" 
          fontWeight="bold" 
          fontSize="2xl"
          display="flex"
          alignItems="center"
          _hover={{ textDecoration: 'none', color: 'pink.100' }}
        >
          <img 
            src="/images/logo.png" 
            alt="Logo" 
            style={{ height: '32px', marginRight: '10px' }} 
          />
          Tippy
        </ChakraLink>
        <Spacer />
        <Flex gap={4} align="center">
          <Button
            as={Link}
            to="/products"
            variant="ghost"
            color="white"
            _hover={{ bg: 'pink.600', color: 'white' }}
            leftIcon={<Icon as={FaStore} />}
            size="sm"
          >
            Products
          </Button>
          <Button
            as={Link}
            to="/cart"
            variant="ghost"
            color="white"
            _hover={{ bg: 'pink.600', color: 'white' }}
            leftIcon={<Icon as={FaShoppingCart} />}
            size="sm"
            position="relative"
          >
            Cart
            {cartItems?.length > 0 && (
              <Badge
                bg="pink.200"
                color="pink.800"
                position="absolute"
                top={-1}
                right={-1}
                borderRadius="full"
                size="sm"
              >
                {cartItems.length}
              </Badge>
            )}
          </Button>
          <Button
            as={Link}
            to="/orders"
            variant="ghost"
            color="white"
            _hover={{ bg: 'pink.600', color: 'white' }}
            leftIcon={<Icon as={FaClipboardList} />}
            size="sm"
          >
            Orders
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Navbar