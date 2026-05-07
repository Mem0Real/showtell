'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BentoCard } from '@/components/bento_components/BentoCard';
import { ModelViewer } from '@/components/bento_components/ModelViewer';
import { ModelScene } from '@/components/bento_components/ModelScene';
import { playfair } from '@/lib/fonts';

import { useGLTF } from '@react-three/drei';

export interface BentoItem {
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
  cameraPosition?: [number, number, number];
  target?: [number, number, number];
  angle?: number;
}

const bentoItems: BentoItem[] = [
  {
    id: 'inter-luxury',
    title: 'Inter Luxury',
    location: 'Addis Ababa, Urael',
    description: 'A tropical paradise with private infinity pool',
    size: 'large',
    stats: {
      rooms: 125,
      area: '1500m²',
      rating: 3.8,
    },
    image: '/images/hotels/inter-luxury.webp',
    modelPath: '/3d/buildings/1_tScaled.glb',
    // cameraPosition: [14.81, 1.25, 10.5],
    // target: [-0.36, 3.41, 0.37],
    // angle: 1.65,

    // cameraPosition: [9.43, 1.11, 7.2],
    // target: [-0.38, 3.28, 0.31],
    // angle: 1.75,

    cameraPosition: [10.8, 0.75, 8.7],
    target: [-0.38, 3.28, 0.31],
    angle: 1.75,
  },
  {
    id: 'sheraton',
    title: 'Sheraton Addis',
    location: 'Addis Ababa, Ambassador',
    description: 'Modern city living at its finest',
    size: 'medium',
    stats: {
      rooms: 220,
      area: '1200m²',
      rating: 4.9,
    },
    image: '/images/hotels/sheraton.webp',
    modelPath: '/3d/buildings/1_tsGround.glb',

    cameraPosition: [9.67, 1.3, 7.6],
    target: [-0.29, 3.06, 0.12],
    angle: 1.71,
  },
  {
    id: 'hyatt-regency',
    title: 'Hyatt Regency',
    location: 'Addis Ababa, Legahar',
    description: 'Refreshing retreat with stunning views',
    size: 'tall',
    stats: {
      rooms: 60,
      area: '3000m²',
      rating: 4.5,
    },
    image: '/images/hotels/hyatt-regency.webp',
    modelPath: '/3d/buildings/3.glb',
  },
  {
    id: 'elilly-international',
    title: 'Elilly International',
    location: 'Addis Ababa, Urael',
    description: 'Indoor experience for the whole family',
    size: 'small',
    stats: {
      rooms: 190,
      area: '3200m²',
      rating: 4.1,
    },
    image: '/images/hotels/elilly-international.webp',
  },
  {
    id: 'golden-tulip',
    title: 'Golden Tulip',
    location: 'Addis Ababa, Wollo-Sefer',
    description: 'Luxury oasis with city views',
    size: 'wide',
    stats: {
      rooms: 150,
      area: '1500m²',
      rating: 4.5,
    },
    image: '/images/hotels/golden-tulip.webp',
  },
  {
    id: 'haile-grand',
    title: 'Haile Grand',
    location: 'Addis Ababa, Megenagna',
    description: 'Futuristic living with city views',
    size: 'small',
    stats: {
      rooms: 400,
      area: '1050m²',
      rating: 4.9,
    },
    image: '/images/hotels/haile-grand.webp',
    modelPath: '/3d/buildings/4.glb',
  },
  {
    id: 'debre-damo',
    title: 'Debre Damo',
    location: 'Addis Ababa, Urael',
    description: 'Place where you will be treated as a family',
    size: 'large',
    stats: {
      rooms: 100,
      area: '700m²',
      rating: 4.1,
    },
    image: '/images/hotels/debre-damo.webp',
  },
  {
    id: 'best-western-plus',
    title: 'Best Western Plus',
    location: 'Addis Ababa, Gerji',
    description: 'High rise hotel for the classy',
    size: 'large',
    stats: {
      rooms: 600,
      area: '1050m²',
      rating: 4.7,
    },
    image: '/images/hotels/best-western-plus.webp',
    modelPath: '/3d/buildings/5.glb',
  },
];

export const BentoGrid = () => {
  const [selectedItem, setSelectedItem] = useState<BentoItem | null>(null);

  useEffect(() => {
    bentoItems.forEach((item) => {
      if (item.modelPath) {
        useGLTF.preload(item.modelPath);
      }
    });
  }, []);

  return (
    <div className='w-screen md:w-[97vw] lg:w-full h-full mx-auto relative'>
      <section className='w-full min-h-screen bg-gray-50 py-20 px:1 md:px-2 lg:px-4'>
        <div className='max-w-[85vw] mx-auto'>
          {/* Header */}
          <motion.div
            className='mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-5xl md:text-6xl font-bold text-gray-900 mb-4 ${playfair.className}`}>
              Explore Our Properties
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl'>
              Discover our curated collection of unique stays. Click to view in immersive 3D scene.
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
          <ModelScene selectedItem={selectedItem} />
        </ModelViewer>
      )}
    </div>
  );
};
