import React from 'react';
import PageTransition from '@/components/PageTransition';
import { ArrowLeft, Briefcase, FileText, MessagesSquare, GraduationCap, Sparkles, Search, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Career Exploration',
      description: 'Enter your degree or field of interest to get personalized career recommendations based on current market trends and your qualifications.',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      icon: FileText,
      title: 'CV Creation',
      description: 'Create a professional CV with our intuitive builder. Add your education, experience, and skills, then use our AI-powered summary generator to craft the perfect professional summary.',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      icon: MessagesSquare,
      title: 'Interview Preparation',
      description: 'Access tailored interview questions for your target role, complete with expert tips to help you prepare compelling answers and stand out to employers.',
      color: 'bg-purple-500/10 text-purple-500'
    },
    {
      icon: GraduationCap,
      title: 'Career Guidance',
      description: 'Receive comprehensive guidance on required skills, valuable certifications, potential career paths, and current industry trends relevant to your field.',
      color: 'bg-amber-500/10 text-amber-500'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Insights',
      description: 'Our platform leverages advanced AI to provide personalized career recommendations and professional content tailored to your unique profile.'
    },
    {
      icon: Briefcase,
      title: 'Comprehensive Tools',
      description: 'From CV creation to interview preparation, we offer all the tools you need to navigate your career journey in one integrated platform.'
    },
    {
      icon: Award,
      title: 'Expert Guidance',
      description: 'Access industry-specific advice on skills, certifications, and trends to keep you competitive in today\'s rapidly evolving job market.'
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">How JobPal Works</h1>
              <p className="text-lg text-foreground/70 mb-8">
                Your all-in-one platform for career development, from exploration to preparation
              </p>
              <Link to="/" className="inline-flex items-center text-primary hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16">
          {/* How It Works Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-12 text-center">Our Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="card-glass p-6 flex items-start">
                  <div className={`${step.color} p-3 rounded-full mr-4`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                    <p className="text-foreground/70">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-12 text-center">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="card-glass p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full inline-flex mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Get Started CTA */}
          <section className="text-center max-w-3xl mx-auto">
            <div className="card-glass p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-foreground/70 mb-6">
                Take the first step toward your ideal career path with JobPal's comprehensive tools and guidance.
              </p>
              <Link 
                to="/" 
                className="button-glass px-8 py-3 inline-block text-base font-medium"
              >
                Get Started Now
              </Link>
            </div>
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default HowItWorks;
