'use client';

import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the query params for heading and message
  const heading = searchParams.get('heading') || 'Success';
  const message = searchParams.get('message') || 'Your action was successful!';

  // Redirect to home page after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 8000); // 8 seconds delay

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
      <Container maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="lg">
        <VStack spacing={5}>
          <Heading size="lg" textAlign="center" color="green.500">
            {heading}
          </Heading>
          <Text fontSize="md" textAlign="center" color="gray.600">
            {message}
          </Text>
          <Text fontSize="sm" textAlign="center" color="gray.500">
            You will be redirected to the homepage shortly...
          </Text>
          <Button colorScheme="blue" onClick={() => router.push('/')}>
            Go to Home Now
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default SuccessPage;
