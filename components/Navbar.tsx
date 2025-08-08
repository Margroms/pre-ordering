"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.nav 
      className="shadow-md p-4 bg-[#eb3e04]"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
    >
      <div className="container mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu
            className="text-white w-8 h-8 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </motion.div>
        
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/navbar.svg"
              alt="Harvey's Logo"
              width={180}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </motion.div>
        </Link>
        
        <Link href="/cart" className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <ShoppingCart className="text-white w-8 h-8 cursor-pointer" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    transition: {
                      type: "spring" as const,
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                  exit={{ 
                    scale: 0, 
                    opacity: 0,
                    transition: {
                      duration: 0.2
                    }
                  }}
                  key={cartCount}
                >
                  <motion.span
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {cartCount}
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
        
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div 
                className="fixed top-0 left-0 w-64 h-full bg-[url(/modalbg.svg)] shadow-lg z-50 p-4 text-white font-bold font-grimpt"
                initial={{ x: -264, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -264, opacity: 0 }}
                transition={{ type: "spring" as const, damping: 25, stiffness: 400 }}
              >
                <motion.button
                  className="text-white mb-6 flex items-center text-xl"
                  onClick={() => setSidebarOpen(false)}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="mr-2 text-2xl">←</span> Back
                </motion.button>
                <motion.ul 
                  className="space-y-6 text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                  >
                    <Link 
                      href="/" 
                      onClick={() => setSidebarOpen(false)}
                      className="block text-white hover:text-[#eb3e04] transition-colors"
                    >
                      Home
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                  >
                    <Link 
                      href="/cart" 
                      onClick={() => setSidebarOpen(false)}
                      className="block text-white hover:text-[#eb3e04] transition-colors"
                    >
                      Cart
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                  >
                    <Link 
                      href="/privacy-policy" 
                      onClick={() => setSidebarOpen(false)}
                      className="block text-white hover:text-[#eb3e04] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ x: 10, scale: 1.05 }}
                  >
                    <Link 
                      href="/terms-and-conditions" 
                      onClick={() => setSidebarOpen(false)}
                      className="block text-white hover:text-[#eb3e04] transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </motion.li>
                </motion.ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
