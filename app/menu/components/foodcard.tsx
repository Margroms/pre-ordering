import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface FoodcardProps {
  image: string;
  name: string;
  price: string[]; // Array of prices
  category: string;
  description: string;
  size?: string[]; // Array of sizes
  type?: string;
  onAdd: () => void;
}

function Foodcard({ image, name, price, category, description, size, type, onAdd }: FoodcardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { isLoading } = useCart();

  const handleAddClick = async () => {
    setIsAdding(true);
    await onAdd();
    setIsAdding(false);
  };

  // Display price range or single price
  const displayPrice = price.length > 1 
    ? `${price[0]} - ${price[price.length - 1]}`
    : price[0];

  return (
    <motion.div 
      className="w-full max-w-sm mx-auto bg-white text-black rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      layout
    >
      <div className="relative h-48 sm:h-52 bg-gray-200 overflow-hidden">
        {!imageLoaded && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
            initial={{ opacity: 1 }}
            animate={{ opacity: imageLoaded ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <motion.img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: imageLoaded ? 1 : 1.1, 
            opacity: imageLoaded ? 1 : 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
          whileHover={{ scale: 1.05 }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
            const sibling = target.nextElementSibling as HTMLElement;
            if (sibling) sibling.style.display = 'flex';
            setImageLoaded(true);
          }}
        />
        
        <motion.span 
          className="absolute inset-0 bg-gray-300 hidden items-center justify-center text-gray-500 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          IMAGE
        </motion.span>
      </div>
      
      <motion.div 
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <motion.h3 
              className="text-lg sm:text-xl font-bold font-grimpt text-gray-800 mb-1 line-clamp-2 flex-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {name}
            </motion.h3>
            {type && (
              <motion.span 
                className={`inline-block px-2 py-1 rounded text-xs font-bold ml-2 ${
                  type === 'Veg' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {type}
              </motion.span>
            )}
          </div>
          <motion.p 
            className="text-lg sm:text-xl font-bold text-[#eb3e04] font-garet"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            {displayPrice}
          </motion.p>
          {size && size.length > 1 && (
            <motion.p 
              className="text-sm text-gray-600 font-garet mt-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              Available in: {size.join(', ')}
            </motion.p>
          )}
        </div>
        
        <motion.button
          onClick={handleAddClick}
          disabled={isAdding || isLoading}
          className="w-full bg-[#eb3e04] text-white py-3 px-4 rounded-lg font-grimpt font-bold text-base hover:bg-[#d32f02] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: isAdding || isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isAdding || isLoading ? 1 : 0.98 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {isAdding || isLoading ? (
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
              />
              Adding...
            </motion.div>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              ADD TO CART
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default Foodcard;