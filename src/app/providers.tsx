'use client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider } from 'next-auth/react';


const theme = extendTheme({
    styles: {
      global: {
        body: {
          bg: 'inherit',
          color: 'inherit'
        }
      }
    }
  })

  export function Providers({ children }: { children: ReactNode }) {
    return (
      <SessionProvider>
        <ChakraProvider theme={theme} resetCSS={false}>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </ChakraProvider>
      </SessionProvider>
      )
  }