import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Type, Palette, Send, Download, Calendar, FileSignature as Signature, RotateCcw, Save, AlertCircle, CheckCircle, Clock, Zap, ShoppingCart, Euro } from 'lucide-react';
import { PostcardTemplate, PostcardCustomization } from '../types';
import { sendPostcard, generatePostcardCanvasDirectly } from '../services/emailService';
import { cartService } from '../services/cartService';

interface PostcardEditorProps {
  template: PostcardTemplate;
  onBack: () => void;
}

const PostcardEditor: React.FC<PostcardEditorProps> = ({ template, onBack }) => {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'customize' | 'message' | 'send'>('customize');
  const [showBack, setShowBack] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [customization, setCustomization] = useState<PostcardCustomization>({
    frontText: 'Pozdrav iz prekrasnog mjesta!',
    frontTextColor: '#ffffff',
    frontTextSize: 24,
    frontTextFont: 'serif',
    message: '',
    signature: '',
    recipientEmail: '',
    recipientName: '',
    senderName: '',
  });

  // Always ready - no DOM dependency!
  const refsReady = true;

  useEffect(() => {
    console.log('PostcardEditor ready - using DIRECT Canvas API');
  }, []);

  const fonts = [
    { value: 'serif', label: 'Serif', className: 'font-serif' },
    { value: 'sans', label: 'Sans-serif', className: 'font-sans' },
    { value: 'mono', label: 'Monospace', className: 'font-mono' },
    { value: 'cursive', label: 'Cursive', className: 'font-cursive' },
  ];

  const textSizes = [
    { value: 16, label: 'Mala' },
    { value: 20, label: 'Srednja' },
    { value: 24, label: 'Velika' },
    { value: 32, label: 'Vrlo velika' },
  ];

  const updateCustomization = (updates: Partial<PostcardCustomization>) => {
    console.log('Updating customization:', updates);
    setCustomization(prev => ({ ...prev, ...updates }));
    setSendError(null);
    setSendSuccess(false);
    setAddedToCart(false);
    
    // Auto-save simulation
    setTimeout(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 500);
  };

  const validateForm = () => {
    console.log('Validating form, step:', step, 'customization:', customization);
    
    if (step === 'send') {
      if (!customization.recipientEmail?.trim()) {
        setSendError('Email primatelja je obavezan');
        return false;
      }
      if (!customization.senderName?.trim()) {
        setSendError('Vaše ime je obavezno');
        return false;
      }
      
      // Enhanced email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customization.recipientEmail)) {
        setSendError('Molimo unesite valjanu email adresu');
        return false;
      }
      
      if (customization.senderName.length < 2) {
        setSendError('Ime mora imati najmanje 2 znaka');
        return false;
      }
    }
    
    setSendError(null);
    return true;
  };

  const handleAddToCart = async () => {
    console.log('🛒 Adding to cart...');
    
    try {
      setIsCapturing(true);
      
      // Generate images for cart
      const { frontImage, backImage } = await generatePostcardCanvasDirectly({
        backgroundImageUrl: template.image,
        frontText: customization.frontText,
        textColor: customization.frontTextColor,
        fontSize: customization.frontTextSize,
        fontFamily: customization.frontTextFont,
        message: customization.message || 'Vaša poruka ovdje...',
        signature: customization.signature,
        recipientName: customization.recipientName || 'Ime primatelja',
        recipientEmail: customization.recipientEmail || 'email@primjer.com',
        senderName: customization.senderName || 'Vaše ime'
      });
      
      // Add to cart
      cartService.addToCart(template, customization, frontImage, backImage);
      
      setAddedToCart(true);
      
      // Show success message for 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
      
      console.log('✅ Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSendError('Greška pri dodavanju u košaricu. Molimo pokušajte ponovno.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    console.log('🚀 Starting INSTANT download with DIRECT Canvas API...');
    
    try {
      setSendError(null);
      setIsCapturing(true);
      
      // Use DIRECT Canvas generation - NO DOM dependency!
      const { frontImage, backImage } = await generatePostcardCanvasDirectly({
        backgroundImageUrl: template.image,
        frontText: customization.frontText,
        textColor: customization.frontTextColor,
        fontSize: customization.frontTextSize,
        fontFamily: customization.frontTextFont,
        message: customization.message || 'Vaša poruka ovdje...',
        signature: customization.signature,
        recipientName: customization.recipientName || 'Ime primatelja',
        recipientEmail: customization.recipientEmail || 'email@primjer.com',
        senderName: customization.senderName || 'Vaše ime'
      });
      
      // Download front
      const frontLink = document.createElement('a');
      frontLink.download = `razglednica-prednja-${template.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      frontLink.href = frontImage;
      frontLink.click();
      
      // Download back
      setTimeout(() => {
        const backLink = document.createElement('a');
        backLink.download = `razglednica-straznja-${template.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        backLink.href = backImage;
        backLink.click();
      }, 500);
      
      console.log('✅ Download completed successfully');
    } catch (error) {
      console.error('Error downloading postcard:', error);
      setSendError('Greška pri preuzimanju razglednice. Molimo pokušajte ponovno.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSend = async () => {
    console.log('⚡ INSTANT send button clicked!');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setIsSending(true);
    setIsCapturing(true);
    setSendError(null);
    setSendSuccess(false);
    console.log('⚡ Starting INSTANT postcard send...');
    
    try {
      // INSTANT Canvas generation - NO DOM dependency!
      console.log('🎨 Starting DIRECT Canvas generation...');
      
      const { frontImage, backImage } = await generatePostcardCanvasDirectly({
        backgroundImageUrl: template.image,
        frontText: customization.frontText,
        textColor: customization.frontTextColor,
        fontSize: customization.frontTextSize,
        fontFamily: customization.frontTextFont,
        message: customization.message || 'Vaša poruka ovdje...',
        signature: customization.signature,
        recipientName: customization.recipientName || 'Ime primatelja',
        recipientEmail: customization.recipientEmail,
        senderName: customization.senderName
      });
      
      console.log('✅ Images generated instantly, sending email...');
      
      setIsCapturing(false);
      
      // Send postcard with images
      await sendPostcard({
        recipientEmail: customization.recipientEmail,
        recipientName: customization.recipientName || 'Dragi prijatelj',
        senderName: customization.senderName,
        message: customization.message || customization.frontText,
        frontImageData: frontImage,
        backImageData: backImage
      });
      
      console.log('✅ Postcard sent successfully');
      setSendSuccess(true);
      
      // Show success message for 3 seconds then go back
      setTimeout(() => {
        onBack();
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error sending postcard:', error);
      const errorMessage = error instanceof Error ? error.message : 'Nepoznata greška pri slanju razglednice';
      setSendError(errorMessage);
    } finally {
      setIsSending(false);
      setIsCapturing(false);
    }
  };

  const handleNextStep = () => {
    console.log('Next step clicked, current step:', step);
    if (step === 'customize') {
      setStep('message');
    } else if (step === 'message') {
      setStep('send');
    }
  };

  const renderCustomizeStep = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Postcard Preview */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Live pregled razglednice</h3>
          <div className="flex items-center space-x-4">
            {autoSaved && (
              <div className="flex items-center space-x-2 text-green-600 text-sm">
                <Save className="h-4 w-4" />
                <span>Automatski spremljeno</span>
              </div>
            )}
            <button
              onClick={() => setShowBack(!showBack)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <RotateCcw className="h-4 w-4" />
              <span>{showBack ? 'Prednja strana' : 'Stražnja strana'}</span>
            </button>
          </div>
        </div>

        {/* Front Side */}
        <div 
          ref={frontRef}
          className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden aspect-[3/2] max-w-lg mx-auto transition-all duration-500 ${showBack ? 'hidden' : 'block'}`}
          style={{ minHeight: '300px' }}
        >
          <img
            src={template.image}
            alt={template.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onLoad={() => {
              console.log('Front image loaded');
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error('Front image failed to load:', e);
              setImageLoaded(true);
            }}
          />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div 
              className={`text-center ${customization.frontTextFont === 'serif' ? 'font-serif' : customization.frontTextFont === 'sans' ? 'font-sans' : customization.frontTextFont === 'mono' ? 'font-mono' : 'font-cursive'}`}
              style={{
                color: customization.frontTextColor,
                fontSize: `${customization.frontTextSize}px`,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                lineHeight: '1.2'
              }}
            >
              {customization.frontText}
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div 
          ref={backRef}
          className={`bg-white rounded-2xl shadow-2xl aspect-[3/2] max-w-lg mx-auto p-6 flex flex-col transition-all duration-500 ${showBack ? 'block' : 'hidden'}`}
          style={{ minHeight: '300px' }}
        >
          {/* Message Area */}
          <div className="flex-1 border-b-2 border-gray-200 pb-4 mb-4">
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wide">PORUKA:</div>
              <div className="min-h-[120px] text-sm leading-relaxed text-gray-800">
                {customization.message || 'Ovdje će biti vaša osobna poruka...'}
              </div>
              {customization.signature && (
                <div className="mt-4 text-right">
                  <div className="text-sm italic text-gray-600">- {customization.signature}</div>
                </div>
              )}
            </div>
          </div>

          {/* Address Area */}
          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="text-xs font-semibold text-gray-500 mb-1 tracking-wide">PRIMA:</div>
              <div className="text-sm text-gray-800">
                {customization.recipientName || 'Ime primatelja'}
              </div>
              <div className="text-xs text-gray-600">
                {customization.recipientEmail || 'email@primjer.com'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500 mb-1 tracking-wide">ŠALJE:</div>
              <div className="text-sm text-gray-800">
                {customization.senderName || 'Vaše ime'}
              </div>
            </div>
          </div>

          {/* Postcard branding */}
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-400">RetroPost.com</div>
          </div>
        </div>
      </div>

      {/* Customization Controls Sidebar */}
      <div className="space-y-6 bg-white rounded-2xl shadow-lg p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personaliziraj tekst</h3>
          <div className="flex items-center space-x-1 text-green-600 font-semibold">
            <Euro className="h-4 w-4" />
            <span>{template.price}</span>
          </div>
        </div>
        
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            <Type className="inline h-4 w-4 mr-1" />
            Tekst na razglednici
          </label>
          <textarea
            value={customization.frontText}
            onChange={(e) => updateCustomization({ frontText: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
            placeholder="Unesite svoj tekst..."
          />
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Font</label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map(font => (
              <button
                key={font.value}
                onClick={() => updateCustomization({ frontTextFont: font.value })}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  customization.frontTextFont === font.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300'
                } ${font.className}`}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Veličina teksta</label>
          <div className="grid grid-cols-2 gap-2">
            {textSizes.map(size => (
              <button
                key={size.value}
                onClick={() => updateCustomization({ frontTextSize: size.value })}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  customization.frontTextSize === size.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:text-gray-300'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            <Palette className="inline h-4 w-4 mr-1" />
            Boja teksta
          </label>
          <div className="flex flex-wrap gap-2">
            {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
              <button
                key={color}
                onClick={() => updateCustomization({ frontTextColor: color })}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  customization.frontTextColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={customization.frontTextColor}
              onChange={(e) => updateCustomization({ frontTextColor: e.target.value })}
              className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3 pt-4">
          <button
            onClick={handleAddToCart}
            disabled={isCapturing}
            className="flex items-center justify-center space-x-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCapturing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Dodaje se...</span>
              </>
            ) : addedToCart ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Dodano u košaricu!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Dodaj u košaricu (€{template.price})</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={isCapturing}
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {isCapturing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>⚡ Instant...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>⚡ Instant preuzmi</span>
              </>
            )}
          </button>
          <button
            onClick={handleNextStep}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all"
          >
            Nastavi →
          </button>
        </div>
      </div>
    </div>
  );

  const renderMessageStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 text-center dark:text-white">Napišite poruku</h3>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 dark:bg-gray-800">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Osobna poruka</label>
          <textarea
            value={customization.message}
            onChange={(e) => updateCustomization({ message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={6}
            placeholder="Napišite svoju osobnu poruku..."
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            {customization.message.length}/500 znakova
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            <Signature className="inline h-4 w-4 mr-1" />
            Potpis
          </label>
          <input
            type="text"
            value={customization.signature}
            onChange={(e) => updateCustomization({ signature: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Vaš potpis..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setStep('customize')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            ← Natrag
          </button>
          <button
            onClick={handleNextStep}
            className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all"
          >
            Nastavi →
          </button>
        </div>
      </div>
    </div>
  );

  const renderSendStep = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-2xl font-semibold text-gray-900 text-center dark:text-white">Pošaljite razglednicu</h3>
      
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 dark:bg-gray-800">
        {/* Success Message */}
        {sendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center space-x-2 text-green-800 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">✅ Razglednica je uspješno poslana!</span>
            </div>
            <p className="text-green-600 text-sm mt-1 dark:text-green-400">
              Primatelj će uskoro dobiti vašu prekrasnu razglednicu na email adresi {customization.recipientEmail}
            </p>
          </div>
        )}

        {/* Error Message */}
        {sendError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Greška:</span>
            </div>
            <p className="text-red-600 text-sm mt-1 dark:text-red-400">{sendError}</p>
          </div>
        )}

        {/* Capturing Status */}
        {isCapturing && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium dark:text-blue-300">⚡ INSTANT kreiranje razglednice...</span>
            </div>
            <p className="text-blue-600 text-sm mt-1 dark:text-blue-400">
              Canvas API - bez čekanja!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Ime primatelja *</label>
            <input
              type="text"
              value={customization.recipientName}
              onChange={(e) => updateCustomization({ recipientName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ime primatelja"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Email primatelja *</label>
            <input
              type="email"
              value={customization.recipientEmail}
              onChange={(e) => updateCustomization({ recipientEmail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="email@primjer.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Vaše ime *</label>
          <input
            type="text"
            value={customization.senderName}
            onChange={(e) => updateCustomization({ senderName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Vaše ime"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
            <Calendar className="inline h-4 w-4 mr-1" />
            Zakaži slanje (opcionalno)
          </label>
          <input
            type="datetime-local"
            value={customization.scheduledDate || ''}
            onChange={(e) => updateCustomization({ scheduledDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            Ostavite prazno za trenutno slanje
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-300">
            <Zap className="h-4 w-4" />
            <span className="font-medium">⚡ INSTANT dostava putem emaila</span>
          </div>
          <p className="text-blue-600 text-sm mt-1 dark:text-blue-400">
            Canvas API omogućuje instant kreiranje razglednice bez čekanja. Email će biti poslan odmah!
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setStep('message')}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={isSending}
          >
            ← Natrag
          </button>
          <button
            onClick={handleSend}
            disabled={!customization.recipientEmail || !customization.senderName || isSending || sendSuccess}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isCapturing ? '⚡ Kreira...' : 'Šalje se...'}</span>
              </>
            ) : sendSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Poslano!</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>⚡ INSTANT pošalji</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Natrag na galeriju</span>
          </button>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {['customize', 'message', 'send'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === stepName ? 'bg-primary-500 text-white' : 
                  ['customize', 'message', 'send'].indexOf(step) > index ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-2 transition-all ${
                    ['customize', 'message', 'send'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500 flex items-center space-x-2 dark:text-gray-400">
            <Euro className="h-4 w-4 text-green-500" />
            <span>{template.price}</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="animate-fade-in">
          {step === 'customize' && renderCustomizeStep()}
          {step === 'message' && renderMessageStep()}
          {step === 'send' && renderSendStep()}
        </div>
      </div>
    </div>
  );
};

export default PostcardEditor;