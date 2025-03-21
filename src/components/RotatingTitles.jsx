import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const titles = [
  "Fullstack Developer",
  "Cloud & API Specialist",
  "Mobile App Developer",
  "AI Enthusiast"
];

const RotatingTitles = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative">
      {titles.map((title, index) => (
        <motion.div
          key={title}
          className="absolute w-full text-lg md:text-xl font-medium"
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: index === currentIndex ? 0 : index < currentIndex ? -50 : 50,
            opacity: index === currentIndex ? 1 : 0,
          }}
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <span className="text-indigo-600">{title}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default RotatingTitles; 