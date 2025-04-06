import { useState } from 'react';
import api from '../../utils/axios';
import { getAuthTokens } from '../../utils/auth';

const ClothingProcessor = ({ imageFile, onProcessingComplete, onProcessingError }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const processImage = async () => {
    if (!imageFile) {
      onProcessingError('No image provided for processing');
      return;
    }

    try {
      setProcessing(true);
      setProgress(0);
      setStatus('Initializing processing...');

      // Create form data with the image
      const formData = new FormData();
      formData.append('image', imageFile);

      // Get authentication token
      const tokens = getAuthTokens();

      // Send the image to the backend for processing
      setStatus('Sending image to processing service...');
      setProgress(10);

      const response = await api.post('/clothing-processor/process/', formData, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(10 + (percentCompleted * 0.3)); // 10-40% for upload
          setStatus('Uploading image...');
        },
      });

      // Processing complete
      setProgress(100);
      setStatus('Processing complete!');
      
      // Call the callback with the processing results
      onProcessingComplete(response.data);

    } catch (err) {
      console.error('Error processing image:', err);
      setStatus('Error processing image');
      onProcessingError('Failed to process the image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={processImage}
        disabled={processing || !imageFile}
        className={`btn-primary w-full flex items-center justify-center ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        {processing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Process with AI
          </>
        )}
      </button>

      {processing && (
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{status}</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingProcessor; 