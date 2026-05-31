'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

const COMPANY_WHATSAPP = '917377532141';

const services = [
  'Web Development', 'App Development', 'AI Solutions', 'Graphic Design',
  'UI/UX Design', 'Branding', 'Marketing', 'Business Automation', 'Creative Media',
];

const budgetRanges = [
  'Under ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000',
  '₹1,00,000 - ₹2,50,000', '₹2,50,000 - ₹5,00,000', 'Above ₹5,00,000',
];

export default function HomePage() {
  const [splashLoading, setSplashLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '', phone: '', email: '', businessName: '',
    service: '', budget: '', projectDescription: '', preferredDeadline: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'customerName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const cleaned = value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
        if (!phoneRegex.test(cleaned)) return 'Enter a valid 10-digit Indian mobile number';
        return '';
      case 'email':
        if (!value.trim()) return 'Email address is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Enter a valid email address';
        return '';
      case 'businessName':
        if (!value.trim()) return 'Business name is required';
        if (value.trim().length < 2) return 'Business name must be at least 2 characters';
        return '';
      case 'service':
        if (!value) return 'Please select a required service';
        return '';
      case 'budget':
        if (!value) return 'Please select a budget range';
        return '';
      case 'projectDescription':
        if (!value.trim()) return 'Project description is required';
        if (value.trim().length < 10) return 'Please provide more detail (at least 10 characters)';
        return '';
      case 'preferredDeadline':
        if (!value.trim()) return 'Preferred deadline is required';
        if (value.trim().length < 2) return 'Please enter a valid deadline';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof typeof formData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        newTouched[key] = true;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setTouched(prev => ({ ...prev, ...newTouched }));
    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      setTimeout(() => {
        const el = document.querySelector(`[name="${firstErrorField}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    return isValid;
  };

  const buildWhatsAppMessage = () => {
    const message =
      `🚀 NEW PROJECT INQUIRY\n\n` +
      `Client Name:\n${formData.customerName || '[Not provided]'}\n\n` +
      `Phone Number:\n${formData.phone || '[Not provided]'}\n\n` +
      `Email:\n${formData.email || '[Not provided]'}\n\n` +
      `Business Name:\n${formData.businessName || '[Not provided]'}\n\n` +
      `Required Service:\n${formData.service || '[Not selected]'}\n\n` +
      `Estimated Budget:\n${formData.budget || '[Not specified]'}\n\n` +
      `Project Details:\n${formData.projectDescription || '[Not provided]'}\n\n` +
      `Preferred Deadline:\n${formData.preferredDeadline || '[Not specified]'}\n\n` +
      `Thank you for choosing ASRONIX TECH AGENCY.\n\n` +
      `We look forward to working with you.`;
    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = async () => {
    if (!validateForm()) return;
    setSending(true);

    // Send email notification
    try {
      await fetch('/api/booking-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Email notification failed:', err);
    }

    const message = buildWhatsAppMessage();
    setTimeout(() => {
      window.open(`https://wa.me/${COMPANY_WHATSAPP}?text=${message}`, '_blank');
      setSending(false);
      setSent(true);
    }, 400);
  };

  useEffect(() => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handler = (e: Event) => {
      const target = document.querySelector((e.currentTarget as HTMLAnchorElement).getAttribute('href')!);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
    anchors.forEach((a) => a.addEventListener('click', handler));
    return () => anchors.forEach((a) => a.removeEventListener('click', handler));
  }, []);

  const fieldClass = (name: string) => {
    return errors[name] && touched[name] ? 'asronix-form-input asronix-field-error' : 'asronix-form-input';
  };
  const selectFieldClass = (name: string) => {
    return errors[name] && touched[name] ? 'asronix-form-select asronix-field-error' : 'asronix-form-select';
  };

  useEffect(() => {
    const timer = setTimeout(() => setSplashLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={splashLoading} message="Welcome to ASRONIX" />

      {/* Navigation */}
      <nav className="asronix-navbar">
        <div className="asronix-container asronix-nav-flex">
          <div className="asronix-logo">
            <img src="/logo.png" alt="ASRONIX TECH AGENCY" className="asronix-logo-img" />
            <span className="asronix-logo-text">ASRONIX TECH AGENCY</span>
          </div>
          <button className={`asronix-hamburger ${menuOpen ? 'asronix-hamburger-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
          <ul className={`asronix-nav-links ${menuOpen ? 'asronix-nav-links-open' : ''}`}>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>HOME</a></li>
            <li><a href="#pages" onClick={() => setMenuOpen(false)}>PAGES</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>SERVICES</a></li>
            <li><a href="#casestudy" onClick={() => setMenuOpen(false)}>CASESTUDY</a></li>
            <li><a href="#shop" onClick={() => setMenuOpen(false)}>SHOP</a></li>
            <li><a href="#blog" onClick={() => setMenuOpen(false)}>BLOG</a></li>
            <li><a href="#contact" className="asronix-nav-outline" onClick={() => setMenuOpen(false)}><i className="fas fa-phone-alt"></i> CONTACT</a></li>
            <li><a href="#booking" className="asronix-nav-cta" onClick={() => setMenuOpen(false)}><i className="fas fa-calendar-check"></i> BOOK NOW</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="asronix-hero" id="home">
        <div className="asronix-container asronix-hero-grid">
          <div className="asronix-hero-left">
            <div className="asronix-badge">WE&apos;RE ASRONIX</div>
            <h1>Digital & AI Solutions For <span>Your Business Growth</span></h1>
            <p>E SAI PRASAD DORA FOUNDERAND CEO modern digital solutions for startups, businesses, creators, and brands. From AI automation to stunning web platforms — we build what matters.</p>
            <button className="asronix-btn-primary">EXPLORE <i className="fas fa-arrow-right"></i></button>
            <a href="#booking" className="asronix-btn-secondary" style={{ marginLeft: 12 }}>BOOK NOW <i className="fas fa-calendar-check"></i></a>
            <div className="asronix-hero-stats">
              <div className="asronix-stat-card"><i className="fas fa-crown"></i><h4>Quality Services</h4><p>Premium delivery</p></div>
              <div className="asronix-stat-card"><i className="fas fa-lightbulb"></i><h4>Valuable Ideas</h4><p>Innovation first</p></div>
              <div className="asronix-stat-card"><i className="fas fa-wallet"></i><h4>Budget Friendly</h4><p>Cost efficient</p></div>
              <div className="asronix-stat-card"><i className="fas fa-headset"></i><h4>Support 24/7</h4><p>Always online</p></div>
            </div>
          </div>
          <div className="asronix-hero-right">
            <div className="asronix-info-row"><i className="fas fa-map-marker-alt"></i><div><strong>Address:</strong> Berhampur ,odisha ,india</div></div>
            <div className="asronix-info-row"><i className="fas fa-phone-alt"></i><div><strong>Freecall:</strong> +91 73775 32141 &nbsp;|&nbsp; <strong>WhatsApp:</strong> +91 7377532141</div></div>
            <div className="asronix-info-row"><i className="fas fa-envelope"></i><div><strong>Email:</strong> asronixtechagency@gmail.com</div></div>
            <div className="asronix-info-row"><i className="fab fa-instagram"></i><div><strong>Instagram:</strong> @asronixtechagency</div></div>
            <div className="asronix-info-row"><i className="fas fa-quote-right"></i><div><strong>Tagline:</strong> Ideas. Innovation. Impact.</div></div>
          </div>
        </div>
      </section>

      {/* SERVICES WE PROVIDE */}
      <section className="asronix-services-mega" id="services">
        <div className="asronix-container">
          <div className="asronix-section-header">
            <h2 className="asronix-service-heading">SERVICES WE PROVIDE</h2>
            <div className="asronix-accent-line"></div>
            <p style={{ marginTop: 12, color: '#54746D' }}>Cutting-edge digital solutions tailored to elevate your brand</p>
          </div>
          <div className="asronix-services-grid">
            {[
              { icon: 'fa-code', title: 'Web Development', items: ['Business Websites', 'Portfolio Websites', 'E-Commerce Websites', 'Landing Pages', 'Custom Web Applications', 'Website Redesign & Optimization'] },
              { icon: 'fa-android', title: 'App Development', items: ['Android Applications', 'Cross-Platform Apps', 'Startup MVP Development', 'Custom Business Applications'] },
              { icon: 'fa-microchip', title: 'AI Solutions', items: ['AI Tool Integration', 'AI Automation Systems', 'AI Chatbot Development', 'Prompt Engineering', 'AI-Based Business Solutions', 'AI Content Generation'] },
              { icon: 'fa-pen-ruler', title: 'UI/UX Design', items: ['Website UI/UX Design', 'Mobile App UI Design', 'Interactive Design Systems', 'Modern User Experiences'] },
              { icon: 'fa-palette', title: 'Graphic Design', items: ['Logo Design', 'Brand Identity Design', 'Social Media Creatives', 'Posters & Banners', 'Business Cards', 'Marketing Materials'] },
              { icon: 'fa-chalkboard-user', title: 'Digital Branding', items: ['Startup Branding', 'Personal Branding', 'Social Media Branding', 'LinkedIn Branding', 'Visual Identity Development'] },
              { icon: 'fa-chart-line', title: 'Marketing & Growth', items: ['SEO Optimization', 'Social Media Management', 'Lead Generation Support', 'Content Strategy', 'Digital Marketing Solutions'] },
              { icon: 'fa-briefcase', title: 'Business Solutions', items: ['Startup Launch Support', 'Business Automation', 'Tech Consultation', 'Digital Transformation'] },
              { icon: 'fa-video', title: 'Creative Media', items: ['AI Video Creation', 'Promotional Content', 'Motion Graphics', 'Advertising Creatives'] },
            ].map((cat) => (
              <div key={cat.title} className="asronix-service-category">
                <h3><i className={`fas ${cat.icon}`}></i> {cat.title}</h3>
                <ul className="asronix-service-list">
                  {cat.items.map((item) => (
                    <li key={item}><i className="fas fa-check-circle"></i> {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS WE BUILD */}
      <section className="asronix-projects-showcase" id="casestudy">
        <div className="asronix-container">
          <div className="asronix-section-header">
            <h2>PROJECTS WE BUILD</h2>
            <div className="asronix-accent-line"></div>
            <p>Delivering excellence across industries — real results, modern execution</p>
          </div>
          <div className="asronix-projects-badge-container">
            {[
              { icon: 'fa-globe', label: 'Business Websites' },
              { icon: 'fa-building', label: 'Corporate Websites' },
              { icon: 'fa-rocket', label: 'Startup Websites' },
              { icon: 'fa-user', label: 'Portfolio Websites' },
              { icon: 'fa-shopping-cart', label: 'E-Commerce Stores' },
              { icon: 'fa-cloud', label: 'SaaS Platforms' },
              { icon: 'fa-brain', label: 'AI-Powered Applications' },
              { icon: 'fa-laptop-code', label: 'Custom Web Applications' },
              { icon: 'fa-mobile-alt', label: 'Mobile Applications' },
              { icon: 'fa-file-alt', label: 'Landing Pages' },
              { icon: 'fa-calendar-check', label: 'Booking Systems' },
              { icon: 'fa-chalkboard', label: 'Management Systems' },
              { icon: 'fa-trademark', label: 'Branding Projects' },
              { icon: 'fa-paintbrush', label: 'UI/UX Design Systems' },
              { icon: 'fa-robot', label: 'Automation Solutions' },
              { icon: 'fa-comment-dots', label: 'AI Chatbots' },
              { icon: 'fa-chart-simple', label: 'Business Dashboards' },
              { icon: 'fa-chart-line', label: 'Digital Marketing Assets' },
            ].map((pill) => (
              <span key={pill.label} className="asronix-project-pill">
                <i className={`fas ${pill.icon}`}></i> {pill.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE ARE / Mission */}
      <section className="asronix-mission-section" id="pages">
        <div className="asronix-container asronix-mission-flex">
          <div className="asronix-mission-left">
            <h3>Our Mission, <span className="asronix-highlight">Values and Motto</span></h3>
            <p style={{ color: 'black' }}>E SAI PRASAD DORA FOUNDERAND CEO, we believe technology should empower ambition. We fuse AI, creative design, and robust development to craft digital ecosystems that drive growth. Our mission is to democratize future-ready tools for startups, enterprises, and creators — making scalable, intelligent solutions accessible.</p>
            <p style={{ color: 'black' }}>We stand for radical transparency, continuous innovation, and human-centric design. Every line of code, every brand story, and every AI integration is built with purpose.</p>
            <div className="asronix-signature">
              <strong>E sai prasad dora — Founder &amp; CEO</strong><br />
              &quot;Building scalable digital experiences through AI, modern development, creative branding, and innovative business solutions.&quot;
            </div>
          </div>
          <div className="asronix-mission-right">
            <div className="asronix-contact-detail-item"><i className="fas fa-quote-left"></i><div><strong>Our Motto</strong><br />Ideas. Innovation. Impact.</div></div>
            <div className="asronix-contact-detail-item"><i className="fas fa-chart-line"></i><div><strong>Digital Excellence</strong><br />We transform complex challenges into seamless user journeys.</div></div>
            <div className="asronix-contact-detail-item"><i className="fas fa-globe"></i><div><strong>Global Mindset</strong><br />Based in Odisha | Clients worldwide.</div></div>
          </div>
        </div>
      </section>

      {/* ONLINE BOOKING / SEND PROJECT DETAILS ON WHATSAPP */}
      <section className="asronix-booking-section" id="booking">
        <div className="asronix-container">
          <div className="asronix-section-header">
            <h2>BOOK A PROJECT</h2>
            <div className="asronix-accent-line"></div>
            <p>Fill in your project details and we&apos;ll connect with you on WhatsApp</p>
          </div>

          {sent ? (
            <div className="asronix-success-card">
              <i className="fas fa-check-circle"></i>
              <h3>Details Sent Successfully!</h3>
              <p>Your project details have been shared with us via WhatsApp. Our team will review your requirements and get back to you shortly.</p>
              <a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="asronix-btn-success-wa">
                <i className="fab fa-whatsapp"></i> Chat with Us on WhatsApp
              </a>
            </div>
          ) : (
            <div className="asronix-booking-card">
              <div className="asronix-form-grid">
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Full Name<span className="asronix-required">*</span></label>
                  <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} onBlur={handleBlur}
                    placeholder="John Doe" className={fieldClass('customerName')} />
                  {errors.customerName && touched.customerName && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.customerName}</p>}
                </div>
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Phone Number<span className="asronix-required">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                    placeholder="+91 9876543210" className={fieldClass('phone')} />
                  {errors.phone && touched.phone && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.phone}</p>}
                </div>
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Email Address<span className="asronix-required">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    placeholder="john@example.com" className={fieldClass('email')} />
                  {errors.email && touched.email && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.email}</p>}
                </div>
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Business Name<span className="asronix-required">*</span></label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Your Business Name" className={fieldClass('businessName')} />
                  {errors.businessName && touched.businessName && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.businessName}</p>}
                </div>
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Required Service<span className="asronix-required">*</span></label>
                  <select name="service" value={formData.service} onChange={handleChange} onBlur={handleBlur}
                    className={selectFieldClass('service')}>
                    <option value="">Select a service</option>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.service && touched.service && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.service}</p>}
                </div>
                <div className="asronix-form-group">
                  <label className="asronix-form-label">Estimated Budget<span className="asronix-required">*</span></label>
                  <select name="budget" value={formData.budget} onChange={handleChange} onBlur={handleBlur}
                    className={selectFieldClass('budget')}>
                    <option value="">Select budget range</option>
                    {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.budget && touched.budget && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.budget}</p>}
                </div>
                <div className="asronix-form-full asronix-form-group">
                  <label className="asronix-form-label">Project Description<span className="asronix-required">*</span></label>
                  <textarea name="projectDescription" value={formData.projectDescription} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Describe your project in detail including goals, features, and any specific requirements..."
                    className={errors.projectDescription && touched.projectDescription ? 'asronix-form-textarea asronix-field-error' : 'asronix-form-textarea'} rows={5} />
                  {errors.projectDescription && touched.projectDescription && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.projectDescription}</p>}
                </div>
                <div className="asronix-form-full asronix-form-group">
                  <label className="asronix-form-label">Preferred Deadline<span className="asronix-required">*</span></label>
                  <input type="text" name="preferredDeadline" value={formData.preferredDeadline} onChange={handleChange} onBlur={handleBlur}
                    placeholder="e.g. 2 weeks, 1 month, by December 2025" className={fieldClass('preferredDeadline')} />
                  {errors.preferredDeadline && touched.preferredDeadline && <p className="asronix-form-error"><i className="fas fa-exclamation-circle"></i> {errors.preferredDeadline}</p>}
                </div>
              </div>

              <button type="button" onClick={handleWhatsAppClick} disabled={sending} className="asronix-btn-whatsapp">
                {sending ? (
                  <><i className="fas fa-spinner fa-spin"></i> Opening WhatsApp...</>
                ) : (
                  <><i className="fab fa-whatsapp" style={{ fontSize: '1.3rem' }}></i> Send Project Details on WhatsApp</>
                )}
              </button>
              <p className="asronix-whatsapp-note">We'll also send you a confirmation email and notify our team.</p>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT INFORMATION */}
      <section className="asronix-contact-footer-block" id="contact">
        <div className="asronix-container">
          <div className="asronix-contact-grid">
            <div className="asronix-contact-col">
              <img src="/logo.png" alt="ASRONIX TECH AGENCY" className="asronix-footer-logo" />
              <p><i className="fas fa-phone-alt"></i> +91 7377532141</p>
              <p><i className="fab fa-whatsapp"></i> WhatsApp: +91 7377532141</p>
              <p><i className="fas fa-envelope"></i> asronixtechagency@gmail.com</p>
              <p><i className="fab fa-instagram"></i> @asronixtechagency</p>
            </div>
            <div className="asronix-contact-col">
              <h4>Tagline &amp; Vision</h4>
              <p><strong>Ideas. Innovation. Impact.</strong></p>
              <p>&quot;Building scalable digital experiences through AI, modern development, creative branding, and innovative business solutions.&quot;</p>
              <div className="asronix-social-icons">
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
                <a href="#"><i className="fab fa-x-twitter"></i></a>
                <a href="#"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div className="asronix-contact-col">
              <h4>Office &amp; Support</h4>
              <p>📍 Berhampur, Odisha, India</p>
              <p>📞 Freecall: +91 73775 32141</p>
              <p>⏱️ 24/7 dedicated support &amp; consultation</p>
              <p><i className="fas fa-headset"></i> Emergency line always open</p>
            </div>
          </div>
          <div style={{ margin: '40px auto', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d239201.32253363096!2d84.64724497421874!3d19.31527098642384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1b2e8c0f5c5a27%3A0x5e6c8d7f3a2b1c0d!2sBrahmapur%2C%20Odisha!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ASRONIX TECH AGENCY - Berhampur, Odisha"
            />
          </div>
          <div className="asronix-copyright">
            <p>&copy; 2026 ASRONIX TECH AGENCY — AI, Web &amp; Creative Solutions. All rights reserved. | Digital Innovation Architects</p>
          </div>
        </div>
      </section>

      {/* SHOP placeholder */}
      <section id="shop" style={{ padding: '80px 0', background: '#F8FBF9' }}>
        <div className="asronix-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F2C2A' }}>SHOP</h2>
          <div className="asronix-accent-line" style={{ width: 70, height: 3, background: '#D4AF37', margin: '14px auto 24px' }}></div>
          <p style={{ color: '#4A6A64', fontSize: '1.1rem' }}>Our digital products &amp; merchandise coming soon. Stay tuned!</p>
        </div>
      </section>

      {/* BLOG placeholder */}
      <section id="blog" style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="asronix-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F2C2A' }}>BLOG</h2>
          <div className="asronix-accent-line" style={{ width: 70, height: 3, background: '#D4AF37', margin: '14px auto 24px' }}></div>
          <p style={{ color: '#4A6A64', fontSize: '1.1rem' }}>Insights on AI, web development, branding &amp; digital growth. Articles launching soon!</p>
        </div>
      </section>
    </>
  );
}
