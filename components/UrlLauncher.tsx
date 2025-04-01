"use client"
import { useState } from 'react';
import { pipe } from '@screenpipe/browser';

export default function UrlLauncher() {
  const [url, setUrl] = useState('');

  const handleLaunch = async () => {
    try {
      // Ensure the URL starts with "http://" or "https://"
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      // Open the URL in the default browser
      const success = await pipe.operator.openUrl(formattedUrl);
      
      if (!success) {
        throw new Error('Failed to open the URL');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to open URL: ${error}`);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">URL Launcher</h1>
      
      <div className="space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL (e.g., google.com)"
          className="w-full p-2 border rounded"
        />
        
        <button
          onClick={handleLaunch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Open URL
        </button>
      </div>
    </div>
  );
}