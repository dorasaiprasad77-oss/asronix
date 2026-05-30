'use client';

import { motion } from 'framer-motion';
import {
  Globe, Smartphone, Brain, Palette, Layout, Target,
  TrendingUp, Bot, Camera, ArrowRight, Sparkles,
  Code, Zap, Shield, Layers
} from 'lucide-react';
import LaptopIllustration from './LaptopIllustration';

const services = [
  {
    icon: Globe,
    name: 'Web Development',
    description: 'Custom websites and web applications built with cutting-edge technologies for optimal performance and scalability.',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Smartphone,
    name: 'App Development',
    description: 'Native and cross-platform mobile applications that deliver seamless user experiences across all devices.',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Brain,
    name: 'AI Solutions',
    description: 'Intelligent automation and machine learning solutions that optimize your business operations and decision-making.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Palette,
    name: 'Graphic Design',
    description: 'Stunning visual designs that communicate your brand story and captivate your target audience.',
    color: 'from-pink-500/20 to-pink-600/10',
    iconColor: 'text-pink-500',
  },
  {
    icon: Layout,
    name: 'UI/UX Design',
    description: 'User-centered design solutions that create intuitive, engaging, and conversion-optimized digital experiences.',
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Target,
    name: 'Branding',
    description: 'Comprehensive branding strategies that establish your unique identity and position you for market leadership.',
    color: 'from-cyan-500/20 to-cyan-600/10',
    iconColor: 'text-cyan-500',
  },
  {
    icon: TrendingUp,
    name: 'Marketing',
    description: 'Data-driven digital marketing campaigns that drive growth, engagement, and measurable ROI for your business.',
    color: 'from-rose-500/20 to-rose-600/10',
    iconColor: 'text-rose-500',
  },
  {
    icon: Bot,
    name: 'Business Automation',
    description: 'Streamline your workflows with intelligent automation tools that reduce costs and boost productivity.',
    color: 'from-violet-500/20 to-violet-600/10',
    iconColor: 'text-violet-500',
  },
  {
    icon: Camera,
    name: 'Creative Media',
    description: 'Professional video production, animation, and multimedia content that brings your brand story to life.',
    color: 'from-amber-500/20 to-amber-600/10',
    iconColor: 'text-amber-500',
  },
];

const floatingIcons = [Code, Zap, Shield, Layers];

export default function Services() {
  return (
    <section id="services" className="section relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 via-transparent to-purple-50/30 pointer-events-none" />
      <div className="absolute top-40 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute top-60 -right-32 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      
      {/* Floating tech icons in background */}
      {floatingIcons.map((Icon, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.04, 0.08, 0.04],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
          className="absolute pointer-events-none text-blue-500"
          style={{
            left: `${15 + i * 22}%`,
            top: `${10 + i * 15}%`,
          }}
        >
          <Icon size={48 + i * 12} />
        </motion.div>
      ))}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero-style header with laptop illustration */}
        <div className="lg:min-h-[420px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-16 lg:mb-20">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold tracking-wide mb-6"
            >
              <Sparkles size={14} />
              Our Services
            </motion.span>
            
            <h2 className="text-[clamp(36px,6vw,64px)] font-bold font-[Poppins] text-[#0a0a1a] leading-[1.1] mb-6">
              Comprehensive{' '}
              <span className="gradient-text inline-block">Digital Solutions</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              From web development to AI automation, we offer end-to-end digital services to accelerate your business growth and transform your vision into reality.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-[Poppins] gradient-text">9+</div>
                <div className="text-sm text-gray-400 mt-1">Service Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-[Poppins] gradient-text">50+</div>
                <div className="text-sm text-gray-400 mt-1">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-[Poppins] gradient-text">98%</div>
                <div className="text-sm text-gray-400 mt-1">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Laptop illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <LaptopIllustration className="w-full h-auto" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card group rounded-2xl p-8 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon size={28} className={service.iconColor} />
                </div>
                <h3 className="text-xl font-semibold font-[Poppins] text-[#0a0a1a] mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <a
                  href={`https://wa.me/917377532141?text=${encodeURIComponent(`Hi ASRONIX TECH AGENCY! I'm interested in your ${service.name} services. Can you provide more details?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors group/link"
                >
                  Get Free Consultation
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
