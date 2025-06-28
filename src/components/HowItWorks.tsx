import React from 'react';
import { Upload, Edit, Send, Clock, Zap, Heart, Cpu, Sparkles } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Odaberite predložak ili učitajte vlastitu fotografiju',
      description: 'Pregledajte našu galeriju prekrasnih predložaka ili učitajte svoju fotografiju',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Edit,
      title: 'Personalizirajte tekst s modernim fontovima i bojama',
      description: 'Dodajte svoj osobni dodir s prilagođenim tekstom, fontovima i bojama',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: Send,
      title: 'Pošaljite digitalnim putem',
      description: 'Jednostavno unesite podatke primatelja i pošaljite razglednicu',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Instant dostava putem emaila',
      description: 'Pratite status dostave i uživajte u radosti koju ste podijelili',
      color: 'from-purple-500 to-orange-600'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-500/20 rounded-full opacity-60 animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-500/20 rounded-full opacity-60 animate-float delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Kako
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> funkcionira</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Jednostavan proces u četiri koraka za slanje prekrasnih razglednica
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-0 opacity-30"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-blue-400/20 hover:border-blue-400/40 z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/25">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 relative`}>
                  <step.icon className="h-8 w-8 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-2xl blur-xl transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Počnite kreirati razglednice</span>
              <Zap className="h-5 w-5 animate-pulse" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;