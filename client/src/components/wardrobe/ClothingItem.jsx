import { useState } from 'react';
import axios from 'axios';
import { getAuthTokens } from '../../utils/auth';

const ClothingItem = ({ item, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const tokens = getAuthTokens();
      await axios.delete(`/wardrobe/clothing-items/${item.id}/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      });
      if (onDelete) {
        onDelete(item.id);
      }
    } catch (err) {
      console.error('Error deleting clothing item:', err);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Get the image URL from the original_image_url field
  const imageUrl = item.original_image_url || '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Delete item"
            >
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category_display || item.category}</p>
        {item.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.metadata.colors && item.metadata.colors.map((color, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                style={{ backgroundColor: color + '20', color: color }}
              >
                {color}
              </span>
            ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Delete Item</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete &quot;{item.name}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-end space-x-3 rounded-b-lg">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingItem; 