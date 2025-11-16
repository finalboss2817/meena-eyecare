
import React, { useState, useEffect } from 'react';
import { educationService } from '../../services/educationService';
import type { EducationContent } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface AdminEducationHubPageProps {
  onNavigate: (path: string) => void;
}

export const AdminEducationHubPage: React.FC<AdminEducationHubPageProps> = ({ onNavigate }) => {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    setIsLoading(true);
    const data = await educationService.getContent();
    setContent(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleDelete = async (contentId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the article "${title}"?`)) {
      await educationService.deleteContent(contentId);
      loadContent();
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Education Hub</h1>
        <button
          onClick={() => onNavigate('admin/education/new')}
          className="flex items-center space-x-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="plus" className="h-5 w-5" />
          <span>Add Article</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.length > 0 ? content.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={item.image_url} alt={item.title} className="w-16 h-10 object-cover rounded-md bg-gray-100" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.display_order}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button onClick={() => onNavigate(`admin/education/edit/${item.id}`)} className="text-primary hover:text-indigo-900"><Icon name="edit" /></button>
                      <button onClick={() => handleDelete(item.id, item.title)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">No educational articles found. Add one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
