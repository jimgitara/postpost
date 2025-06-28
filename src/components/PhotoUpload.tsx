import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Image, Camera, FileImage } from 'lucide-react';

interface PhotoUploadProps {
  onPhotoUploaded: (imageUrl: string) => void;
  onBack: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotoUploaded, onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Molimo odaberite sliku.');
      return;
    }

    setUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTimeout(() => {
        setUploading(false);
        onPhotoUploaded(result);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Natrag</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">Upload fotografije</h1>
          <div></div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upload fotografiju za prednju stranu razglednice
            </h2>
            <p className="text-lg text-gray-600">
              Odaberite prekrasnu fotografiju koja će biti na prednjoj strani vaše razglednice
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />

            {uploading ? (
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-white animate-bounce" />
                </div>
                <p className="text-lg font-semibold text-primary-600">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Kliknite za upload ili povucite sliku ovdje
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Podržani formati: JPG, PNG, GIF (max 10MB)
                </p>

                <button
                  onClick={onButtonClick}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  Odaberi fotografiju
                </button>
              </>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Camera className="h-8 w-8 text-primary-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Visoka kvaliteta</h4>
              <p className="text-sm text-gray-600">Koristite slike visoke rezolucije za najbolji rezultat</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <FileImage className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Pravilan format</h4>
              <p className="text-sm text-gray-600">Landscape format (16:9 ili 4:3) najbolje funkcionira</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Upload className="h-8 w-8 text-accent-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Brz upload</h4>
              <p className="text-sm text-gray-600">Vaša slika će biti obrađena u nekoliko sekundi</p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Kako će izgledati vaša razglednica
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Front Side */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Prednja strana</h4>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-[3/2] flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Vaša fotografija će biti ovdje</p>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Stražnja strana</h4>
              <div className="bg-white rounded-2xl aspect-[3/2] border-2 border-gray-200 p-6 flex flex-col">
                <div className="flex-1 border-b border-gray-200 pb-4 mb-4">
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-2">PORUKA:</div>
                    <div className="h-20 bg-gray-50 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Vaša osobna poruka</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <div className="text-xs text-gray-500 mb-1">PRIMA:</div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">ŠALJE:</div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;