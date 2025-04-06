import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { getAuthTokens } from '../../utils/auth';
import ClothingItem from './ClothingItem';
import ClothingProcessor from './ClothingProcessor';

const Wardrobe = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [generatedOutfit, setGeneratedOutfit] = useState(null);
  const [generatingOutfit, setGeneratingOutfit] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [processingError, setProcessingError] = useState(null);
  const [processedMetadata, setProcessedMetadata] = useState(null);

  const eventTypes = [
    { id: 'formal', name: 'Formal', icon: '👔' },
    { id: 'casual', name: 'Casual', icon: '👕' },
    { id: 'sport', name: 'Sport', icon: '⚽' }
  ];

  useEffect(() => {
    fetchClothes();
  }, []);

  const fetchClothes = async () => {
    try {
      setLoading(true);
      const tokens = getAuthTokens();
      console.log('Fetching clothes with token:', tokens.access);
      
      const response = await api.get('/wardrobe/clothing-items/', {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
        },
      });
      
      console.log('Clothes response:', response.data);
      setClothes(response.data);
    } catch (error) {
      console.error('Error fetching clothes:', error);
      setError('Failed to load wardrobe items');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = (eventType) => {
    setSelectedEvent(eventType);
    setGeneratedOutfit(null);
  };

  const generateOutfit = async () => {
    if (!selectedEvent) return;

    try {
      setGeneratingOutfit(true);
      setError(null);
      
      const tokens = getAuthTokens();
      const response = await api.post('/api/outfits/generate/', {
        event_type: selectedEvent.id
      }, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      
      setGeneratedOutfit(response.data);
    } catch (err) {
      setError('Failed to generate outfit. Please try again later.');
      console.error('Error generating outfit:', err);
    } finally {
      setGeneratingOutfit(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Reset any previous processing results
      setProcessedMetadata(null);
      setProcessingError(null);
    }
  };

  const handleProcessingComplete = (result) => {
    console.log('Processing complete:', result);
    setProcessedMetadata(result);
    setProcessingError(null);
  };

  const handleProcessingError = (error) => {
    console.error('Processing error:', error);
    setProcessingError(error);
    setProcessedMetadata(null);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!image) {
      setUploadError('Please upload an image');
      return;
    }

    try {
      setUploadLoading(true);
      setUploadError(null);
      
      const tokens = getAuthTokens();
      
      // First, process the image with the clothing processor
      const formData = new FormData();
      formData.append('image', image);
      
      const processResponse = await api.post('/clothing-processor/process/', formData, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Processing response:', processResponse.data);
      
      // Check if the model successfully classified the clothing
      if (!processResponse.data.category || processResponse.data.category === 'unknown') {
        throw new Error('Could not identify the clothing item. Please try a clearer image.');
      }
      
      // Map the category to match the model's choices
      const categoryMap = {
        'upper clothing': 'upper',
        'lower clothing': 'lower',
        'dress': 'dress',
        'outerwear': 'outerwear',
        'shoes': 'shoes',
        'accessories': 'accessories'
      };
      
      const mappedCategory = categoryMap[processResponse.data.category.toLowerCase()] || 'upper';
      console.log('Mapped category:', mappedCategory);
      
      // Now create the clothing item with the processed data
      const clothingFormData = new FormData();
      clothingFormData.append('original_image', image);
      clothingFormData.append('name', processResponse.data.metadata.description || 'New Clothing Item');
      clothingFormData.append('category', mappedCategory);
      
      // Ensure metadata has the required fields
      const metadata = {
        colors: processResponse.data.metadata.colors || ['#000000'],
        description: processResponse.data.metadata.description || 'A clothing item'
      };
      
      clothingFormData.append('metadata', JSON.stringify(metadata));
      
      // If there's a segmented image, add it to the form data
      if (processResponse.data.segmented_image_url) {
        // Extract the filename from the path
        const segmentedImagePath = processResponse.data.segmented_image_url;
        const segmentedImageName = segmentedImagePath.split('\\').pop();
        
        // Create a file object from the segmented image
        const segmentedImageResponse = await fetch(`/media/processed_clothes/${segmentedImageName}`);
        const segmentedImageBlob = await segmentedImageResponse.blob();
        const segmentedImageFile = new File([segmentedImageBlob], segmentedImageName, { type: 'image/jpeg' });
        
        clothingFormData.append('segmented_image', segmentedImageFile);
      }
      
      console.log('Sending clothing data:', {
        name: clothingFormData.get('name'),
        category: clothingFormData.get('category'),
        metadata: clothingFormData.get('metadata')
      });
      
      const createResponse = await api.post('/wardrobe/clothing-items/', clothingFormData, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Create response:', createResponse.data);
      
      fetchClothes();
      setShowUploadModal(false);
      setImage(null);
      setImagePreview(null);
      setProcessedMetadata(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to process clothing item. Please try again.';
      setUploadError(errorMessage);
      console.error('Error processing clothing item:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const tokens = getAuthTokens();
      await api.delete(`/wardrobe/clothing-items/${itemId}/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      setClothes(prevClothes => prevClothes.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Failed to delete item. Please try again later.');
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wardrobe</h1>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Item
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Generate Outfit</h2>
        <div className="flex flex-wrap gap-4">
          {eventTypes.map(event => (
            <button
              key={event.id}
              onClick={() => handleEventSelect(event)}
              className={`flex items-center px-4 py-2 rounded-lg border ${
                selectedEvent?.id === event.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-2 text-xl">{event.icon}</span>
              {event.name}
            </button>
          ))}
        </div>
        
        {selectedEvent && (
          <div className="mt-4">
            <button
              onClick={generateOutfit}
              disabled={generatingOutfit}
              className={`btn-primary ${generatingOutfit ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {generatingOutfit ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Outfit'
              )}
            </button>
          </div>
        )}
      </div>

      {generatedOutfit && (
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Generated Outfit</h2>
            <button
              onClick={() => setGeneratedOutfit(null)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedOutfit.items.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <img
                  src={item.original_image_url}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.category_display || item.category}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setGeneratedOutfit(null)}
              className="btn-secondary"
            >
              Dismiss
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                // TODO: Implement save outfit functionality
                alert('Outfit saved!');
              }}
            >
              Save Outfit
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">My Clothes</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : clothes.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No clothes yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding some clothes to your wardrobe.</p>
            <div className="mt-6">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add New Item
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {clothes.map((item) => (
              <ClothingItem 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Add New Clothing Item
              </h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setShowUploadModal(false)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-4">
              {uploadError && (
                <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded">
                  {uploadError}
                </div>
              )}
              
              {processingError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  AI Processing Error: {processingError}
                </div>
              )}
              
              <div className="mb-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${imagePreview ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary'}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      const file = e.dataTransfer.files[0];
                      if (file.type.startsWith('image/')) {
                        setImage(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result);
                        };
                        reader.readAsDataURL(file);
                        // Reset any previous processing results
                        setProcessedMetadata(null);
                        setProcessingError(null);
                      } else {
                        setUploadError('Please upload an image file');
                      }
                    }
                  }}
                >
                  {imagePreview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                            setProcessedMetadata(null);
                            setProcessingError(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Drag and drop another image or click to select
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Drag and drop your image here
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        or click to browse files
                      </p>
                      <label className="btn-secondary cursor-pointer">
                        <span>Select Image</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageChange}
                          accept="image/*"
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Add the ClothingProcessor component */}
              {image && (
                <ClothingProcessor 
                  imageFile={image}
                  onProcessingComplete={handleProcessingComplete}
                  onProcessingError={handleProcessingError}
                />
              )}
              
              {/* Display processed metadata if available */}
              {processedMetadata && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    AI Analysis Results
                  </h3>
                  <div className="text-xs text-green-700 dark:text-green-400">
                    <p><strong>Category:</strong> {processedMetadata.category_display || processedMetadata.category}</p>
                    {processedMetadata.metadata?.colors && (
                      <div className="mt-1">
                        <strong>Colors:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {processedMetadata.metadata.colors.map((color, index) => (
                            <span 
                              key={index}
                              className="inline-block w-4 h-4 rounded-full"
                              style={{ backgroundColor: color }}
                              title={color}
                            ></span>
                          ))}
                        </div>
                      </div>
                    )}
                    {processedMetadata.metadata?.description && (
                      <p className="mt-1"><strong>Description:</strong> {processedMetadata.metadata.description}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                  disabled={uploadLoading || !image}
                >
                  {uploadLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                      </svg>
                      Upload Item
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wardrobe;