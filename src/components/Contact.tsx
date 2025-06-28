import React, { useState } from 'react';
import { Mail, Clock, HelpCircle, Send, Phone, MapPin, Zap, BrainCircuit as Circuit, CheckCircle, AlertCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ime je obavezno';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Unesite valjanu email adresu';
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Predmet je obavezan';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Poruka je obavezna';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Poruka mora imati najmanje 10 znakova';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const encode = (data: Record<string, string>) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Check if running on localhost
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.includes('localhost');
    
    try {
      if (isLocalhost) {
        // Skip Netlify and go directly to FormSubmit for local development
        console.log('Running on localhost, using FormSubmit directly');
        throw new Error('Skipping Netlify for localhost');
      }

      // Primary: Netlify Forms (only for deployed sites)
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "contact",
          ...formData
        })
      });

      if (response.ok) {
        console.log('Netlify form submission successful');
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        throw new Error('Netlify form submission failed');
      }
    } catch (error) {
      console.log('Using FormSubmit backup service');
      
      try {
        // Backup: FormSubmit.co
        const formSubmitResponse = await fetch('https://formsubmit.co/jimgitara@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _subject: `RetroPost Contact: ${formData.subject}`,
            _captcha: 'false',
            _template: 'table'
          })
        });

        if (formSubmitResponse.ok) {
          console.log('FormSubmit backup successful');
          setSubmitStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setErrors({});
          
          setTimeout(() => {
            setSubmitStatus('idle');
          }, 5000);
        } else {
          throw new Error('FormSubmit service failed');
        }
      } catch (backupError) {
        console.error('All email services failed:', backupError);
        setSubmitStatus('error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Input change:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInputFocus = (e: React.FocusEvent) => {
    console.log('Input focused:', e.target);
  };

  const handleInputClick = (e: React.MouseEvent) => {
    console.log('Input clicked:', e.target);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email podrška',
      content: 'jimgitara@gmail.com',
      description: 'Pošaljite nam email za bilo kakva pitanja'
    },
    {
      icon: Clock,
      title: 'Radno vrijeme',
      content: 'Pon-Pet 9:00-17:00',
      description: 'Dostupni smo radnim danima'
    },
    {
      icon: HelpCircle,
      title: 'Često postavljena pitanja',
      content: 'Pomoć centar',
      description: 'Pronađite odgovore na najčešća pitanja'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-cyber-gradient relative overflow-hidden">
      {/* Hidden Netlify Form */}
      <form 
        name="contact" 
        netlify="true" 
        netlify-honeypot="bot-field" 
        hidden
        style={{ display: 'none' }}
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <select name="subject">
          <option value="general">Opća pitanja</option>
          <option value="technical">Tehnička podrška</option>
          <option value="billing">Naplata</option>
          <option value="feedback">Povratne informacije</option>
          <option value="partnership">Partnerstvo</option>
        </select>
        <textarea name="message"></textarea>
      </form>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-neon-pink/10 rounded-full blur-xl animate-pulse-neon pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-xl animate-pulse-neon delay-1000 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cyber font-bold text-white mb-4">
            <span className="bg-neon-gradient bg-clip-text text-transparent">Kontakt</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-tech">
            Imate pitanja? Spojite se s našim timom!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-cyber font-bold text-white mb-6">Stupite u kontakt</h3>
              <p className="text-lg text-gray-300 mb-8 font-tech">
                Naš tim je spreman odgovoriti na sva vaša pitanja i pomoći vam da stvorite savršenu razglednicu.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="group relative">
                  <div className="flex items-start space-x-4 p-6 bg-dark-200/50 backdrop-blur-sm rounded-2xl border border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-neon-blue/10">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-neon-gradient rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-tech font-semibold text-white mb-1">
                        {info.title}
                      </h4>
                      <p className="text-neon-blue font-tech font-medium mb-1">
                        {info.content}
                      </p>
                      <p className="text-gray-400 text-sm font-tech">
                        {info.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Additional Contact Info */}
            <div className="bg-dark-200/30 backdrop-blur-sm rounded-2xl p-6 border border-neon-pink/20">
              <h4 className="text-lg font-tech font-semibold text-white mb-4 flex items-center">
                <Circuit className="h-5 w-5 text-neon-pink mr-2" />
                Dodatne informacije
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-neon-blue" />
                  <span className="text-gray-300 font-tech">+385 1 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-neon-blue" />
                  <span className="text-gray-300 font-tech">Zagreb, Hrvatska</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="bg-dark-200/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-neon-blue/20 hover:border-neon-blue/40 transition-all duration-300 relative z-20">
              <h3 className="text-2xl font-cyber font-bold text-white mb-6 flex items-center">
                <Zap className="h-6 w-6 text-neon-blue mr-2" />
                Pošaljite nam poruku
              </h3>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-neon-green" />
                  <span className="text-neon-green font-tech">Poruka je uspješno poslana! Odgovorit ćemo vam uskoro.</span>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-tech">Greška pri slanju poruke. Molimo pokušajte ponovno.</span>
                </div>
              )}
              
              <form 
                onSubmit={handleSubmit} 
                className="space-y-6 relative z-30"
                name="contact"
                method="POST"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                action="https://formsubmit.co/jimgitara@gmail.com"
              >
                {/* Honeypot field */}
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="_subject" value="RetroPost Contact Form" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_template" value="table" />
                
                <div style={{ display: 'none' }}>
                  <label>
                    Don't fill this out if you're human: <input name="bot-field" tabIndex={-1} />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative z-40">
                    <label className="block text-sm font-tech font-medium text-gray-300 mb-2">
                      Ime i prezime *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onClick={handleInputClick}
                      required
                      tabIndex={1}
                      className={`w-full px-4 py-3 bg-dark-300/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all text-white placeholder-gray-400 font-tech relative z-50 ${
                        errors.name ? 'border-red-500' : 'border-neon-blue/30'
                      }`}
                      placeholder="Vaše ime"
                      style={{ 
                        pointerEvents: 'auto',
                        position: 'relative',
                        zIndex: 50
                      }}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400 font-tech">{errors.name}</p>
                    )}
                  </div>
                  <div className="relative z-40">
                    <label className="block text-sm font-tech font-medium text-gray-300 mb-2">
                      Email adresa *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={handleInputFocus}
                      onClick={handleInputClick}
                      required
                      tabIndex={2}
                      className={`w-full px-4 py-3 bg-dark-300/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all text-white placeholder-gray-400 font-tech relative z-50 ${
                        errors.email ? 'border-red-500' : 'border-neon-blue/30'
                      }`}
                      placeholder="vas@email.com"
                      style={{ 
                        pointerEvents: 'auto',
                        position: 'relative',
                        zIndex: 50
                      }}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400 font-tech">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="relative z-40">
                  <label className="block text-sm font-tech font-medium text-gray-300 mb-2">
                    Predmet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onClick={handleInputClick}
                    required
                    tabIndex={3}
                    className={`w-full px-4 py-3 bg-dark-300/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all text-white font-tech relative z-50 ${
                      errors.subject ? 'border-red-500' : 'border-neon-blue/30'
                    }`}
                    style={{ 
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 50
                    }}
                  >
                    <option value="" className="bg-dark-200 text-white">Odaberite predmet</option>
                    <option value="general" className="bg-dark-200 text-white">Opća pitanja</option>
                    <option value="technical" className="bg-dark-200 text-white">Tehnička podrška</option>
                    <option value="billing" className="bg-dark-200 text-white">Naplata</option>
                    <option value="feedback" className="bg-dark-200 text-white">Povratne informacije</option>
                    <option value="partnership" className="bg-dark-200 text-white">Partnerstvo</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400 font-tech">{errors.subject}</p>
                  )}
                </div>

                <div className="relative z-40">
                  <label className="block text-sm font-tech font-medium text-gray-300 mb-2">
                    Poruka *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    onClick={handleInputClick}
                    required
                    rows={6}
                    tabIndex={4}
                    maxLength={500}
                    className={`w-full px-4 py-3 bg-dark-300/50 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-neon-blue focus:border-transparent transition-all resize-none text-white placeholder-gray-400 font-tech relative z-50 ${
                      errors.message ? 'border-red-500' : 'border-neon-blue/30'
                    }`}
                    placeholder="Opišite kako vam možemo pomoći..."
                    style={{ 
                      pointerEvents: 'auto',
                      position: 'relative',
                      zIndex: 50
                    }}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400 font-tech">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400 font-tech">
                    {formData.message.length}/500 znakova
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  tabIndex={5}
                  className="group relative w-full flex items-center justify-center space-x-2 bg-neon-gradient text-white py-4 rounded-xl font-tech font-semibold hover:shadow-lg hover:shadow-neon-blue/25 transition-all duration-300 transform hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none z-50"
                  style={{ 
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 50
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white relative z-10"></div>
                      <span className="relative z-10">Šalje se...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 relative z-10" />
                      <span className="relative z-10">Pošaljite poruku</span>
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-neon-gradient opacity-5 rounded-2xl blur-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;