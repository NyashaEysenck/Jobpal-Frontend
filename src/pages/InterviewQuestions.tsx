import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import { MessagesSquare, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const InterviewQuestions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<{ question: string; tips: string[] }[]>([]);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a role.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/interview-questions`, {
        method: 'POST',
        mode: 'cors',  // Explicitly enable CORS
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch questions.');
      }

      const data = await response.json();
      setSelectedRole(searchQuery);
      setQuestions(data.questions);
      setExpandedIndices([0, 1, 2]); // Expand first three questions by default
    } catch (err) {
      setError('An error occurred while fetching questions.');
      console.error(err);
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
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>

            {/* Questions Display */}
            {selectedRole && (
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
                            <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                              {question.tips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
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