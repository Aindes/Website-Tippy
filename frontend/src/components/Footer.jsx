import { Box, Flex, Text, Image } from '@chakra-ui/react';

function Footer() {
  return (
    <Box
      as="footer"
      bg="pink.700"
      color="white"
      w="100%"
      py={5}
      px={8}
      boxShadow="0 -2px 8px rgba(0,0,0,0.05)"
      mt="auto"
    >
      <Flex align="center" justify="space-between" maxW="100vw">
        <Flex align="center">
          <Image src="/images/logo.png" alt="Logo" h="32px" mr={3} />
          <Text fontWeight="bold" fontSize="xl">Tippy</Text>
        </Flex>
        <Text fontSize="sm" textAlign="right">
          Copyright © 2025 Tippy | All Rights Reserved
        </Text>
      </Flex>
    </Box>
  );
}

export default Footer;
