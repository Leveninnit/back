import React, { useState } from 'react';

type UploadedImage = {
  id: string;
  name: string;
  url: string;
  uploadTime: string;
};

function App() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
          uploadTime: new Date().toLocaleString(),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFile(files[0]);
      handleFiles(Array.from(files));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Kaan's Image Uploader</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {isUploading && <p className="text-yellow-400 mb-2">Uploading...</p>}
      {statusMessage && <p className="text-green-400 mb-4">{statusMessage}</p>}

      <div className="w-full max-w-2xl">
        {uploadedImages.map(img => (
          <div key={img.id} className="mb-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
            <img src={img.url} alt={img.name} className="w-full mb-2 rounded" />
            <p className="text-sm break-all">{img.url}</p>
            <p className="text-xs text-gray-400">Uploaded: {img.uploadTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
