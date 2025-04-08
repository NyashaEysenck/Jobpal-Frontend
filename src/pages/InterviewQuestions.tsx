import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { MessagesSquare, Search, ChevronDown, ChevronUp, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

const InterviewQuestions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; tips: string[] }[]>([]);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a role.');
      return;
    }

    setIsLoading(true);
    setError(null);
    // Clear previous results immediately when starting a new search
    setQuestions([]);
    setSelectedRole('');
    setExpandedIndices([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL || ''}/interview-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: searchQuery }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions.');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions were found for this role.');
      }

      setSelectedRole(searchQuery);
      setQuestions(data.questions);
      
      // Expand first three questions or all if fewer than 3
      const initialExpandCount = Math.min(3, data.questions.length);
      setExpandedIndices(Array.from({ length: initialExpandCount }, (_, i) => i));
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching interview questions:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching questions.');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PageTransition>
      <div className="pt-20 min-h-screen bg-gradient-to-b from-background to-background/90">
        <div className="page-container">
          <div className="text-center mb-10">
            <motion.div
              className="inline-block px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Interview Prep
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Common Interview Questions
            </motion.h1>
            <motion.p
              className="text-foreground/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Prepare for your next interview with common questions and tips for various roles
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="form-container mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <MessagesSquare className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Enter a Role</h3>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter a role (e.g., Software Engineer)..."
                  className="form-input pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Search'
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive-foreground">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{error}</p>
                      {retryCount < 3 && (
                        <button 
                          onClick={handleRetry} 
                          className="mt-2 flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                        >
                          <RefreshCw className="h-3 w-3" /> Try again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Questions Display */}
            {selectedRole && questions.length > 0 && (
              <div className="form-container">
                <h3 className="text-xl font-medium mb-6">
                  Interview Questions for {selectedRole}
                </h3>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border border-border rounded-lg overflow-hidden bg-background/50"
                      >
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-secondary/30 transition-colors"
                          onClick={() => toggleExpand(index)}
                        >
                          <h4 className="font-medium">
                            <span className="text-primary mr-2">{index + 1}.</span>
                            {question.question}
                          </h4>
                          <button className="text-foreground/60">
                            {expandedIndices.includes(index) ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>

                        {expandedIndices.includes(index) && (
                          <div className="p-4 border-t border-border bg-secondary/20">
                            <p className="text-foreground/80 mb-3">
                              When answering this question, consider:
                            </p>
                            {question.tips && question.tips.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                                {question.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex}>{tip}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-foreground/60 italic">No specific tips available for this question.</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default InterviewQuestions;