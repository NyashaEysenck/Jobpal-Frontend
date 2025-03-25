
import React from 'react';
import { ArrowDownIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  const scrollToContent = () => {
    const contentSection = document.getElementById('content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/90 z-0" />
      
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-40 right-10 w-96 h-96 rounded-full bg-primary/70 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/50 animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Career Guidance Platform
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Craft Your <span className="text-primary">Ideal Career</span> Path
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Get personalized career recommendations, create professional CVs, prepare for interviews, 
            and receive expert guidance for your professional journey.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="#content" 
              onClick={(e) => { e.preventDefault(); scrollToContent(); }}
              className="button-glass px-8 py-3 text-base font-medium"
            >
              Get Started
            </a>
            
            <a 
              href="#how-it-works"
              className="px-8 py-3 border border-border rounded-md text-base font-medium 
              hover:bg-secondary/80 transition-colors"
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={scrollToContent}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDownIcon className="h-6 w-6 text-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
