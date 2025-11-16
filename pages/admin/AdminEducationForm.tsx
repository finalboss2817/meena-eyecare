
import React, { useState, useEffect } from 'react';
import { educationService } from '../../services/educationService';
import type { EducationContent } from '../../types';
import { Icon } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface AdminEducationFormProps {
  contentId?: string;
  onNavigate: (path: string) => void;
}

const INITIAL_STATE: Omit<EducationContent, 'id'> = {
  title: '',
  content: '',
  image_url: 'https://picsum.photos/seed/placeholder-edu/600/400',
  display_order: 0
};

export const AdminEducationForm: React.FC<AdminEducationFormProps> = ({ contentId, onNavigate }) => {
  const [article, setArticle] = useState<Partial<EducationContent>>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!contentId;

  useEffect(() => {
    if (isEditing) {
      const loadArticle = async () => {
        setIsLoading(true);
        const data = await educationService.getContentById(contentId);
        if (data) {
          setArticle(data);
        } else {
          console.error("Article not found");
          onNavigate('admin/education');
        }
        setIsLoading(false);
      };
      loadArticle();
    } else {
      setArticle(INITIAL_STATE);
    }
  }, [contentId, isEditing, onNavigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'display_order' ? parseInt(value, 10) || 0 : value;
    setArticle(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && contentId) {
      await educationService.updateContent(contentId, article);
    } else {
      await educationService.addContent(article as Omit<EducationContent, 'id'>);
    }
    onNavigate('admin/education');
  };
  
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => onNavigate('admin/education')} className="flex items-center text-primary mb-6 hover:underline">
        <Icon name="chevron-left" className="w-5 h-5 mr-1" />
        Back to Education Hub List
      </button>
      <h1 className="text-3xl font-bold mb-8">{isEditing ? 'Edit Article' : 'Add New Article'}</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={article.title} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea name="content" value={article.content} onChange={handleChange} rows={6} className="mt-1 block w-full input-style" required></textarea>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input type="text" name="image_url" value={article.image_url} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input type="number" name="display_order" value={article.display_order} onChange={handleChange} className="mt-1 block w-full input-style" required />
          </div>
        </div>
        <div className="mt-8 text-right">
          <button type="submit" className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-accent/90 transition-colors">
            {isEditing ? 'Update Article' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
};
