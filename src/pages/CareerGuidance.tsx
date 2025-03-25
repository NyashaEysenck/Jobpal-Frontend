import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Award,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Search,
  Loader2,
} from 'lucide-react';

const CareerGuidance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);

  // Handle field input change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission and request career guidance
  const handleFieldSelect = () => {
    if (!searchQuery.trim()) return;

    setSelectedField(searchQuery);
    setIsLoading(true);

    // Send POST request to get career guidance for the selected field
    fetch('http://localhost:5000/career_guidance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Make sure server allows this origin
      },
      body: JSON.stringify({ program: searchQuery }), // Send field as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        setAdvice(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching career guidance:', error);
        setIsLoading(false);
      });
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
              Career Insights
            </motion.div>
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Career Guidance & Advice
            </motion.h1>
            <motion.p
              className="text-foreground/70 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Get valuable insights on skills, certifications, career paths, and industry trends
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="form-container mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-medium">Enter Your Field of Study</h3>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleFieldChange}
                  placeholder="Enter your field of study..."
                  className="form-input pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              </div>

              <button
                onClick={handleFieldSelect}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg"
              >
                Get Career Guidance
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              advice && (
                <div className="space-y-6">
                  {/* Key Skills Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="form-container"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Key Skills</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {advice.keySkills.map((skill: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 border border-border rounded-md bg-background/50"
                        >
                          <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Career Paths Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="form-container"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Career Paths</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {advice.careerPaths.map((path: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 border border-border rounded-md bg-background/50"
                        >
                          <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{path}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Certifications Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="form-container"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Recommended Certifications</h3>
                    </div>
                    <div className="space-y-3">
                      {advice.certifications.map((cert: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 border border-border rounded-md bg-background/50"
                        >
                          <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Industry Trends Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="form-container"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium">Industry Trends</h3>
                    </div>
                    <div className="space-y-3">
                      {advice.industryTrends.map((trend: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 border border-border rounded-md bg-background/50"
                        >
                          <ChevronRight className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{trend}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CareerGuidance;