import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Trash2, Download, Loader2, CheckCircle, Sparkles } from 'lucide-react';

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  description: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CvGenerated {
  filename: string;
  downloadUrl: string;
}

const CvCreation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    education: [{ institution: '', degree: '', year: '', description: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [cvGenerated, setCvGenerated] = useState<CvGenerated | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required';

    formData.education.forEach((edu, index) => {
      if (!edu.institution.trim()) newErrors[`education[${index}].institution`] = 'Institution is required';
      if (!edu.degree.trim()) newErrors[`education[${index}].degree`] = 'Degree is required';
      if (!edu.year.trim()) newErrors[`education[${index}].year`] = 'Year is required';
    });

    formData.experience.forEach((exp, index) => {
      if (!exp.company.trim()) newErrors[`experience[${index}].company`] = 'Company is required';
      if (!exp.position.trim()) newErrors[`experience[${index}].position`] = 'Position is required';
      if (!exp.startDate.trim()) newErrors[`experience[${index}].startDate`] = 'Start date is required';
    });

    if (formData.skills.some(skill => !skill.trim())) {
      newErrors.skills = 'All skills must be filled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    arrayName: 'education' | 'experience' | 'skills',
    index: number,
    fieldName: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index
          ? arrayName === 'skills'
            ? value
            : { ...item, [fieldName]: value }
          : item
      ),
    }));
  };

  const addArrayItem = (arrayName: 'education' | 'experience' | 'skills') => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      if (arrayName === 'education') {
        newArray.push({ institution: '', degree: '', year: '', description: '' });
      } else if (arrayName === 'experience') {
        newArray.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
      } else {
        newArray.push('');
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const removeArrayItem = (arrayName: 'education' | 'experience' | 'skills', index: number) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL || ''}/generate-cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CV.');
      }

      const data = await response.json();
      setCvGenerated({
        filename: data.filename,
        downloadUrl: `${import.meta.env.VITE_APP_BASE_URL || ''}${data.downloadUrl}`
      });
      setActiveTab('preview');
    } catch (err) {
      console.error('Error generating CV:', err);
      alert('Failed to generate CV. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cvGenerated) return;

    try {
      window.open(cvGenerated.downloadUrl, '_blank');
    } catch (error) {
      console.error('Error downloading CV:', error);
    }
  };

  const handleGenerateSummary = async () => {
    // Check if we have enough data to generate a meaningful summary
    const hasEducation = formData.education.some(edu => 
      edu.institution.trim() && edu.degree.trim() && edu.year.trim()
    );
    
    const hasExperience = formData.experience.some(exp => 
      exp.company.trim() && exp.position.trim() && exp.startDate.trim()
    );
    
    const hasSkills = formData.skills.some(skill => skill.trim());
    
    if (!hasEducation && !hasExperience && !hasSkills) {
      setErrors(prev => ({
        ...prev,
        summary: 'Please fill in some education, experience, or skills information first'
      }));
      return;
    }
    
    setIsSummaryLoading(true);
    setErrors(prev => ({ ...prev, summary: '' }));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL || ''}/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors',
        credentials: 'same-origin'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      if (data.success && data.summary) {
        setFormData(prev => ({ ...prev, summary: data.summary }));
      } else {
        throw new Error('No summary was generated');
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      setErrors(prev => ({
        ...prev,
        summary: err instanceof Error ? err.message : 'Failed to generate summary'
      }));
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const renderPreview = () => {
    return (
      <div className="card-glass p-6 rounded-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{formData.name}</h1>
          <div className="flex justify-center gap-4 mt-2 text-muted-foreground">
            <span>{formData.email}</span>
            <span>•</span>
            <span>{formData.phone}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-4 text-primary">EDUCATION</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{edu.institution}</h3>
                <span className="text-muted-foreground">{edu.year}</span>
              </div>
              <p className="text-foreground italic">{edu.degree}</p>
              {edu.description && (
                <p className="text-muted-foreground mt-2 whitespace-pre-line">{edu.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-4 text-primary">WORK EXPERIENCE</h2>
          {formData.experience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{exp.company}</h3>
                <span className="text-muted-foreground">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              <p className="text-foreground italic">{exp.position}</p>
              {exp.description && (
                <p className="text-muted-foreground mt-2 whitespace-pre-line">{exp.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-4 text-primary">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.filter(skill => skill.trim()).map((skill, index) => (
              <span key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold border-b-2 border-primary pb-1 mb-4 text-primary">PROFESSIONAL SUMMARY</h2>
          <p className="text-foreground whitespace-pre-line">{formData.summary}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Professional CV Builder
          </motion.div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            Create Your Modern CV
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            Fill in your details and generate a professional CV in minutes
          </motion.p>
        </div>

        <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          <div className="flex border-b border-border">
            <button
              className={`flex-1 py-4 px-6 font-medium text-center ${activeTab === 'form' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('form')}
            >
              CV Form
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium text-center ${activeTab === 'preview' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setActiveTab('preview')}
              disabled={!cvGenerated}
            >
              CV Preview
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'form' ? (
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'border-destructive' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${errors.email ? 'border-destructive' : ''}`}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`form-input ${errors.phone ? 'border-destructive' : ''}`}
                        placeholder="+1 123 456 7890"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Education</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('education')}
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Education
                    </button>
                  </div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="card-glass p-5 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Education #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', index)}
                          className="text-destructive hover:text-destructive/80 p-1"
                          disabled={formData.education.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor={`edu-institution-${index}`} className="block text-sm font-medium mb-1">Institution</label>
                          <input
                            type="text"
                            id={`edu-institution-${index}`}
                            value={edu.institution}
                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                            className={`form-input ${errors[`education[${index}].institution`] ? 'border-destructive' : ''}`}
                            placeholder="University Name"
                          />
                          {errors[`education[${index}].institution`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`education[${index}].institution`]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`edu-degree-${index}`} className="block text-sm font-medium mb-1">Degree</label>
                          <input
                            type="text"
                            id={`edu-degree-${index}`}
                            name="degree"
                            value={edu.degree}
                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                            className={`form-input ${errors[`education[${index}].degree`] ? 'border-destructive' : ''}`}
                            placeholder="Bachelor of Science"
                          />
                          {errors[`education[${index}].degree`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`education[${index}].degree`]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`edu-year-${index}`} className="block text-sm font-medium mb-1">Year</label>
                          <input
                            type="text"
                            id={`edu-year-${index}`}
                            value={edu.year}
                            onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                            className={`form-input ${errors[`education[${index}].year`] ? 'border-destructive' : ''}`}
                            placeholder="2018 - 2022"
                          />
                          {errors[`education[${index}].year`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`education[${index}].year`]}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor={`edu-description-${index}`} className="block text-sm font-medium mb-1">Description (Optional)</label>
                          <textarea
                            id={`edu-description-${index}`}
                            value={edu.description}
                            onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)}
                            className="form-textarea"
                            placeholder="Relevant coursework, achievements, etc."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Work Experience</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('experience')}
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Experience
                    </button>
                  </div>
                  {formData.experience.map((exp, index) => (
                    <div key={index} className="card-glass p-5 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Experience #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', index)}
                          className="text-destructive hover:text-destructive/80 p-1"
                          disabled={formData.experience.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor={`exp-company-${index}`} className="block text-sm font-medium mb-1">Company</label>
                          <input
                            type="text"
                            id={`exp-company-${index}`}
                            value={exp.company}
                            onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                            className={`form-input ${errors[`experience[${index}].company`] ? 'border-destructive' : ''}`}
                            placeholder="Company Name"
                          />
                          {errors[`experience[${index}].company`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`experience[${index}].company`]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`exp-position-${index}`} className="block text-sm font-medium mb-1">Position</label>
                          <input
                            type="text"
                            id={`exp-position-${index}`}
                            value={exp.position}
                            onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                            className={`form-input ${errors[`experience[${index}].position`] ? 'border-destructive' : ''}`}
                            placeholder="Software Engineer"
                          />
                          {errors[`experience[${index}].position`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`experience[${index}].position`]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`exp-startDate-${index}`} className="block text-sm font-medium mb-1">Start Date</label>
                          <input
                            type="text"
                            id={`exp-startDate-${index}`}
                            value={exp.startDate}
                            onChange={(e) => handleArrayChange('experience', index, 'startDate', e.target.value)}
                            className={`form-input ${errors[`experience[${index}].startDate`] ? 'border-destructive' : ''}`}
                            placeholder="Jan 2020"
                          />
                          {errors[`experience[${index}].startDate`] && (
                            <p className="mt-1 text-sm text-destructive">{errors[`experience[${index}].startDate`]}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor={`exp-endDate-${index}`} className="block text-sm font-medium mb-1">End Date</label>
                          <input
                            type="text"
                            id={`exp-endDate-${index}`}
                            value={exp.endDate}
                            onChange={(e) => handleArrayChange('experience', index, 'endDate', e.target.value)}
                            className="form-input"
                            placeholder="Present (or end date)"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor={`exp-description-${index}`} className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            id={`exp-description-${index}`}
                            value={exp.description}
                            onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                            className="form-textarea"
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Skills</h3>
                    <button
                      type="button"
                      onClick={() => addArrayItem('skills')}
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleArrayChange('skills', index, '', e.target.value)}
                            className={`form-input ${errors.skills && index === formData.skills.length - 1 ? 'border-destructive' : ''}`}
                            placeholder="e.g. JavaScript, Project Management, etc."
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('skills', index)}
                          className="text-destructive hover:text-destructive/80 p-1"
                          disabled={formData.skills.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {errors.skills && <p className="mt-1 text-sm text-destructive">{errors.skills}</p>}
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold mb-6">Professional Summary</h3>
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium mb-1">Professional Summary</label>
                    <div className="relative">
                      <textarea
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className={`form-textarea ${errors.summary ? 'border-destructive' : ''}`}
                        placeholder="Briefly describe your professional background, skills, and goals..."
                        rows={4}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSummary}
                        disabled={isSummaryLoading}
                        className="absolute top-2 right-2 bg-primary/10 hover:bg-primary/20 text-primary p-1.5 rounded-md transition-colors"
                        title="Generate summary with AI"
                      >
                        {isSummaryLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.summary && (
                      <div className="mt-2 px-3 py-2 bg-destructive/10 border-l-4 border-destructive rounded-sm">
                        <p className="text-sm font-medium text-destructive flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.summary}
                        </p>
                      </div>
                    )}
                    <p className="mt-1 text-xs text-foreground/60">
                      {isSummaryLoading ? 
                        'Generating your professional summary...' : 
                        'Click the sparkle icon to generate a summary based on your information'}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    className="button-glass w-full py-3 px-6 flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating CV...
                      </>
                    ) : (
                      'Generate CV'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  {renderPreview()}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab('form')}
                    className="py-2 px-4 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Back to Form
                  </button>
                  <button
                    onClick={handleDownload}
                    className="button-glass flex-1 py-2 px-4 flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download CV (PDF)
                  </button>
                </div>
                {cvGenerated && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>CV generated successfully!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CvCreation;