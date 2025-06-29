import React, { useState } from 'react';
import { Search, Filter, Heart, Eye, Zap, Sparkles, ShoppingCart, Euro } from 'lucide-react';
import { PostcardTemplate } from '../types';
import { useApp } from '../contexts/AppContext';
import { useAnalytics } from '../hooks/useAnalytics';

interface GalleryProps {
  onTemplateSelect: (template: PostcardTemplate) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onTemplateSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sve');
  const { t } = useApp();
  const { trackTemplateViewed, trackTemplateSelected, trackEvent } = useAnalytics();

  const templates: PostcardTemplate[] = [
    {
      id: '1',
      name: t('gallery.nature') === 'Nature' ? 'Tropical Beach' : 'Tropska Plaža',
      image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'priroda',
      description: t('gallery.nature') === 'Nature' ? 'Beautiful tropical beach with crystal clear water' : 'Prekrasna tropska plaža s kristalno čistim morem',
      price: 15
    },
    {
      id: '2',
      name: t('gallery.nature') === 'Nature' ? 'Mountain Peak' : 'Planinski Vrh',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'priroda',
      description: t('gallery.nature') === 'Nature' ? 'Spectacular view from mountain peak' : 'Spektakularan pogled s planinskog vrha',
      price: 18
    },
    {
      id: '3',
      name: t('gallery.cities') === 'Cities' ? 'City Panorama' : 'Gradska Panorama',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'grad',
      description: t('gallery.cities') === 'Cities' ? 'Modern city panorama at dusk' : 'Moderna gradska panorama u sumrak',
      price: 20
    },
    {
      id: '4',
      name: t('gallery.romance') === 'Romance' ? 'Romantic Sunset' : 'Romantični Zalazak',
      image: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'romantika',
      description: t('gallery.romance') === 'Romance' ? 'Magical sunset over the sea' : 'Čaroban zalazak sunca nad morem',
      price: 22
    },
    {
      id: '5',
      name: t('gallery.nature') === 'Nature' ? 'Autumn Forest' : 'Jesenska Šuma',
      image: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800',
      category: 'priroda',
      description: t('gallery.nature') === 'Nature' ? 'Colorful autumn forest in full glory' : 'Šarena jesenska šuma u punoj slavi',
      price: 16
    },
    {
      id: '6',
      name: t('gallery.nature') === 'Nature' ? 'Peaceful Lake' : 'Mirno Jezero',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'priroda',
      description: t('gallery.nature') === 'Nature' ? 'Peaceful lake surrounded by mountains' : 'Spokojno jezero okruženo planinama',
      price: 17
    },
    {
      id: '7',
      name: t('gallery.cities') === 'Cities' ? 'Urban Style' : 'Urbani Stil',
      image: 'https://images.pexels.com/photos/936722/pexels-photo-936722.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'grad',
      description: t('gallery.cities') === 'Cities' ? 'Modern urban design and architecture' : 'Moderni urbani dizajn i arhitektura',
      price: 19
    },
    {
      id: '8',
      name: t('gallery.nature') === 'Nature' ? 'Flower Garden' : 'Cvijetni Vrt',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'priroda',
      description: t('gallery.nature') === 'Nature' ? 'Beautiful flower garden in spring' : 'Prekrasan cvijetni vrt u proljeće',
      price: 14
    }
  ];

  const categories = [
    { value: 'sve', label: t('gallery.allCategories') },
    { value: 'priroda', label: t('gallery.nature') },
    { value: 'grad', label: t('gallery.cities') },
    { value: 'romantika', label: t('gallery.romance') }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'sve' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateClick = (template: PostcardTemplate, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Template clicked:', template);
    
    // Track template selection
    trackTemplateSelected(template.id, template.name, template.category, template.price || 0);
    
    onTemplateSelect(template);
  };

  const handleTemplateView = (template: PostcardTemplate) => {
    // Track template view
    trackTemplateViewed(template.id, template.name, template.category);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Track search behavior
    if (value.length > 2) {
      trackEvent('gallery_search', 'user_interaction', value);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Track category filter usage
    trackEvent('gallery_filter', 'user_interaction', category);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 light:bg-gradient-to-br light:from-gray-50 light:via-blue-50 light:to-purple-50 relative overflow-hidden transition-colors duration-300">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 dark:opacity-10 light:opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px]"></div>
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/10 light:bg-blue-500/5 rounded-full blur-xl animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/10 light:bg-purple-500/5 rounded-full blur-xl animate-pulse delay-1000 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4">
            {t('gallery.title')}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 light:bg-gradient-to-r light:from-blue-600 light:to-purple-600 bg-clip-text text-transparent"> {t('gallery.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-300 light:text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-500" />
            <input
              type="text"
              placeholder={t('gallery.search')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/80 backdrop-blur-sm border border-blue-400/30 dark:border-blue-400/30 light:border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-white dark:text-white light:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-400 dark:text-blue-400 light:text-blue-500" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/80 backdrop-blur-sm border border-blue-400/30 dark:border-blue-400/30 light:border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none text-white dark:text-white light:text-gray-900 min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-slate-800 dark:bg-slate-800 light:bg-white text-white dark:text-white light:text-gray-900">
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, index) => (
            <div
              key={template.id}
              className="group relative bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/20 light:hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in border border-blue-400/20 dark:border-blue-400/20 light:border-blue-200 hover:border-blue-400/40 dark:hover:border-blue-400/40 light:hover:border-blue-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={(e) => handleTemplateClick(template, e)}
              onMouseEnter={() => handleTemplateView(template)}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                    <Euro className="h-3 w-3" />
                    <span>{template.price} {t('common.currency')}</span>
                  </div>
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-3">
                    <button 
                      className="bg-slate-800/90 backdrop-blur-sm text-blue-400 p-3 rounded-full hover:bg-slate-800 transition-colors border border-blue-400/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('template_preview', 'gallery', template.name);
                        console.log('Preview clicked for:', template.name);
                      }}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      className="bg-slate-800/90 backdrop-blur-sm text-pink-400 p-3 rounded-full hover:bg-slate-800 transition-colors border border-pink-400/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackEvent('template_favorite', 'gallery', template.name);
                        console.log('Favorite clicked for:', template.name);
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900">{template.name}</h3>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400 dark:text-green-400 light:text-green-600">{template.price} {t('common.currency')}</div>
                  </div>
                </div>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm mb-4">{template.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateClick(template, e);
                  }}
                  className="group relative w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t('gallery.customize')}</span>
                  </span>
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-slate-800/90 dark:bg-slate-800/90 light:bg-white/90 backdrop-blur-sm text-blue-400 dark:text-blue-400 light:text-blue-600 px-3 py-1 rounded-full text-xs font-medium capitalize border border-blue-400/30 dark:border-blue-400/30 light:border-blue-200">
                  {categories.find(cat => cat.value === template.category)?.label || template.category}
                </span>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-400 light:text-gray-500 mb-4">
              <Zap className="h-16 w-16 mx-auto text-blue-400/50 dark:text-blue-400/50 light:text-blue-500/50" />
            </div>
            <h3 className="text-xl font-semibold text-white dark:text-white light:text-gray-900 mb-2">{t('gallery.noResults')}</h3>
            <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">{t('gallery.noResultsDesc')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;