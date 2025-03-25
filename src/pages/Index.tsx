import React, { useState } from 'react';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/Hero';
import CareerForm from '@/components/CareerForm';
import ResultCard from '@/components/ResultCard';
import { ArrowRight, Briefcase, GraduationCap, FileText, MessagesSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Briefcase,
    title: 'Career Recommendations',
    description: 'Get personalized career suggestions based on your education and interests',
    link: '/'
  },
  {
    icon: FileText,
    title: 'CV Creation',
    description: 'Create professional CVs tailored to your target industry and role',
    link: '/cv'
  },
  {
    icon: MessagesSquare,
    title: 'Interview Preparation',
    description: 'Access common interview questions for your desired position',
    link: '/interview'
  },
  {
    icon: GraduationCap,
    title: 'Career Guidance',
    description: 'Receive expert advice on skills, certifications, and industry trends',
    link: '/career-guidance'
  }
];

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any | null>(null);

  const handleSubmit = async (formData: { program: string }) => {
    setIsLoading(true);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/get_recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program: formData.program }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
  
      const data = await response.json();
      console.log("API Response:", data);
  
      // Ensure recommendations is always an array
      setRecommendations(Array.isArray(data) ? data : []);
  
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Main Content */}
        <main id="content" className="page-container">
          {/* Career Recommendation Form */}
          <section className="page-section">
            <div className="max-w-3xl mx-auto">
              <CareerForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </section>
          
          {/* Recommendations Results */}
          {recommendations && (
            <section className="page-section">
              <h2 className="text-2xl font-medium mb-6 text-center">Your Career Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((recommendation: any, index: number) => (
                  <ResultCard 
                    key={index}
                    recommendation={recommendation}
                    index={index}
                  />
                ))}
              </div>
            </section>
          )}
          
          {/* Features Section */}
          <section className="page-section">
            <h2 className="text-2xl font-medium mb-2 text-center">Our Services</h2>
            <p className="text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
              Comprehensive tools to help you navigate every step of your career journey
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card-glass p-6 flex flex-col items-start transition-all duration-300 hover:translate-y-[-5px]"
                >
                  <div className="bg-primary/10 p-3 rounded-full mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-foreground/70 mb-4 text-sm">{feature.description}</p>
                  <Link 
                    to={feature.link} 
                    className="mt-auto inline-flex items-center text-primary text-sm font-medium hover:underline"
                  >
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
