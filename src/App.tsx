import React, { useState } from 'react';
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
    setSelectedTemplate(template);
    setShowEditor(true);
    setShowUpload(false);
  };

  const handleStartCreating = () => {
    setShowUpload(true);
    setShowEditor(false);
  };

  const handlePhotoUploaded = (imageUrl: string) => {
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

  return (
    <div className="min-h-screen bg-cyber-gradient">
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
      ) : (
        <PostcardEditor 
          template={selectedTemplate!} 
          onBack={handleBackToGallery}
        />
      )}
      
      <Footer />
    </div>
  );
}

export default App;