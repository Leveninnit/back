import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, Image as ImageIcon, X } from 'lucide-react';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  uploadTime: string;
}

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setStatusMessage('Please select valid image files');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setIsUploading(true);
    setStatusMessage('Uploading your images...');

    // Simulate upload process
    for (const file of imageFiles) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const imageUrl = URL.createObjectURL(file);
      const newImage: UploadedImage = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: `https://kaan-images.com/i/${Math.random().toString(36).substr(2, 8)}`,
        uploadTime: new Date().toLocaleString()
      };

      setUploadedImages(prev => [newImage, ...prev]);
    }

    setIsUploading(false);
    setStatusMessage(`Successfully uploaded ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <header className="text-center py-12">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-2 tracking-tight">
          Kaan Images
        </h1>
        <p className="text-gray-400 text-lg font-light">Premium Image Hosting</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* Upload Section */}
        <div className="mb-12">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? 'border-yellow-400 bg-yellow-400/5 scale-105'
                : 'border-gray-600 hover:border-yellow-500 hover:bg-gray-800/30'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-6">
              <div className="relative">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center transition-transform duration-300 ${
                  isDragging ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {isUploading ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-black" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-2">
                  {isUploading ? 'Uploading...' : isDragging ? 'Drop your images here' : 'Upload Images'}
                </h3>
                <p className="text-gray-400 text-lg">
                  {isUploading
                    ? 'Processing your files...'
                    : 'Drag & drop your images or click to browse'
                  }
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Supports: JPG, PNG, GIF, WebP
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gray-800 border border-gray-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse" />
                {statusMessage}
              </div>
            </div>
          )}
        </div>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-8">Your Images</h2>
            
            <div className="space-y-4">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{image.name}</h3>
                        <p className="text-sm text-gray-400">{image.uploadTime}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeImage(image.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-black/30 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <p className="text-sm text-gray-400 mb-1">Shareable Link</p>
                        <p className="font-mono text-yellow-400 break-all">{image.url}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(image.url, image.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          copiedId === image.id
                            ? 'bg-green-600 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-500 text-black hover:scale-105'
                        }`}
                      >
                        {copiedId === image.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-800">
        <p className="text-gray-500 text-sm">© 2025 Kaan Images. Premium hosting for your memories.</p>
      </footer>
    </div>
  );
}

export default App;