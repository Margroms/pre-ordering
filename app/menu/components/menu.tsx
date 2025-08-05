"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Foodcard from './foodcard';
import { menuItems } from '@/data/menu';
import CartAddition from '../modal/cartaddition';

interface MenuItem {
  image: string;
  name: string;
  price: string[]; // Array of prices
  description: string;
  category: string;
  size?: string[]; // Array of sizes
  type?: string;
}

function Menu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleAddClick = async (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
            >
              <Foodcard
                image={item.image}
                name={item.name}
                price={item.price}
                description={item.description}
                category={item.category}
                size={item.size}
                type={item.type}
                onAdd={() => handleAddClick(item)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <CartAddition 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        item={selectedItem} 
      />
    </motion.div>
  );
}

export default Menu;