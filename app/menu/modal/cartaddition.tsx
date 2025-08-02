"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus } from 'lucide-react';

interface CartAdditionProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    image: string;
    name: string;
    price: string;
    description: string;
    category: string;
  } | null;
}

function CartAddition({ isOpen, onClose, item }: CartAdditionProps) {
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (item) {
      await addToCart(item, quantity);
      setQuantity(1);
      onClose();
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!item) return null;

  const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
  const totalPrice = (itemPrice * quantity).toFixed(2);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { 
      y: "100%",
      opacity: 0
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 400
      }
    },
    exit: { 
      y: "100%",
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal - slides from bottom */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 text-white bg-[url(/modalbg.svg)] rounded-t-3xl z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="p-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
              >
                <X className="w-5 h-5 text-black" />
              </motion.button> 

              {/* Item image */}
              <motion.div 
                className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '';
                    e.currentTarget.className = 'w-full h-full flex items-center justify-center bg-gray-300 text-gray-500';
                    e.currentTarget.innerHTML = 'IMAGE';
                  }}
                />
              </motion.div>

              {/* Item details */}
              <motion.div className="mb-6" variants={itemVariants}>
                <motion.h2 
                  className="text-2xl font-bold font-grimpt mb-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {item.name}
                </motion.h2>
                <motion.p 
                  className="text-lg font-semibold text-[#eb3e04] font-garet mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {item.price}
                </motion.p>
                <motion.p 
                  className="text-white font-garet leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {item.description}
                </motion.p>
              </motion.div>

              {/* Quantity selector */}
              <motion.div 
                className="flex items-center justify-between mb-6"
                variants={itemVariants}
              >
                <span className="text-lg font-semibold">Quantity</span>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 text-black h-4" />
                  </motion.button>
                  
                  <motion.span 
                    className="text-xl font-bold w-8 text-center"
                    key={quantity}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {quantity}
                  </motion.span>
                  
                  <motion.button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-4 text-black h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Add to cart button */}
              <motion.button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="inline-block rounded bg-transparent border-2 border-white px-8 py-4 text-white font-grimpt text-2xl font-bold shadow-lg transition-transform w-full disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? (
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                    />
                    Adding to Cart...
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Add to Cart - ${totalPrice}
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartAddition;