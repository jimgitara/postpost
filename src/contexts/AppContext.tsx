import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { analyticsService } from '../services/analyticsService';

export type Language = 'hr' | 'en';
export type Theme = 'dark' | 'light';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translation keys
const translations = {
  hr: {
    // Header
    'header.gallery': 'Galerija',
    'header.howItWorks': 'Kako funkcionira',
    'header.about': 'O nama',
    'header.contact': 'Kontakt',
    'header.myPostcards': 'Moje razglednice',
    'header.cart': 'Košarica',
    'header.startCreating': 'Počni kreirati',
    
    // Hero
    'hero.badge': 'Besplatno kreiranje i slanje',
    'hero.title': 'Kreirajte i pošaljite',
    'hero.titleHighlight': 'personalizirane',
    'hero.titleEnd': 'digitalne razglednice',
    'hero.subtitle': 'Stvorite prekrasne digitalne razglednice s modernim predlošcima i pošaljite ih svojim najdražima u nekoliko klikova.',
    'hero.startCreating': 'Počni kreirati',
    'hero.viewExamples': 'Pogledaj primjere',
    'hero.stats.templates': 'Kreativnih predložaka',
    'hero.stats.users': 'Zadovoljnih korisnika',
    'hero.stats.free': 'Besplatno',
    
    // Gallery
    'gallery.title': 'Odaberite svoj',
    'gallery.titleHighlight': 'predložak',
    'gallery.subtitle': 'Pregledajte našu kolekciju prekrasnih predložaka razglednica s cijenama',
    'gallery.search': 'Pretraži predloške...',
    'gallery.allCategories': 'Sve kategorije',
    'gallery.nature': 'Priroda',
    'gallery.cities': 'Gradovi',
    'gallery.romance': 'Romantika',
    'gallery.customize': 'Personaliziraj i kupi',
    'gallery.noResults': 'Nema rezultata',
    'gallery.noResultsDesc': 'Pokušajte s drugačijim pojmovima pretrage ili kategorijom.',
    
    // How It Works
    'howItWorks.title': 'Kako',
    'howItWorks.titleHighlight': 'funkcionira',
    'howItWorks.subtitle': 'Jednostavan proces u četiri koraka za slanje prekrasnih razglednica',
    'howItWorks.step1.title': 'Odaberite predložak ili učitajte vlastitu fotografiju',
    'howItWorks.step1.desc': 'Pregledajte našu galeriju prekrasnih predložaka ili učitajte svoju fotografiju',
    'howItWorks.step2.title': 'Personalizirajte tekst s modernim fontovima i bojama',
    'howItWorks.step2.desc': 'Dodajte svoj osobni dodir s prilagođenim tekstom, fontovima i bojama',
    'howItWorks.step3.title': 'Pošaljite digitalnim putem',
    'howItWorks.step3.desc': 'Jednostavno unesite podatke primatelja i pošaljite razglednicu',
    'howItWorks.step4.title': 'Instant dostava putem emaila',
    'howItWorks.step4.desc': 'Pratite status dostave i uživajte u radosti koju ste podijelili',
    'howItWorks.cta': 'Počnite kreirati razglednice',
    
    // About
    'about.title': 'O',
    'about.titleHighlight': 'nama',
    'about.description1': 'RetroPost omogućuje vam da stvorite i pošaljete personalizirane digitalne razglednice svojim najdražima u samo nekoliko klikova.',
    'about.description2': 'Naša misija je ponovno oživjeti čaroliju fizičkih razglednica u digitalnom dobu, kombiniranjem jednostavnosti online kreiranja s toplinom osobne poruke.',
    'about.description3': 'Vjerujemo da svaki trenutak zaslužuje biti podijeljen na poseban način. Bilo da se radi o putovanju, proslavi ili jednostavno želji da nekome pokažete da mislite na njega.',
    'about.feature1.title': 'Digitalna čarolija',
    'about.feature1.desc': 'Vraćamo toplinu razglednica u moderno digitalno doba',
    'about.feature2.title': 'Povezujemo ljude',
    'about.feature2.desc': 'Više od 5.000 poslanih razglednica kroz digitalni prostor',
    'about.feature3.title': 'Globalna mreža',
    'about.feature3.desc': 'Šaljemo razglednice u više od 50 zemalja širom svijeta',
    'about.feature4.title': 'Premium kvaliteta',
    'about.feature4.desc': 'Moderni dizajn i visoka kvaliteta za svaku razglednicu',
    'about.stats.postcards': 'Razglednica',
    'about.stats.countries': 'Zemalja',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Imate pitanja? Spojite se s našim timom!',
    'contact.getInTouch': 'Stupite u kontakt',
    'contact.description': 'Naš tim je spreman odgovoriti na sva vaša pitanja i pomoći vam da stvorite savršenu razglednicu.',
    'contact.emailSupport': 'Email podrška',
    'contact.emailDesc': 'Pošaljite nam email za bilo kakva pitanja',
    'contact.workingHours': 'Radno vrijeme',
    'contact.workingHoursDesc': 'Dostupni smo radnim danima',
    'contact.faq': 'Često postavljena pitanja',
    'contact.faqDesc': 'Pronađite odgovore na najčešća pitanja',
    'contact.additionalInfo': 'Dodatne informacije',
    'contact.sendMessage': 'Pošaljite nam poruku',
    'contact.instantDelivery': 'INSTANT dostava putem emaila',
    'contact.instantDesc': 'Canvas API omogućuje instant kreiranje razglednice bez čekanja. Email će biti poslan odmah!',
    'contact.form.name': 'Ime i prezime',
    'contact.form.email': 'Email adresa',
    'contact.form.subject': 'Predmet',
    'contact.form.message': 'Poruka',
    'contact.form.selectSubject': 'Odaberite predmet',
    'contact.form.general': 'Opća pitanja',
    'contact.form.technical': 'Tehnička podrška',
    'contact.form.billing': 'Naplata',
    'contact.form.feedback': 'Povratne informacije',
    'contact.form.partnership': 'Partnerstvo',
    'contact.form.messagePlaceholder': 'Opišite kako vam možemo pomoći...',
    'contact.form.send': 'Pošaljite poruku',
    'contact.form.sending': 'Šalje se...',
    'contact.form.success': 'Poruka je uspješno poslana! Odgovorit ćemo vam uskoro.',
    'contact.form.error': 'Greška pri slanju poruke. Molimo pokušajte ponovno.',
    
    // Footer
    'footer.description': 'Kreirajte i pošaljite futurističke digitalne razglednice koje će oduševiti vaše voljene kroz cyber prostor.',
    'footer.quickLinks': 'Brze veze',
    'footer.support': 'Podrška',
    'footer.contact': 'Kontakt',
    'footer.copyright': '© 2024 RetroPost. Sva prava pridržana u cyber prostoru.',
    'footer.privacy': 'Privatnost',
    'footer.terms': 'Uvjeti',
    'footer.cookies': 'Kolačići',
    
    // Common
    'common.loading': 'Učitava...',
    'common.error': 'Greška',
    'common.success': 'Uspjeh',
    'common.back': 'Natrag',
    'common.next': 'Nastavi',
    'common.previous': 'Prethodno',
    'common.save': 'Spremi',
    'common.cancel': 'Odustani',
    'common.delete': 'Obriši',
    'common.edit': 'Uredi',
    'common.view': 'Pogledaj',
    'common.download': 'Preuzmi',
    'common.send': 'Pošalji',
    'common.price': 'Cijena',
    'common.total': 'Ukupno',
    'common.quantity': 'Količina',
    'common.currency': 'EUR',
  },
  en: {
    // Header
    'header.gallery': 'Gallery',
    'header.howItWorks': 'How It Works',
    'header.about': 'About',
    'header.contact': 'Contact',
    'header.myPostcards': 'My Postcards',
    'header.cart': 'Cart',
    'header.startCreating': 'Start Creating',
    
    // Hero
    'hero.badge': 'Free creation and sending',
    'hero.title': 'Create and send',
    'hero.titleHighlight': 'personalized',
    'hero.titleEnd': 'digital postcards',
    'hero.subtitle': 'Create beautiful digital postcards with modern templates and send them to your loved ones in just a few clicks.',
    'hero.startCreating': 'Start Creating',
    'hero.viewExamples': 'View Examples',
    'hero.stats.templates': 'Creative Templates',
    'hero.stats.users': 'Happy Users',
    'hero.stats.free': 'Free',
    
    // Gallery
    'gallery.title': 'Choose your',
    'gallery.titleHighlight': 'template',
    'gallery.subtitle': 'Browse our collection of beautiful postcard templates with pricing',
    'gallery.search': 'Search templates...',
    'gallery.allCategories': 'All Categories',
    'gallery.nature': 'Nature',
    'gallery.cities': 'Cities',
    'gallery.romance': 'Romance',
    'gallery.customize': 'Customize & Buy',
    'gallery.noResults': 'No Results',
    'gallery.noResultsDesc': 'Try different search terms or category.',
    
    // How It Works
    'howItWorks.title': 'How',
    'howItWorks.titleHighlight': 'it works',
    'howItWorks.subtitle': 'Simple four-step process for sending beautiful postcards',
    'howItWorks.step1.title': 'Choose template or upload your own photo',
    'howItWorks.step1.desc': 'Browse our gallery of beautiful templates or upload your own photo',
    'howItWorks.step2.title': 'Personalize text with modern fonts and colors',
    'howItWorks.step2.desc': 'Add your personal touch with custom text, fonts and colors',
    'howItWorks.step3.title': 'Send digitally',
    'howItWorks.step3.desc': 'Simply enter recipient details and send the postcard',
    'howItWorks.step4.title': 'Instant email delivery',
    'howItWorks.step4.desc': 'Track delivery status and enjoy the joy you\'ve shared',
    'howItWorks.cta': 'Start creating postcards',
    
    // About
    'about.title': 'About',
    'about.titleHighlight': 'us',
    'about.description1': 'RetroPost allows you to create and send personalized digital postcards to your loved ones in just a few clicks.',
    'about.description2': 'Our mission is to revive the magic of physical postcards in the digital age, combining the simplicity of online creation with the warmth of a personal message.',
    'about.description3': 'We believe every moment deserves to be shared in a special way. Whether it\'s a trip, celebration, or simply wanting to show someone you\'re thinking of them.',
    'about.feature1.title': 'Digital Magic',
    'about.feature1.desc': 'Bringing back the warmth of postcards to the modern digital age',
    'about.feature2.title': 'Connecting People',
    'about.feature2.desc': 'Over 5,000 postcards sent through digital space',
    'about.feature3.title': 'Global Network',
    'about.feature3.desc': 'Sending postcards to over 50 countries worldwide',
    'about.feature4.title': 'Premium Quality',
    'about.feature4.desc': 'Modern design and high quality for every postcard',
    'about.stats.postcards': 'Postcards',
    'about.stats.countries': 'Countries',
    
    // Contact
    'contact.title': 'Contact',
    'contact.subtitle': 'Have questions? Connect with our team!',
    'contact.getInTouch': 'Get in touch',
    'contact.description': 'Our team is ready to answer all your questions and help you create the perfect postcard.',
    'contact.emailSupport': 'Email Support',
    'contact.emailDesc': 'Send us an email for any questions',
    'contact.workingHours': 'Working Hours',
    'contact.workingHoursDesc': 'Available on weekdays',
    'contact.faq': 'Frequently Asked Questions',
    'contact.faqDesc': 'Find answers to the most common questions',
    'contact.additionalInfo': 'Additional Information',
    'contact.sendMessage': 'Send us a message',
    'contact.instantDelivery': 'INSTANT email delivery',
    'contact.instantDesc': 'Canvas API enables instant postcard creation without waiting. Email will be sent immediately!',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.selectSubject': 'Select subject',
    'contact.form.general': 'General Questions',
    'contact.form.technical': 'Technical Support',
    'contact.form.billing': 'Billing',
    'contact.form.feedback': 'Feedback',
    'contact.form.partnership': 'Partnership',
    'contact.form.messagePlaceholder': 'Describe how we can help you...',
    'contact.form.send': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success': 'Message sent successfully! We will reply to you soon.',
    'contact.form.error': 'Error sending message. Please try again.',
    
    // Footer
    'footer.description': 'Create and send futuristic digital postcards that will delight your loved ones through cyber space.',
    'footer.quickLinks': 'Quick Links',
    'footer.support': 'Support',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2024 RetroPost. All rights reserved in cyber space.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.cookies': 'Cookies',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.back': 'Back',
    'common.next': 'Continue',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.send': 'Send',
    'common.price': 'Price',
    'common.total': 'Total',
    'common.quantity': 'Quantity',
    'common.currency': 'EUR',
  }
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('retropost_language');
    return (saved as Language) || 'hr';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('retropost_theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    const previousLanguage = localStorage.getItem('retropost_language');
    localStorage.setItem('retropost_language', language);
    
    // Track language change
    if (previousLanguage && previousLanguage !== language) {
      analyticsService.trackLanguageChange(previousLanguage, language);
    }
  }, [language]);

  useEffect(() => {
    console.log('🌙 Theme changed to:', theme);
    const previousTheme = localStorage.getItem('retropost_theme');
    localStorage.setItem('retropost_theme', theme);
    
    // Clear all theme classes first
    document.documentElement.classList.remove('dark', 'light');
    
    // Add the new theme class
    document.documentElement.classList.add(theme);
    
    console.log('🌙 Document classes after theme change:', document.documentElement.className);
    
    // Track theme change
    if (previousTheme && previousTheme !== theme) {
      analyticsService.trackThemeChange(previousTheme, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log('🌙 Toggle theme called, current:', theme);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('🌙 Setting new theme:', newTheme);
    setTheme(newTheme);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value: AppContextType = {
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme,
    t,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};