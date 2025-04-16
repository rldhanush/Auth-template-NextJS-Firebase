import Navbar from "@/components/Navbar";
import { Box } from "@chakra-ui/react";

// This is the main entry point for your Next.js application
export default function Home() {
  return (
    <Box bg="white" color="gray.700" minH="100vh">
      <Navbar isHomePage={true} />
      {/* Rest of your content */}
    </Box>
  );
  
}
