'use client';
import { useState } from 'react';
import {
  Box, Button, Container, FormControl, FormLabel,
  Heading, Input, VStack, Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import {auth} from '@/firebase/clientApp'
import { sendPasswordResetEmail  } from 'firebase/auth';
import { useRouter } from 'next/navigation'

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: ForgotPasswordData) => {
    console.log("Forgot password for:", data.email);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("If this email is registered, a password reset link will be sent.");
      const heading = 'Password reset';
      const message = 'Password reset link has been successfully sent over your email. Please verify to log in.'
      router.push(`/register/success?heading=${encodeURIComponent(heading)}&message=${encodeURIComponent(message)}`);
    }
    catch(error){
      console.error("Password reset error:", error);
    }finally{
      setIsLoading(false);
    }
    
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#BFA6A0">
      <Container maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="2xl">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">Forgot Password?</Heading>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Enter your email and we&apos;ll send you instructions to reset your password.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="e.g. john@example.com"
                  {...register("email")}
                />
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
              </FormControl>

              <Button colorScheme="blue" size="lg" type="submit" w="full" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
