import React from "react";
import { motion } from "framer-motion";

const MenuButton = (props) => {
    const { label, onClick } = props;
    
    return (
        <motion.button
            onClick={onClick}
            className="text-2xl font-bold cursor-pointer relative group block my-4"
            whileHover={{ x: 10 }}
            whileTap={{ scale: 0.95 }}
        >
            <span className="relative z-10 text-gray-800 group-hover:text-indigo-600 transition-colors">
                {label}
            </span>
            <motion.span 
                className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-400 rounded-full z-0"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.3, delay: 0.2 }}
                viewport={{ once: true }}
            />
            <motion.span 
                className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 rounded-full z-0"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    )
}
export default MenuButton