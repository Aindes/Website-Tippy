import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  Grid,
  useColorModeValue,
  Icon,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaShoppingBag, FaEthereum, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

function FeatureCard({ icon, title, description }) {
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.700')}
      p={8}
      rounded="xl"
      shadow="lg"
      spacing={4}
      borderWidth="1px"
      borderColor="pink.100"
      _hover={{ transform: 'translateY(-5px)', shadow: '2xl' }}
      transition="all 0.3s"
    >
      <Icon as={icon} w={10} h={10} color="pink.500" />
      <Heading size="md" color="pink.700">
        {title}
      </Heading>
      <Text color="gray.600" textAlign="center">
        {description}
      </Text>
    </VStack>
  );
}

function Home() {
  // Ref untuk fitur section
  const featuresRef = React.useRef(null);

  const handleLearnMore = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box as="main" pt={0} px={0} flex="1 0 auto">
      {/* Hero Section */}
      <Box
        bg="pink.50"
        minH="600px"
        display="flex"
        alignItems="center"
        position="relative"
        overflow="hidden"
        borderBottom="4px solid"
        borderColor="pink.100"
      >
        <Container maxW="container.xl" pt={1} pb={8}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack align="flex-start" spacing={8} animation="fadeIn 0.8s ease-in">
              <Heading fontSize={{ base: '4xl', md: '6xl' }} color="pink.700" lineHeight="shorter" fontWeight="bold" textShadow="2px 2px 4px rgba(0,0,0,0.1)">
                Find Your Perfect Preloved Items
              </Heading>
              <Text fontSize={{ base: 'lg', md: '2xl' }} color="gray.600" maxW="600px" lineHeight="tall">
                Discover a curated collection of high-quality preloved fashion and accessories.
                Shop sustainably with blockchain-powered security.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={Link}
                  to="/products"
                  size="lg"
                  colorScheme="pink"
                  px={10}
                  py={7}
                  rounded="full"
                  shadow="lg"
                  fontSize="xl"
                  fontWeight="bold"
                  _hover={{ transform: 'translateY(-3px)', shadow: 'xl', bg: 'pink.500' }}
                  transition="all 0.3s"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  colorScheme="pink"
                  px={8}
                  py={7}
                  rounded="full"
                  fontSize="xl"
                  _hover={{ transform: 'translateY(-2px)', bg: 'pink.50' }}
                  transition="all 0.3s"
                  onClick={handleLearnMore}
                >
                  Learn More
                </Button>
              </HStack>
            </VStack>
            <Box display={{ base: 'none', md: 'block' }} transform="translateY(20px)" animation="float 3s ease-in-out infinite">
              <Image
                src="/images/shopping.jpeg"
                alt="Shopping illustration"
                fallbackSrc="https://via.placeholder.com/500x400"
                rounded="2xl"
                shadow="2xl"
                transition="transform 0.3s"
                _hover={{ transform: 'scale(1.02)' }}
              />
            </Box>
          </Grid>
        </Container>
        {/* Decorative Elements */}
        <Box position="absolute" top="20%" left="5%" w="300px" h="300px" bg="pink.100" opacity="0.1" borderRadius="full" filter="blur(40px)" zIndex="0" />
        <Box position="absolute" bottom="10%" right="5%" w="200px" h="200px" bg="pink.200" opacity="0.1" borderRadius="full" filter="blur(30px)" zIndex="0" />
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20} ref={featuresRef}>
        <VStack spacing={16}>
          <Heading 
            textAlign="center" 
            color="pink.700" 
            mb={4}
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
          >
            Why Choose Tippy?
          </Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} w="full">
            <FeatureCard
              icon={FaShoppingBag}
              title="Authentic Items"
              description="All items are carefully verified and authenticated before listing to ensure the highest quality for our customers."
            />
            <FeatureCard
              icon={FaEthereum}
              title="Secure Payments"
              description="Experience safe and transparent transactions with our blockchain-powered payment system."
            />
            <FeatureCard
              icon={FaLeaf}
              title="Sustainable Fashion"
              description="Join our eco-friendly community and support sustainable fashion by giving preloved items a stylish second life."
            />
          </Grid>
          <Box textAlign="center" pt={10}>
            <Button
              as={Link}
              to="/products"
              size="lg"
              colorScheme="pink"
              px={12}
              py={7}
              fontSize="xl"
              rounded="full"
              shadow="lg"
              _hover={{ transform: 'translateY(-3px)', shadow: 'xl' }}
              transition="all 0.3s"
            >
              Start Shopping Now
            </Button>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default Home;