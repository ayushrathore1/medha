import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <motion.div
          className="mb-8"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-9xl md:text-[180px] font-extrabold leading-none" style={{ color: "var(--action-primary)" }}>
            404
          </div>
        </motion.div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Oops! Page Not Found
        </h1>
        <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back Button */}
        <Link to="/dashboard">
          <Button variant="primary" size="large">
            Go Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
