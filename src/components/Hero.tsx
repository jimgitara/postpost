import React from 'react';
import { Send, Zap, Sparkles, BrainCircuit as Circuit, Cpu } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface HeroProps {
  onStartCreating: () => void;
  onViewExamples: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartCreating, onViewExamples }) => {
  const { t } = useApp();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-cyber-gradient dark:bg-cyber-gradient light:bg-gradient-to-br light:from-blue-50 light:via-white light:to-purple-50">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20 dark:opacity-20 light:opacity-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] animate-cyber-grid"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-neon-blue/20 dark:bg-neon-blue/20 light:bg-blue-500/10 rounded-full opacity-60 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-neon-pink/20 dark:bg-neon-pink/20 light:bg-purple-500/10 rounded-full opacity-60 animate-float delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-neon-green/20 dark:bg-neon-green/20 light:bg-green-500/10 rounded-full opacity-60 animate-float delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-neon-purple/20 dark:bg-neon-purple/20 light:bg-purple-500/10 rounded-full opacity-60 animate-float delay-700"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-neon-blue/10 dark:bg-neon-blue/10 light:bg-blue-500/5 rounded-full blur-xl animate-pulse-neon"></div>
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-neon-pink/10 dark:bg-neon-pink/10 light:bg-purple-500/5 rounded-full blur-xl animate-pulse-neon delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-dark-200/80 dark:bg-dark-200/80 light:bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-neon-blue/30 dark:border-neon-blue/30 light:border-blue-200 mb-8 animate-fade-in group hover:border-neon-blue/60 dark:hover:border-neon-blue/60 light:hover:border-blue-300 transition-all duration-300">
            <Sparkles className="h-4 w-4 text-neon-blue dark:text-neon-blue light:text-blue-500 animate-pulse-neon" />
            <span className="text-sm font-tech font-medium text-neon-blue dark:text-neon-blue light:text-blue-600">{t('hero.badge')}</span>
            <Circuit className="h-4 w-4 text-neon-blue dark:text-neon-blue light:text-blue-500 animate-pulse-neon delay-500" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-cyber font-bold text-white dark:text-white light:text-gray-900 mb-6 animate-slide-up">
            {t('hero.title')}
            <span className="bg-neon-gradient dark:bg-neon-gradient light:bg-gradient-to-r light:from-blue-600 light:to-purple-600 bg-clip-text text-transparent animate-glow"> {t('hero.titleHighlight')} </span>
            {t('hero.titleEnd')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-300 light:text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-100 font-tech">
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up delay-200">
            <button 
              onClick={onStartCreating}
              className="group relative flex items-center space-x-3 bg-neon-gradient dark:bg-neon-gradient light:bg-gradient-to-r light:from-blue-500 light:to-purple-500 text-white px-8 py-4 rounded-xl font-tech font-semibold text-lg hover:shadow-lg hover:shadow-neon-blue/25 dark:hover:shadow-neon-blue/25 light:hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Send className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{t('hero.startCreating')}</span>
              <Cpu className="h-5 w-5 relative z-10 animate-pulse-neon" />
            </button>
            <button 
              onClick={onViewExamples}
              className="group flex items-center space-x-3 bg-dark-200/80 dark:bg-dark-200/80 light:bg-white/80 backdrop-blur-sm text-gray-300 dark:text-gray-300 light:text-gray-700 px-8 py-4 rounded-xl font-tech font-semibold text-lg hover:bg-dark-200 dark:hover:bg-dark-200 light:hover:bg-white hover:text-neon-blue dark:hover:text-neon-blue light:hover:text-blue-600 transition-all duration-300 transform hover:scale-105 border border-neon-blue/30 dark:border-neon-blue/30 light:border-blue-200 hover:border-neon-blue/60 dark:hover:border-neon-blue/60 light:hover:border-blue-300"
            >
              <Zap className="h-5 w-5 group-hover:text-neon-blue dark:group-hover:text-neon-blue light:group-hover:text-blue-600 transition-colors" />
              <span>{t('hero.viewExamples')}</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in delay-300">
            <div className="text-center group">
              <div className="relative">
                <div className="text-3xl md:text-4xl font-cyber font-bold text-neon-blue dark:text-neon-blue light:text-blue-600 mb-2 group-hover:animate-glow transition-all">50+</div>
                <div className="absolute inset-0 text-3xl md:text-4xl font-cyber font-bold text-neon-blue/20 dark:text-neon-blue/20 light:text-blue-600/20 blur-sm">50+</div>
              </div>
              <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-tech">{t('hero.stats.templates')}</div>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="text-3xl md:text-4xl font-cyber font-bold text-neon-pink dark:text-neon-pink light:text-purple-600 mb-2 group-hover:animate-glow transition-all">5K+</div>
                <div className="absolute inset-0 text-3xl md:text-4xl font-cyber font-bold text-neon-pink/20 dark:text-neon-pink/20 light:text-purple-600/20 blur-sm">5K+</div>
              </div>
              <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-tech">{t('hero.stats.users')}</div>
            </div>
            <div className="text-center group">
              <div className="relative">
                <div className="text-3xl md:text-4xl font-cyber font-bold text-neon-green dark:text-neon-green light:text-green-600 mb-2 group-hover:animate-glow transition-all">100%</div>
                <div className="absolute inset-0 text-3xl md:text-4xl font-cyber font-bold text-neon-green/20 dark:text-neon-green/20 light:text-green-600/20 blur-sm">100%</div>
              </div>
              <div className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-tech">{t('hero.stats.free')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;