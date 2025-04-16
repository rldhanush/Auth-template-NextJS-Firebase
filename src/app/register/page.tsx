'use client';

import {
  Box, Button, Container, FormControl, FormLabel,
  Heading, Input, VStack, Text, Link, InputGroup, InputRightElement,
  Checkbox
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import TimeZoneSelect from '@/components/TimeZoneSelect';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { auth } from '@/firebase/clientApp'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/clientApp';
import { createUserWithEmailAndPassword ,  sendEmailVerification  } from 'firebase/auth';

const validatePhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  return /^\+[1-9]\d{1,14}$/.test(phone); // E.164 format check
};

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),
  timeZone : z.string().min(1, "Time zone is required"),
  phoneNumber: z.string().optional()
    .refine(val => !val || validatePhoneNumber(val), {
      message: "Invalid phone number format"
    }),
  agreeToEmails: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

const SignupPage = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [timeZone, setTimeZone] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToEmails, setAgreeToEmails] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      // Save additional data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: data.firstName,
        email: data.email,
        phoneNumber: phoneNumber || null,
        timeZone: timeZone || 'Asia/Mumbai',
        agreeToEmails: agreeToEmails,
        createdAt: new Date()
      });
      
      await sendEmailVerification(user).then(() => {
        console.log("Verification email sent");
      }).catch((error) => {
        console.error("Error sending email verification:", error);
      });

      toast.success("Account created successfully! Please verify via link sent in email.");
      const heading = 'Sign up Successfull';
      const message = 'Account verification link has been successfully sent over your email. Please verify to log in.'
      router.push(`/register/success?heading=${encodeURIComponent(heading)}&message=${encodeURIComponent(message)}`)
      
    } catch (error) {
      console.error("Error creating user:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        toast.error("Email is already registered. Please use a different email or login.");
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error. Please check your internet connection and try again.");
      } else if (error.code === 'auth/too-many-requests') {
        toast.error("Too many attempts. Please try again later.");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Invalid email format. Please check and try again.");
      } else {
        toast.error("Error creating account. Please try again.");
      }
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="#BFA6A0">
      <Container maxW="md" bg="white" p={8} borderRadius="xl" boxShadow="2xl">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">Create Your Account</Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input placeholder="e.g. John" {...register("firstName")} />
                {errors.firstName && <Text color="red.500" fontSize="sm">{errors.firstName.message}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email Address</FormLabel>
                <Input type="email" placeholder="e.g. john@example.com" {...register("email")} />
                {errors.email && <Text color="red.500" fontSize="sm">{errors.email.message}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    {...register("password")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password.message}</Text>}
              </FormControl>

              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Box border="1px" borderColor="gray.300" borderRadius="md" px={3} py={2}>
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={(value) => {
                      setPhoneNumber(value);
                      if (value && !validatePhoneNumber(value)) {
                        // Show error immediately
                        setValue('phoneNumber', value, { shouldValidate: true });
                      }
                    }}
                    defaultCountry="US"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '1rem',
                    }}
                  />
                </Box>
              </FormControl>

              <FormControl isInvalid={!!errors.timeZone}>
                <FormLabel>Time Zone</FormLabel>
                <TimeZoneSelect 
                  value={timeZone} 
                  onChange={(value) => {
                    setTimeZone(value);
                    setValue('timeZone', value);
                  }} 
                />
                {errors.timeZone && <Text color="red.500" fontSize="sm">{errors.timeZone.message}</Text>}
              </FormControl>

              <Checkbox
                colorScheme="blue"
                isChecked={agreeToEmails}
                onChange={(e) => setAgreeToEmails(e.target.checked)}
              >
                Get reminders and updates via email
              </Checkbox>

              <Button colorScheme="blue" size="lg" type="submit" w="full">
                Sign Up
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="xs" color="gray.500">
            Already have an account?{' '}
            <Link color="blue.500" fontWeight="medium" onClick={() => router.push('/login')}>
              Log in
            </Link>
          </Text>
          
          <Text textAlign="center" fontSize="xs" color="gray.500">
            Want to be a Tutor ?{' '}
            <Link color="blue.500" fontWeight="medium" onClick={() => router.push('/login')}>
              Tutor Sign up
            </Link>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignupPage;


// TO DO : 
// ReCaptcha
// Ratelimiting calls to signup page
