import { useState, useEffect } from 'react'
import { 
  Container, 
  Grid, 
  Box, 
  Image, 
  Text, 
  Heading, 
  Alert, 
  AlertIcon,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

function Products() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Attempting to fetch products...');
        const response = await fetch('http://localhost:3001/api/products', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products received:', data);
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Could not load products. Please try again later.');
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box bg="pink.50" minH="100vh" py={10}>
      <Container maxW="container.xl">
        <Heading mb={8} textAlign="center" color="pink.600" fontSize="3xl">
          Tippy Preloved Store
        </Heading>
        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            Error loading products: {error}
          </Alert>
        )}
        <Grid 
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)"
          }} 
          gap={8}
        >
          {products.map((product) => (
            <Box
              key={product.id}
              borderWidth="1px"
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              boxShadow="lg"
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            >
              <Box position="relative" height="250px">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  height="100%"
                  width="100%"
                  objectFit="cover"
                  fallbackSrc="/placeholder.svg"
                  onError={(e) => { e.target.src = '/placeholder.svg' }}
                />
              </Box>
              <Box p={6}>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md" color="pink.700" noOfLines={2}>
                    {product.name}
                  </Heading>
                  <Text fontWeight="bold" fontSize="xl" color="pink.500">
                    Rp {(Number(product.price) || 0).toLocaleString('id-ID')}
                  </Text>
                  <Text color="gray.600" fontSize="sm" noOfLines={3}>
                    {product.description}
                  </Text>
                  <Button 
                    colorScheme="pink" 
                    size="lg"
                    width="100%"
                    onClick={() => {
                      addToCart(product);
                      toast({
                        title: 'Added to cart',
                        description: `${product.name} has been added to your cart`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Add to Cart
                  </Button>
                </VStack>
              </Box>
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Products