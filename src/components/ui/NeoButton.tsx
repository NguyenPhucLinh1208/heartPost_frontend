"use client";

import { motion } from "framer-motion";
import React from "react";

interface NeoButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  children: React.ReactNode;
  className?: string;
}

const NeoButton = ({ children, className, ...props }: NeoButtonProps) => (
    <motion.button
      whileHover={{ boxShadow: '6px 6px 0px #1C1C1C', transform: 'translate(-2px, -2px)' }}
      whileTap={{ boxShadow: '2px 2px 0px #1C1C1C', transform: 'translate(2px, 2px)' }}
      transition={{ duration: 0.15 }}
      className={`flex items-center justify-center gap-2 border-2 border-foreground bg-accent text-foreground font-bold py-3 px-8 shadow-neo ${className}`}
      {...props}
    >
      {children}
    </motion.button>
);

export default NeoButton;