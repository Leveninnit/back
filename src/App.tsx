import React, { useState, useRef } from 'react';
import {
  Upload, Copy, Check, Image as ImageIcon, X,
  FileText, Bot, Code2, FileDown, ArrowLeft
} from 'lucide-react';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  uploadTime: string;
}

type Tool =
  | 'hub'
  | 'imageToUrl'
  | 'fileConverter'
  | 'textSummariser'
  | 'codeFormatter'
  | 'aiAssistant';

function App() {
  const [currentTool, setCurrentTool] = useState<Tool>('hub');

  // Image Upload System (Only active in imageToUrl)
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

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch('https://kaanleven.onrender.com/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        const newImage: UploadedImage = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: data.imageUrl,
          uploadTime: new Date().toLocaleString()
        };

        setUploadedImages(prev => [newImage, ...prev]);
      } catch (err) {
        setStatusMessage('Upload failed. Please try again.');
        console.error(err);
      }
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

  const tools = [
    {
      name: 'Image to URL',
      id: 'imageToUrl',
      description: 'Upload an image and get a shareable link.',
      icon: <ImageIcon className="w-6 h-6 text-black" />,
      active: true,
    },
    {
      name: 'File Converter',
      id: 'fileConverter',
      description: 'Convert files like PDF, JPG, DOCX.',
      icon: <FileDown className="w-6 h-6 text-black" />,
      active: false,
    },
    {
      name: 'Text Summariser',
      id: 'textSummariser',
      description: 'Summarise large text or documents.',
      icon: <FileText className="w-6 h-6 text-black" />,
      active: false,
    },
    {
      name: 'Code Formatter',
      id: 'codeFormatter',
      description: 'Clean and format your code.',
      icon: <Code2 className="w-6 h-6 text-black" />,
      active: false,
    },
    {
      name: 'AI Assistant',
      id: 'aiAssistant',
      description: 'Ask anything. Get instant answers.',
      icon: <Bot className="w-6 h-6 text-black" />,
      active: false,
    },
  ];

  if (currentTool === 'hub') {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-10">
        <h1 className="text-4xl font-bold mb-8">🧠 Kaan AI Toolbox</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              onClick={() => tool.active && setCurrentTool(tool.id as Tool)}
              className={`cursor-pointer transition-all duration-300 p-6 rounded-2xl border ${
                tool.active
                  ? 'border-yellow-400 hover:bg-yellow-500/10'
                  : 'border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-yellow-400 p-3 rounded-full">
                  {tool.icon}
                </div>
                <h2 className="text-xl font-semibold">{tool.name}</h2>
              </div>
              <p className="text-gray-400 text-sm">{tool.description}</p>
              {!tool.active && (
                <p className="text-red-400 text-xs mt-2">Coming Soon</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // TOOL: Image to URL
  if (currentTool === 'imageToUrl') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <header className="text-center py-12">
          <h1 className="text-5xl font-serif text-white mb-2 tracking-tight">Kaan Images</h1>
          <p className="text-gray-400 text-lg font-light">Premium Image Hosting</p>
          <button
            onClick={() => setCurrentTool('hub')}
            className="mt-6 inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
          </button>
        </header>

        <main className="max-w-4xl mx-auto px-6 pb-20">
          {/* Upload UI (same as your current one) */}
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
                      : 'Drag & drop your images or click to browse'}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">Supports: JPG, PNG, GIF, WebP</p>
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

        <footer className="text-center py-8 border-t border-gray-800">
          <p className="text-gray-500 text-sm">© 2025 Kaan Images. Premium hosting for your memories.</p>
        </footer>
      </div>
    );
  }

  // Placeholder for future tools
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">This tool is not available yet.</h1>
      <button
        onClick={() => setCurrentTool('hub')}
        className="bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-400 text-black"
      >
        ← Back to Tools
      </button>
    </div>
  );
}

export default App;
