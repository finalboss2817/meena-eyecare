
import React, { useState, useEffect } from 'react';
import { educationService } from '../../services/educationService';
import type { EducationContent } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Icon } from '../../components/Icon';

export const EducationHubPage: React.FC = () => {
  const [content, setContent] = useState<EducationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const data = await educationService.getContent();
      setContent(data);
      setIsLoading(false);
    };
    fetchContent();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
            <Icon name="tools" className="w-20 h-20 mx-auto text-primary mb-4"/>
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark">Lens Education Hub</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Understanding your lenses is the first step to better vision. Explore our guides to make an informed choice.
            </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : content.length > 0 ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {content.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:shadow-2xl transition-shadow duration-300 animate-fade-in">
                <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover" />
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-primary mb-3">{item.title}</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Content Coming Soon</h2>
            <p className="text-gray-500 mt-2">Our experts are preparing helpful articles. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
};
