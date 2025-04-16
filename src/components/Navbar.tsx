'use client';

import React from 'react';
import { Box, Flex, Button, HStack, Text, useDisclosure} from '@chakra-ui/react';
import { Menu, User, Calendar, Settings, BookOpen, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  isHomePage?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isHomePage = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="nav" bg="white" boxShadow="sm" width="100%" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          {/* Logo */}
          <Link href="/" passHref>
            <Box cursor="pointer">
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">LanguaTalk</Text>
            </Box>
          </Link>
        </Flex>

        {/* Mobile menu button */}
        <Box display={{ base: 'block', md: 'none' }} onClick={isOpen ? onClose : onOpen}>
          <Menu size={24} />
        </Box>

        {/* Desktop menu */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {isHomePage ? (
            // Home page navigation items
            <>
              <Link href="/tutors" passHref>
                <Button
                  variant="ghost"
                  leftIcon={<User size={18} />}
                >
                  Browse Tutors
                </Button>
              </Link>
              <Link href="/reviews" passHref>
                <Button variant="ghost" leftIcon={<BookOpen size={18} />}>
                  See Reviews
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button colorScheme="blue" variant="outline">
                  Log In
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button colorScheme="blue">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            // Dashboard navigation items
            <>
              <Link href="/profile" passHref>
                <Flex as={Button} variant="ghost" alignItems="center" gap={2}>
                  <User size={18} />
                  <Text>Profile</Text>
                </Flex>
              </Link>
              <Link href="/settings" passHref>
                <Button variant="ghost" leftIcon={<Settings size={18} />}>
                  Settings
                </Button>
              </Link>
              <Link href="/classes" passHref>
                <Button variant="ghost" leftIcon={<BookOpen size={18} />}>
                  Classes
                </Button>
              </Link>
              <Link href="/calendar" passHref>
                <Button variant="ghost" leftIcon={<Calendar size={18} />}>
                  Calendar
                </Button>
              </Link>
              <Button variant="ghost" leftIcon={<LogOut size={18} />} onClick={() => console.log('Logout clicked')}>
                Logout
              </Button>
            </>
          )}
        </HStack>
      </Flex>

      {/* Mobile menu */}
      <Box
        display={{ base: isOpen ? 'block' : 'none', md: 'none' }}
        pb={4}
      >
        <Flex direction="column" gap={4}>
          {isHomePage ? (
            // Home page mobile navigation
            <>
              <Link href="/tutors" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<User size={18} />} my={1}>
                  Browse Tutors
                </Button>
              </Link>
              <Link href="/reviews" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<BookOpen size={18} />} my={1}>
                  See Reviews
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button colorScheme="blue" variant="outline" w="full" my={1}>
                  Log In
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button colorScheme="blue" w="full" my={1}>
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            // Dashboard mobile navigation
            <>
              <Link href="/profile" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<User size={18} />} my={1}>
                  Profile
                </Button>
              </Link>
              <Link href="/settings" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<Settings size={18} />} my={1}>
                  Settings
                </Button>
              </Link>
              <Link href="/classes" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<BookOpen size={18} />} my={1}>
                  Classes
                </Button>
              </Link>
              <Link href="/calendar" passHref>
                <Button variant="ghost" w="full" justifyContent="flex-start" leftIcon={<Calendar size={18} />} my={1}>
                  Calendar
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                w="full" 
                justifyContent="flex-start" 
                leftIcon={<LogOut size={18} />} 
                onClick={() => console.log('Logout clicked')}
                my={1}
              >
                Logout
              </Button>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default Navbar;