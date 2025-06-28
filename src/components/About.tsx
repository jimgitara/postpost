import React from 'react';
import { Zap, Users, Globe, Award, Heart, Star, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Digitalna čarolija',
      description: 'Vraćamo toplinu razglednica u moderno digitalno doba'
    },
    {
      icon: Users,
      title: 'Povezujemo ljude',
      description: 'Više od 5.000 poslanih razglednica kroz digitalni prostor'
    },
    {
      icon: Globe,
      title: 'Globalna mreža',
      description: 'Šaljemo razglednice u više od 50 zemalja širom svijeta'
    },
    {
      icon: Award,
      title: 'Premium kvaliteta',
      description: 'Moderni dizajn i visoka kvaliteta za svaku razglednicu'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-pink-500/20 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-green-500/20 rounded-full opacity-60 animate-float delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-blue-500/20 rounded-full opacity-60 animate-float delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            O
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> nama</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed">
                RetroPost omogućuje vam da stvorite i pošaljite personalizirane digitalne razglednice svojim najdražima u samo nekoliko klikova.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Naša misija je ponovno oživjeti čaroliju fizičkih razglednica u digitalnom dobu, kombiniranjem jednostavnosti online kreiranja s toplinom osobne poruke.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Vjerujemo da svaki trenutak zaslužuje biti podijeljen na poseban način. Bilo da se radi o putovanju, proslavi ili jednostavno želji da nekome pokažete da mislite na njega.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-400/20 hover:border-blue-400/40 transition-all group">
                <div className="text-3xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">5K+</div>
                <div className="text-gray-400">Razglednica</div>
              </div>
              <div className="text-center p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-400/20 hover:border-pink-400/40 transition-all group">
                <div className="text-3xl font-bold text-pink-400 mb-2 group-hover:scale-110 transition-transform">50+</div>
                <div className="text-gray-400">Zemalja</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="flex items-start space-x-4 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 border border-blue-400/20 hover:border-blue-400/40">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative">
                      <feature.icon className="h-6 w-6 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                  <div className="opacity-20 group-hover:opacity-40 transition-opacity">
                    <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;