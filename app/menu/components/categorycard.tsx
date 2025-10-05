"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  image: string;
  itemCount: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, itemCount, onClick }) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <h3 className="text-xl font-grimpt font-bold text-white mb-2">{name}</h3>
        <p className="text-gray-300 font-garet text-sm">{itemCount} items</p>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
