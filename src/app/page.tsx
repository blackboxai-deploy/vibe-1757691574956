'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const features = [
    {
      title: 'Text-to-Video AI',
      description: 'Transform your text prompts into stunning videos using state-of-the-art AI models.',
      badge: 'Core Feature'
    },
    {
      title: 'Multiple Formats',
      description: 'Generate videos in various aspect ratios: landscape, portrait, square, and cinematic.',
      badge: 'Flexible'
    },
    {
      title: 'Style Control',
      description: 'Choose from realistic, animated, cinematic, artistic, and documentary styles.',
      badge: 'Creative'
    },
    {
      title: 'Instant Preview',
      description: 'Real-time generation tracking with progress indicators and instant video preview.',
      badge: 'Fast'
    },
    {
      title: 'Video Gallery',
      description: 'Manage, organize, and download your generated videos with full history tracking.',
      badge: 'Organized'
    },
    {
      title: 'Custom Templates',
      description: 'Pre-built prompt templates for common video types and creative scenarios.',
      badge: 'Templates'
    }
  ];

  const stats = [
    { label: 'Videos Generated', value: '10,000+' },
    { label: 'Happy Creators', value: '2,500+' },
    { label: 'Success Rate', value: '98.5%' },
    { label: 'Avg. Generation Time', value: '45s' }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Create Stunning Videos
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                From Text Prompts
              </span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into professional-quality videos using advanced AI models. 
              No video editing experience required – just describe what you want to create.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-purple-900 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
              >
                <Link href="/generate">Start Creating Videos</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                View Gallery
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Video Creation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional videos with AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Create Your First AI Video?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join thousands of creators who are already using VideoAI to bring their ideas to life. 
            Start your video generation journey today.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold"
          >
            <Link href="/generate">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}