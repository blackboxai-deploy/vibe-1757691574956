'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PromptTemplate } from '@/lib/types';

interface PromptTemplatesProps {
  onSelectTemplate: (prompt: string) => void;
}

const TEMPLATE_CATEGORIES = [
  'All',
  'Nature',
  'Urban',
  'People',
  'Abstract',
  'Animals',
  'Technology'
] as const;

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'nature-1',
    name: 'Serene Forest',
    prompt: 'A peaceful morning in a misty forest with sunlight streaming through tall trees, gentle breeze moving the leaves, and small particles floating in the air',
    category: 'Nature',
    tags: ['peaceful', 'forest', 'morning', 'sunlight']
  },
  {
    id: 'nature-2',
    name: 'Ocean Waves',
    prompt: 'Crystal clear ocean waves gently crashing on a pristine sandy beach at golden hour, with seagulls flying overhead and soft clouds in the sky',
    category: 'Nature',
    tags: ['ocean', 'waves', 'beach', 'golden hour']
  },
  {
    id: 'urban-1',
    name: 'City Rain',
    prompt: 'Rain drops falling on a busy city street at night, neon lights reflecting on wet pavement, people with umbrellas walking by',
    category: 'Urban',
    tags: ['rain', 'city', 'night', 'neon lights']
  },
  {
    id: 'urban-2',
    name: 'Skyscraper View',
    prompt: 'Aerial view of a modern city skyline with glass skyscrapers reflecting the sunset, traffic flowing on highways below, and clouds drifting overhead',
    category: 'Urban',
    tags: ['skyline', 'skyscrapers', 'sunset', 'aerial']
  },
  {
    id: 'people-1',
    name: 'Coffee Shop',
    prompt: 'A cozy coffee shop scene with people enjoying their drinks, steam rising from hot coffee cups, warm lighting, and a relaxed atmosphere',
    category: 'People',
    tags: ['coffee', 'cozy', 'people', 'warm lighting']
  },
  {
    id: 'people-2',
    name: 'Street Musician',
    prompt: 'A talented street musician playing guitar on a cobblestone street, passersby dropping coins, autumn leaves falling gently around',
    category: 'People',
    tags: ['music', 'street', 'guitar', 'autumn']
  },
  {
    id: 'abstract-1',
    name: 'Color Flow',
    prompt: 'Abstract flowing colors mixing and blending like liquid paint, smooth gradients transforming from purple to blue to pink, hypnotic movement',
    category: 'Abstract',
    tags: ['colors', 'flowing', 'liquid', 'gradients']
  },
  {
    id: 'abstract-2',
    name: 'Particle Dance',
    prompt: 'Thousands of glowing particles dancing in space, forming and dissolving geometric patterns, pulsing with rhythmic energy against a dark background',
    category: 'Abstract',
    tags: ['particles', 'glowing', 'geometric', 'energy']
  },
  {
    id: 'animals-1',
    name: 'Butterfly Garden',
    prompt: 'Colorful butterflies flying through a vibrant flower garden, delicate wings catching sunlight, petals gently swaying in a soft breeze',
    category: 'Animals',
    tags: ['butterflies', 'flowers', 'garden', 'colorful']
  },
  {
    id: 'animals-2',
    name: 'Mountain Eagle',
    prompt: 'A majestic eagle soaring over snow-capped mountains, wings spread wide against a clear blue sky, demonstrating grace and power',
    category: 'Animals',
    tags: ['eagle', 'mountains', 'flying', 'majestic']
  },
  {
    id: 'tech-1',
    name: 'Digital Network',
    prompt: 'Futuristic digital network with glowing nodes and connections, data flowing as light streams, holographic interfaces floating in space',
    category: 'Technology',
    tags: ['digital', 'network', 'futuristic', 'holographic']
  },
  {
    id: 'tech-2',
    name: 'Robot Workshop',
    prompt: 'Advanced robots working in a high-tech workshop, mechanical arms assembling components with precision, blue LED lights illuminating the scene',
    category: 'Technology',
    tags: ['robots', 'workshop', 'mechanical', 'LED lights']
  }
];

export function PromptTemplates({ onSelectTemplate }: PromptTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? PROMPT_TEMPLATES 
    : PROMPT_TEMPLATES.filter(template => template.category === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'All') return PROMPT_TEMPLATES.length;
    return PROMPT_TEMPLATES.filter(t => t.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {TEMPLATE_CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="h-8 px-3 text-xs"
          >
            {category} ({getCategoryCount(category)})
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => onSelectTemplate(template.prompt)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm line-clamp-3 mb-3">
                {template.prompt}
              </CardDescription>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              <Button 
                size="sm" 
                className="w-full h-8 text-xs bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.prompt);
                }}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found in this category.</p>
        </div>
      )}
    </div>
  );
}