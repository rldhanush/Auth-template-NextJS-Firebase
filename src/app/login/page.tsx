'use client';

import {
  Box, Button, Container, FormControl, FormLabel,
  Heading, Input, VStack, Text, Link, InputGroup, InputRightElement, InputLeftElement
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import { Mail, Key } from 'lucide-react';

import { signIn } from "next-auth/react";

import { auth } from "@/firebase/clientApp"
import { signInWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const LoginPage = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [unverifiedPassword, setUnverifiedPassword] = useState('');


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
  
    try {
      setLoading(true); 
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      setLoading(false);
      if (result?.error) {
        if (result.error == "Email not verified"){
          setServerError("Please verify your email before logging in");
          toast.warning("Please verify your email before logging in");
          setUnverifiedEmail(data.email);
          setUnverifiedPassword(data.password);
        }
        else {
          setServerError("Invalid email or password.");
          toast.error(result.error || "Login failed");
        }
      } else {
        toast.success("Login successful!");
        router.push('/dashboard');
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      toast.error("Server error");
      console.error(err);
    }
  };

  const handleResendEmail = async () => {
    try{
      const userCred = await signInWithEmailAndPassword(auth, unverifiedEmail, unverifiedPassword);
      if (! userCred.user.emailVerified){
        await sendEmailVerification(userCred.user)
        console.log('Verification email sent');
        toast.success('Verification email sent. Please check your mail.')
        setServerError('');
        const heading = 'Verification Link';
        const message = 'Account verification link has been successfully sent over your email. Please verify to log in.'
        router.push(`/register/success?heading=${encodeURIComponent(heading)}&message=${encodeURIComponent(message)}`)
      }
      await signOut(auth);
    }
    catch(error){
      if (error.code === 'auth/too-many-requests') {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error("Error sending verification email. Please try again.");
      }
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#BFA6A0">
      <Container maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="2xl">
        <VStack spacing={6} align="stretch">
          <VStack spacing={1} align="stretch" mb={1}>
              <Heading textAlign="center" color="gray.700" mb={3}>
                Langua Learn
              </Heading>
              <Text fontSize="xl" fontWeight="semibold" color="blue.500" my={2}>
                Sign in
              </Text>
              <Box borderBottom="1px" borderColor="gray.200" my={1} />
          </VStack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">

              {/* Email Input with Icon */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Mail size={18}/>
                  </InputLeftElement>
                  <Input type="email" placeholder="e.g. john@example.com" {...register("email")} />
                </InputGroup>
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
              </FormControl>

              {/* "Don't have account?" - right below email */}
              <Text fontSize="xs" color="gray.500" mt={-2}>
                <Link color="blue.500" fontWeight="medium" as={NextLink} href="/register">
                  Don&apos;t have an account?{' '}
                </Link>
              </Text>

              {/* Password Input with Key Icon */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Key size={18} />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    {...register("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
              </FormControl>

              {/* Forgot password - just below password input */}
              <Text fontSize="xs" color="blue.50" mt={-2}>
                <Link color="blue.500" fontWeight="medium" as={NextLink} href="/login/forgot-password">
                  Forgot your password?{' '}
                </Link>
              </Text>

              {serverError && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {serverError}
                </Text>
              )}

              <Button isLoading={loading} colorScheme="blue" size="lg" type="submit" w="full">
                Log In
              </Button>

              {/* Resend verification link - shown below button */}
              {serverError == "Please verify your email before logging in" && (
                <Text textAlign="center" fontSize="sm" color="gray.500">
                  Didn&apos;t receive the verification email?{' '}
                  <Link
                    color="blue.500"
                    fontWeight="medium"
                    onClick={handleResendEmail}
                    cursor="pointer"
                  >
                    Resend verification email
                  </Link>
                </Text>
              )}
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;


// TODO : 
// reset password
// verify email before logging in