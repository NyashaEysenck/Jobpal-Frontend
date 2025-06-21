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
  AlertCircle,
  RefreshCw,
  X,
} from 'lucide-react';

interface ErrorState {
  hasError: boolean;
  message: string;
  type: 'network' | 'validation' | 'server' | 'unknown';
}

const CareerGuidance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
    type: 'unknown'
  });

  // Clear error state
  const clearError = () => {
    setError({ hasError: false, message: '', type: 'unknown' });
  };

  // Handle field input change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear any previous errors when user starts typing
    if (error.hasError) {
      clearError();
    }
  };

  // Validate input
  const validateInput = (query: string): boolean => {
    if (!query.trim()) {
      setError({
        hasError: true,
        message: 'Please enter a field of study to get career guidance.',
        type: 'validation'
      });
      return false;
    }

    if (query.trim().length < 2) {
      setError({
        hasError: true,
        message: 'Please enter at least 2 characters for your field of study.',
        type: 'validation'
      });
      return false;
    }

    if (query.trim().length > 100) {
      setError({
        hasError: true,
        message: 'Field of study should be less than 100 characters.',
        type: 'validation'
      });
      return false;
    }

    return true;
  };

  // Handle network errors
  const handleNetworkError = (error: any) => {
    if (!navigator.onLine) {
      setError({
        hasError: true,
        message: 'No internet connection. Please check your connection and try again.',
        type: 'network'
      });
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setError({
        hasError: true,
        message: 'Unable to connect to the server. Please try again later.',
        type: 'network'
      });
    } else {
      setError({
        hasError: true,
        message: 'Network error occurred. Please check your connection and try again.',
        type: 'network'
      });
    }
  };

  // Handle server response errors
  const handleServerError = (response: Response, data?: any) => {
    switch (response.status) {
      case 400:
        setError({
          hasError: true,
          message: data?.message || 'Invalid request. Please check your input and try again.',
          type: 'validation'
        });
        break;
      case 404:
        setError({
          hasError: true,
          message: 'Service not found. Please try again later.',
          type: 'server'
        });
        break;
      case 429:
        setError({
          hasError: true,
          message: 'Too many requests. Please wait a moment and try again.',
          type: 'server'
        });
        break;
      case 500:
        setError({
          hasError: true,
          message: 'Server error occurred. Please try again later.',
          type: 'server'
        });
        break;
      case 503:
        setError({
          hasError: true,
          message: 'Service temporarily unavailable. Please try again later.',
          type: 'server'
        });
        break;
      default:
        setError({
          hasError: true,
          message: `Server error (${response.status}). Please try again later.`,
          type: 'server'
        });
    }
  };

  // Validate response data
  const validateResponseData = (data: any): boolean => {
    if (!data) {
      setError({
        hasError: true,
        message: 'No data received from server. Please try again.',
        type: 'server'
      });
      return false;
    }

    const requiredFields = ['keySkills', 'careerPaths', 'certifications', 'industryTrends'];
    const missingFields = requiredFields.filter(field => 
      !data[field] || !Array.isArray(data[field]) || data[field].length === 0
    );

    if (missingFields.length > 0) {
      setError({
        hasError: true,
        message: 'Incomplete data received. Please try again or contact support.',
        type: 'server'
      });
      return false;
    }

    return true;
  };

  // Handle form submission and request career guidance
  const handleFieldSelect = async () => {
    // Clear previous errors and advice
    clearError();
    setAdvice(null);

    // Validate input
    if (!validateInput(searchQuery)) {
      return;
    }

    setSelectedField(searchQuery);
    setIsLoading(true);

    try {
      // Check if environment variable exists
      const baseUrl = import.meta.env.VITE_APP_BASE_URL;
      if (!baseUrl) {
        throw new Error('Configuration error: API base URL not found');
      }

      // Create abort controller for request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(`${baseUrl}/career_guidance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program: searchQuery.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle non-ok responses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          // If we can't parse error response, use default handling
        }
        handleServerError(response, errorData);
        return;
      }

      // Parse response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError({
          hasError: true,
          message: 'Invalid response format from server. Please try again.',
          type: 'server'
        });
        return;
      }

      // Validate response data
      if (!validateResponseData(data)) {
        return;
      }

      // Success - set the advice data
      setAdvice(data);

    } catch (fetchError: any) {
      console.error('Error fetching career guidance:', fetchError);

      // Handle specific error types
      if (fetchError.name === 'AbortError') {
        setError({
          hasError: true,
          message: 'Request timed out. Please try again.',
          type: 'network'
        });
      } else if (fetchError.message.includes('Configuration error')) {
        setError({
          hasError: true,
          message: 'Application configuration error. Please contact support.',
          type: 'unknown'
        });
      } else {
        handleNetworkError(fetchError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Retry function
  const handleRetry = () => {
    if (searchQuery.trim()) {
      handleFieldSelect();
    }
  };

  // Get error styling based on type
  const getErrorStyling = (type: string) => {
    switch (type) {
      case 'network':
        return 'border-orange-500 bg-orange-50';
      case 'validation':
        return 'border-yellow-500 bg-yellow-50';
      case 'server':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-red-500 bg-red-50';
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
                  className={`form-input pl-10 ${error.hasError && error.type === 'validation' ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              </div>

              <button
                onClick={handleFieldSelect}
                disabled={isLoading || !searchQuery.trim()}
                className="w-full py-2 px-4 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Getting Career Guidance...
                  </>
                ) : (
                  'Get Career Guidance'
                )}
              </button>
            </div>

            {/* Error Display */}
            {error.hasError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 mb-6 border rounded-lg ${getErrorStyling(error.type)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">
                      {error.message}
                    </p>
                    {(error.type === 'network' || error.type === 'server') && (
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleRetry}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Try Again
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-foreground/70">Analyzing career opportunities for {selectedField}...</p>
                </div>
              </div>
            )}

            {/* Success State - Display Advice */}
            {!isLoading && advice && !error.hasError && (
              <div className="space-y-6">
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6"
                >
                  <p className="text-green-800 font-medium">
                    ✓ Career guidance successfully generated for "{selectedField}"
                  </p>
                </motion.div>

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
                    {advice.keySkills?.map((skill: string, index: number) => (
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
                    {advice.careerPaths?.map((path: string, index: number) => (
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
                    {advice.certifications?.map((cert: string, index: number) => (
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
                    {advice.industryTrends?.map((trend: string, index: number) => (
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
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CareerGuidance;