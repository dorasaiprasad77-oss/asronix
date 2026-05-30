'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Loader2, ArrowRight, Building2, Hash, FileText, Lightbulb, Megaphone, Palette, Cpu } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AIAnalyzer() {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    websiteType: string;
    marketingStrategy: string;
    brandingSuggestions: string;
    automationSuggestions: string;
  } | null>(null);

  const industries = [
    'E-commerce',
    'Healthcare',
    'Education',
    'Finance',
    'Real Estate',
    'Food & Restaurant',
    'Technology',
    'Entertainment',
    'Retail',
    'Manufacturing',
    'Travel & Hospitality',
    'Other',
  ];

  const analyzeBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !industry || !description) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis with smart logic based on inputs
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const suggestions = generateAnalysis(businessName, industry, description);
    setResult(suggestions);
    setIsAnalyzing(false);
  };

  const generateAnalysis = (name: string, ind: string, desc: string) => {
    const websiteTypes: Record<string, string> = {
      'E-commerce': 'An e-commerce platform with product catalog, shopping cart, payment gateway integration, and inventory management system.',
      Healthcare: 'A patient portal with appointment booking, telemedicine integration, medical records management, and secure messaging.',
      Education: 'An LMS platform with course management, student progress tracking, virtual classrooms, and assessment tools.',
      Finance: 'A fintech platform with secure transaction processing, portfolio management, real-time analytics, and compliance features.',
      'Real Estate': 'A property listing platform with virtual tours, mortgage calculators, agent matching, and neighborhood analytics.',
      'Food & Restaurant': 'A restaurant platform with online ordering, table reservation, loyalty programs, and delivery tracking.',
      Technology: 'A SaaS platform with user management, subscription billing, API integration, and scalable cloud infrastructure.',
      Entertainment: 'A content streaming platform with user profiles, recommendation engine, live streaming, and social features.',
      Retail: 'An omnichannel retail platform with POS integration, inventory tracking, customer analytics, and personalized marketing.',
      Manufacturing: 'An industrial IoT platform with production monitoring, supply chain management, quality control, and predictive maintenance.',
      'Travel & Hospitality': 'A travel booking platform with itinerary planning, hotel reservations, flight booking, and review management.',
    };

    return {
      websiteType: websiteTypes[ind] || `A custom digital platform tailored for ${ind} industry with modern UI/UX, responsive design, and scalable architecture.`,
      marketingStrategy: `For ${name}, we recommend:
• Multi-channel digital marketing across Google Ads, LinkedIn, and Instagram
• SEO-optimized content marketing strategy targeting industry-specific keywords
• Email marketing automation with personalized campaign workflows
• Social media strategy focusing on video content and thought leadership
• Retargeting campaigns to convert warm leads`,
      brandingSuggestions: `For ${name}'s brand identity:
• Modern, minimalist logo design with a color palette that reflects ${ind} industry values
• Comprehensive brand guidelines covering typography, imagery, and voice
• Professional business cards, letterheads, and digital assets
• Social media kit with cover photos, templates, and brand filters
• Brand messaging framework emphasizing your unique value proposition`,
      automationSuggestions: `Recommended automation solutions for ${name}:
• Customer relationship management (CRM) automation for lead tracking
• Automated email sequences for onboarding and follow-ups
• Social media scheduling and content management automation
• Invoice and payment processing automation
• Analytics dashboard with automated reporting and insights
• Chatbot integration for 24/7 customer support`,
    };
  };

  return (
    <section className="section relative bg-gradient-to-b from-blue-50/30 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="section-header"
        >
          <span className="section-tag">AI Powered</span>
          <h2 className="section-title">
            AI Business <span className="gradient-text">Analyzer</span>
          </h2>
          <p className="section-subtitle">
            Get instant AI-powered recommendations for your business – website type, 
            marketing strategy, branding, and automation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 md:p-10"
          >
            {!result ? (
              <form onSubmit={analyzeBusiness} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building2 size={16} className="inline mr-2 text-blue-500" />
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Enter your business name"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash size={16} className="inline mr-2 text-purple-500" />
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select your industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2 text-blue-500" />
                    Business Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your business, target audience, and goals..."
                    className="input-field"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !businessName || !industry || !description}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing Your Business...
                    </>
                  ) : (
                    <>
                      <Bot size={18} />
                      Analyze My Business
                    </>
                  )}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-[Poppins]">
                    Analysis for <span className="gradient-text">{businessName}</span>
                  </h3>
                  <button
                    onClick={() => setResult(null)}
                    className="text-sm text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    Analyze Another
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-200/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <GlobeIcon className="text-blue-500" size={20} />
                      </div>
                      <h4 className="font-semibold text-sm text-blue-700">Recommended Website</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{result.websiteType}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-200/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <MegaphoneIcon className="text-purple-500" size={20} />
                      </div>
                      <h4 className="font-semibold text-sm text-purple-700">Marketing Strategy</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{result.marketingStrategy}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/30 border border-pink-200/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <PaletteIcon className="text-pink-500" size={20} />
                      </div>
                      <h4 className="font-semibold text-sm text-pink-700">Branding Suggestions</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{result.brandingSuggestions}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-200/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <CpuIcon className="text-emerald-500" size={20} />
                      </div>
                      <h4 className="font-semibold text-sm text-emerald-700">Automation Ideas</h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{result.automationSuggestions}</p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <a href="/booking" className="btn-primary">
                    Get Started With Your Project
                    <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Simple icon components to avoid importing all lucide icons
function GlobeIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function MegaphoneIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m3 11 18-5v12L3 14v-3z"/>
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
    </svg>
  );
}

function PaletteIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.4-.15-.78-.4-1.07a1.5 1.5 0 0 1 .32-2.28c.82-.47 1.58-1.1 1.58-2.15 0-1.65 1.35-3 3-3 .83 0 1.5-.67 1.5-1.5C20 6.5 16.5 2 12 2z"/>
    </svg>
  );
}

function CpuIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/>
      <line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/>
      <line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  );
}
