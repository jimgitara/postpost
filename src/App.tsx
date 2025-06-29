import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import Contact from './components/Contact';
import PostcardEditor from './components/PostcardEditor';
import PhotoUpload from './components/PhotoUpload';
import Footer from './components/Footer';
import { PostcardTemplate } from './types';

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<PostcardTemplate | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleTemplateSelect = (template: PostcardTemplate) => {
    console.log('App: Template selected:', template);
    setSelectedTemplate(template);
    setShowEditor(true);
    setShowUpload(false);
  };

  const handleStartCreating = () => {
    console.log('App: Start creating clicked');
    setShowUpload(true);
    setShowEditor(false);
  };

  const handlePhotoUploaded = (imageUrl: string) => {
    console.log('App: Photo uploaded:', imageUrl);
    setUploadedImage(imageUrl);
    const customTemplate: PostcardTemplate = {
      id: 'custom',
      name: 'Vaša fotografija',
      image: imageUrl,
      category: 'custom',
      description: 'Vaša prilagođena fotografija'
    };
    setSelectedTemplate(customTemplate);
    setShowUpload(false);
    setShowEditor(true);
  };

  const handleBackToGallery = () => {
    console.log('App: Back to gallery clicked');
    setShowEditor(false);
    setShowUpload(false);
    setSelectedTemplate(null);
    setUploadedImage(null);
  };

  const scrollToGallery = () => {
    const galleryElement = document.getElementById('gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  console.log('App render - showEditor:', showEditor, 'showUpload:', showUpload, 'selectedTemplate:', selectedTemplate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 light:from-gray-50 light:via-blue-50 light:to-purple-50 transition-all duration-300">
      <Header onStartCreating={handleStartCreating} />
      
      {!showEditor && !showUpload ? (
        <>
          <Hero onStartCreating={handleStartCreating} onViewExamples={scrollToGallery} />
          <Gallery onTemplateSelect={handleTemplateSelect} />
          <HowItWorks />
          <About />
          <Contact />
        </>
      ) : showUpload ? (
        <PhotoUpload onPhotoUploaded={handlePhotoUploaded} onBack={handleBackToGallery} />
      ) : selectedTemplate ? (
        <PostcardEditor 
          template={selectedTemplate} 
          onBack={handleBackToGallery}
        />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white dark:text-white light:text-gray-900 text-center">
            <h2 className="text-2xl font-bold mb-4">Greška</h2>
            <p className="mb-4">Nema odabranog predloška</p>
            <button 
              onClick={handleBackToGallery}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Natrag na galeriju
            </button>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;