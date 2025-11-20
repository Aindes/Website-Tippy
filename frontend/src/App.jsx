import { Box, ChakraProvider } from '@chakra-ui/react'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Payment from './pages/Payment'
import { CartProvider } from './context/CartContext'
import Cart from './pages/Cart'
import Home from './pages/Home'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <CartProvider>
            <Box minH="100vh" bg="gray.50" display="flex" flexDirection="column">
              <Navbar />
              <Box as="main" p={0} flex="1 0 auto">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment/:orderId" element={<Payment />} />
                </Routes>
              </Box>
              <Footer />
            </Box>
        </CartProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App