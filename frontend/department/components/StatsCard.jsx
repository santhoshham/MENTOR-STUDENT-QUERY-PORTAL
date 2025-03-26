import React from "react";
import { motion } from "framer-motion"; // Using framer-motion instead of react-motion

const StatsCard = ({ title, count, icon, color = "primary", index = 0 }) => {
  // Define variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const countVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.2 + (index * 0.1), 
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      className={`d-stats-card d-stats-${color}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{ "--index": index }}
    >
      <div className="d-stats-icon-container">
        {icon}
      </div>
      <div className="d-stats-content">
        <h3 className="d-stats-title">{title}</h3>
        <motion.div
          className="d-stats-count"
          variants={countVariants}
          initial="hidden"
          animate="visible"
        >
          {typeof count === 'number' ? count.toLocaleString() : count}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;