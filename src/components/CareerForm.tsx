
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Search, Loader2 } from 'lucide-react';

const CareerForm: React.FC<{
  onSubmit: (formData: { program: string }) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [program, setProgram] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!program.trim()) {
      setError('Please enter a program or field of study');
      return;
    }
    setError('');
    onSubmit({ program });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="form-container"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-full">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-medium">Career Recommendation</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="program" className="form-label">
            Enter your program or field of study
          </label>
          <div className="relative">
            <input
              type="text"
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="e.g. Computer Science, Business Administration"
              className="form-input pl-10"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "program-error" : undefined}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
          </div>
          {error && (
            <p id="program-error" className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="form-submit inline-flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Get Recommendations'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CareerForm;
