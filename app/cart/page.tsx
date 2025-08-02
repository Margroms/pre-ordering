"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, isLoading } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="px-4 py-8 min-h-screen flex flex-col items-center justify-center text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          </motion.div>
          <motion.h1 
            className="text-2xl sm:text-3xl font-bold mb-4 text-white font-grimpt"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your Cart is Empty
          </motion.h1>
          <motion.p 
            className="text-gray-200 font-garet mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Add some delicious items to get started!
          </motion.p>
          <motion.a 
            href="/menu" 
            className="inline-block bg-[#eb3e04] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#d32f02] transition-colors font-grimpt"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Menu
          </motion.a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="px-4 py-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1 
        className="text-2xl sm:text-3xl font-bold mb-6 text-white font-grimpt"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Your Cart
      </motion.h1>
      
      <motion.div 
        className="space-y-3 sm:space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {cartItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-[url(/cartbg.svg)] p-4 rounded-xl shadow-sm border"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Item Image */}
                <motion.div 
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-[url(/cartbg.svg)] rounded-lg overflow-hidden flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const sibling = target.nextElementSibling as HTMLElement;
                      if (sibling) sibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-[url(/cartbg.svg)] flex items-center justify-center text-gray-500 text-xs" style={{display: 'none'}}>
                    IMG
                  </div>
                </motion.div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <motion.h2 
                    className="text-base sm:text-lg font-bold font-grimpt text-gray-800 truncate"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.h2>
                  <motion.p 
                    className="text-base sm:text-lg font-semibold text-[#eb3e04] font-garet"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {item.price}
                  </motion.p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
                    whileHover={{ scale: isLoading ? 1 : 1.1 }}
                    whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.span 
                    className="text-base sm:text-lg font-bold w-6 sm:w-8 text-center"
                    key={`${item.id}-${item.quantity}`}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.quantity}
                  </motion.span>
                  
                  <motion.button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
                    whileHover={{ scale: isLoading ? 1 : 1.1 }}
                    whileTap={{ scale: isLoading ? 1 : 0.9 }}
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Remove Button */}
                <motion.button
                  onClick={() => removeFromCart(item.id)}
                  disabled={isLoading}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg active:scale-95 transition-all disabled:opacity-50"
                  whileHover={{ scale: isLoading ? 1 : 1.1, rotate: isLoading ? 0 : 10 }}
                  whileTap={{ scale: isLoading ? 1 : 0.9 }}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.button>
              </div>
              
              {/* Total Price for this item - Mobile responsive */}
              <motion.div 
                className="mt-3 pt-3 border-t border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-garet">Item Total:</span>
                  <motion.p 
                    className="text-lg font-bold text-gray-800 font-garet"
                    key={`${item.id}-total-${item.quantity}`}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Cart Summary */}
      <motion.div 
        className="mt-6 sm:mt-8 bg-[url(/cartbg.svg)] p-4 sm:p-6 rounded-xl shadow-sm border"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <motion.div 
          className="flex justify-between items-center mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg sm:text-xl font-bold font-grimpt text-gray-800">Total</h2>
          <motion.p 
            className="text-xl sm:text-2xl font-bold text-[#eb3e04] font-garet"
            key={`total-${getCartTotal()}`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            ${getCartTotal().toFixed(2)}
          </motion.p>
        </motion.div>
        <motion.button 
          className="w-full bg-[#eb3e04] text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-[#d32f02] active:scale-95 transition-all font-grimpt disabled:opacity-70"
          disabled={isLoading}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
              />
              Processing...
            </motion.div>
          ) : (
            "Proceed to Checkout"
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Cart;