"use client";

import { motion } from "framer-motion";
import { Lightbulb, Target, Cpu, Users, MapPin, Globe } from "lucide-react";
import SectionHeading from "./SectionHeading";
import AnimatedSection from "./AnimatedSection";

export default function About() {
  const values = [
    { icon: Lightbulb, title: "Innovation First", description: "We leverage cutting-edge AI and modern technologies to build solutions that push boundaries.", color: "from-blue-500 to-cyan-500" },
    { icon: Target, title: "Results Driven", description: "Every project we deliver is focused on achieving tangible business outcomes and growth.", color: "from-purple-500 to-pink-500" },
    { icon: Cpu, title: "AI Powered", description: "Our AI-first approach ensures your business stays ahead with intelligent automation.", color: "from-cyan-500 to-blue-500" },
    { icon: Users, title: "Client Focused", description: "We partner closely with our clients to understand and execute their unique vision.", color: "from-amber-500 to-red-500" },
  ];

  const stats = [
    { label: "Projects Completed", value: "6+", icon: Globe },
    { label: "Happy Clients", value: "6+", icon: Users },
    { label: "AI Solutions Deployed", value: "6+", icon: Cpu },
    { label: "Based In", value: "Odisha", icon: MapPin },
  ];

  return (
    <AnimatedSection id="about" className="bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          title="About ASRONIXTECH"
          subtitle="Asronix Tech Agency is a next-generation digital technology startup delivering AI-powered solutions, modern web experiences, branding systems, applications, and business growth services."
        />

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              To become the leading AI-powered digital platform that empowers businesses, startups, creators, and brands to thrive in the digital age through innovative technology and intelligent solutions.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We combine creative excellence with artificial intelligence to deliver experiences that are not just visually stunning but also smart, efficient, and results-oriented. Based in Berhampur, Odisha, we serve clients globally with cutting-edge digital solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="card-premium p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 p-2 mx-auto mb-3">
                  <stat.icon className="w-full h-full text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-premium p-6 group hover:border-transparent relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} p-2.5 mb-4`}>
                <value.icon className="w-full h-full text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
