
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap, TrendingUp } from 'lucide-react';

type CareerRecommendation = {
  title: string;
  description: string;
  skills: string[];
  education: string;
  outlook: string;
  salary: string;
};

const ResultCard: React.FC<{
  recommendation: CareerRecommendation;
  index: number;
}> = ({ recommendation, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-glass overflow-hidden"
    >
      <div className="p-6">
        <h3 className="text-xl font-medium mb-3">{recommendation.title}</h3>
        <p className="text-foreground/80 mb-4">{recommendation.description}</p>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Required Skills</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {recommendation.skills.map((skill, i) => (
                  <span 
                    key={i}
                    className="inline-block px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Education</h4>
              <p className="text-sm text-foreground/80 mt-1">{recommendation.education}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Job Outlook</h4>
              <p className="text-sm text-foreground/80 mt-1">{recommendation.outlook}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">Average Salary</h4>
              <p className="text-sm text-foreground/80 mt-1">{recommendation.salary}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card footer */}
      <div className="border-t border-border p-4 bg-secondary/30 flex justify-end">
        <button className="text-sm text-primary font-medium hover:underline">
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

export default ResultCard;
