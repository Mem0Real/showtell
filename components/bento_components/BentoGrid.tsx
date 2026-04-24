'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { BentoCard } from '@/components/bento_components/BentoCard';
import { ModelViewer } from '@/components/bento_components/ModelViewer';
import { ModelScene } from '@/components/bento_components/ModelScene';

interface BentoItem {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
  size: 'small' | 'medium' | 'large' | 'tall' | 'wide';
  modelPath?: string; // Path to 3D model
  stats?: {
    rooms: number;
    area: string;
    rating: number;
  };
}

const bentoItems: BentoItem[] = [
  {
    id: 'inter-luxury',
    title: 'Inter Luxury',
    location: 'Addis Ababa, Urael',
    description: 'A tropical paradise with private infinity pool',
    image: '/images/hotels/inter-luxury.jpg',
    size: 'large',
    modelPath: '/models/villa-serene.glb',
    stats: {
      rooms: 125,
      area: '1500m²',
      rating: 3.8,
    },
  },
  {
    id: 'sheraton',
    title: 'Sheraton Addis',
    location: 'Addis Ababa, Ambassador',
    description: 'Modern city living at its finest',
    image: '/images/hotels/sheraton.jpg',
    size: 'medium',
    stats: {
      rooms: 220,
      area: '1200m²',
      rating: 4.9,
    },
  },
  {
    id: 'hyatt-regency',
    title: 'Hyatt Regency',
    location: 'Addis Ababa, Legahar',
    description: 'Refreshing retreat with stunning views',
    image: '/images/hotels/hyatt-regency.jpg',
    size: 'tall',
    stats: {
      rooms: 60,
      area: '3000m²',
      rating: 4.5,
    },
  },
  {
    id: 'elilly-international',
    title: 'Elilly International',
    location: 'Addis Ababa, Urael',
    description: 'Indoor experience for the whole family',
    image: '/images/hotels/elilly-international.jpg',
    size: 'small',
    modelPath: '/models/beach-house.glb',
    stats: {
      rooms: 190,
      area: '3200m²',
      rating: 4.1,
    },
  },
  {
    id: 'golden-tulip',
    title: 'Golden Tulip',
    location: 'Addis Ababa, Wollo-Sefer',
    description: 'Luxury oasis with city views',
    image: '/images/hotels/golden-tulip.jpg',
    size: 'wide',
    stats: {
      rooms: 150,
      area: '1500m²',
      rating: 4.5,
    },
  },
  {
    id: 'haile-grand',
    title: 'Haile Grand',
    location: 'Addis Ababa, Megenagna',
    description: 'Futuristic living with city views',
    image: '/images/hotels/haile-grand.jpg',
    size: 'small',
    stats: {
      rooms: 400,
      area: '1050m²',
      rating: 4.9,
    },
  },
  {
    id: 'debre-damo',
    title: 'Debre Damo',
    location: 'Addis Ababa, Urael',
    description: 'Place where you will be treated as a family',
    image: '/images/hotels/debre-damo.jpg',
    size: 'large',
    stats: {
      rooms: 100,
      area: '700m²',
      rating: 4.1,
    },
  },
  {
    id: 'best-western-plus',
    title: 'Best Western Plus',
    location: 'Addis Ababa, Gerji',
    description: 'High rise hotel for the classy',
    image: '/images/hotels/best-western-plus.jpg',
    size: 'large',
    stats: {
      rooms: 600,
      area: '1050m²',
      rating: 4.7,
    },
  },
];

export const BentoGrid = () => {
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);

  return (
    <div className='w-full h-full'>
      <section className='w-full min-h-screen bg-gray-50 py-20 px-4 md:px-8'>
        <div className='max-w-[85vw] mx-auto'>
          {/* Header */}
          <motion.div
            className='mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className='text-5xl md:text-6xl font-bold text-gray-900 mb-4'>Explore More Properties</h2>
            <p className='text-gray-600 text-lg max-w-2xl'>
              Discover our curated collection of unique stays. Click to view in immersive 3D.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] grid-flow-dense'>
            {bentoItems.map((item, index) => (
              <BentoCard key={item.id} item={item} onOpenModel={setSelectedItem} />
            ))}
          </div>
        </div>
      </section>

      {/* 3D Model Modal */}
      {selectedItem && (
        <ModelViewer isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem.title}>
          <ModelScene modelPath={selectedItem.modelPath} />
        </ModelViewer>
      )}
    </div>
  );
};
