import React from 'react';
import { Zap, Users, Globe, Award, BrainCircuit as Circuit, Cpu, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Cyber čarolija',
      description: 'Vraćamo toplinu razglednica u futuristično cyber doba'
    },
    {
      icon: Users,
      title: 'Povezujemo cyber ljude',
      description: 'Više od 10.000 poslanih cyber razglednica kroz digitalni prostor'
    },
    {
      icon: Globe,
      title: 'Globalna cyber mreža',
      description: 'Šaljemo razglednice kroz cyber prostor u više od 50 zemalja'
    },
    {
      icon: Award,
      title: 'Premium cyber kvaliteta',
      description: 'Futuristički materijali i holografski tisak za svaku razglednicu'
    }
  ];

  return (
    <section id="about" className="py-20 bg-cyber-gradient relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-neon-pink/20 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-neon-green/20 rounded-full opacity-60 animate-float delay-300"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-neon-blue/20 rounded-full opacity-60 animate-float delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-cyber font-bold text-white mb-4">
            O
            <span className="bg-neon-gradient bg-clip-text text-transparent"> nama</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-xl text-gray-300 leading-relaxed font-tech">
                RetroPost omogućuje vam da stvorite i pošaljete personalizirane cyber razglednice svojim najdražima kroz digitalni prostor u samo nekoliko klikova.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed font-tech">
                Naša misija je ponovno oživjeti čaroliju fizičkih razglednica u cyber dobu, kombiniranjem jednostavnosti online kreiranja s toplinom futurističke poruke.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed font-tech">
                Vjerujemo da svaki trenutak zaslužuje biti podijeljen na cyber način. Bilo da se radi o putovanju kroz virtualnu stvarnost, proslavi ili jednostavno želji da nekome pokažete da mislite na njega kroz digitalni prostor.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-dark-200/50 backdrop-blur-sm rounded-2xl shadow-lg border border-neon-blue/20 hover:border-neon-blue/40 transition-all group">
                <div className="text-3xl font-cyber font-bold text-neon-blue mb-2 group-hover:animate-glow">10K+</div>
                <div className="text-gray-400 font-tech">Cyber razglednica</div>
              </div>
              <div className="text-center p-6 bg-dark-200/50 backdrop-blur-sm rounded-2xl shadow-lg border border-neon-pink/20 hover:border-neon-pink/40 transition-all group">
                <div className="text-3xl font-cyber font-bold text-neon-pink mb-2 group-hover:animate-glow">50+</div>
                <div className="text-gray-400 font-tech">Cyber zemalja</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="flex items-start space-x-4 p-6 bg-dark-200/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-neon-blue/20 transition-all duration-300 transform hover:-translate-y-1 border border-neon-blue/20 hover:border-neon-blue/40">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-neon-gradient rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300 relative">
                      <feature.icon className="h-6 w-6 text-white relative z-10" />
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-cyber font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 font-tech">
                      {feature.description}
                    </p>
                  </div>
                  <div className="opacity-20 group-hover:opacity-40 transition-opacity">
                    <Sparkles className="h-4 w-4 text-neon-blue animate-pulse-neon" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-neon-gradient opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;