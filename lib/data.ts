import { BentoItem } from "./types";

export const bentoItems: BentoItem[] = [
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
    modelPath: '/3d/buildings/fixed/1.glb',

    cameraPosition: [-108.54, 19.51, 126],
    target: [-13.61, 42.6, 5.25],
    angle: 1.72,
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
    modelPath: '/3d/buildings/fixed/3.glb',

    cameraPosition: [5.37, 0.44, 5.66],
    target: [0.29, 1.39, 0.18],
    angle: 1.7,

    scale: 0.005,
    ground: true,
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
    modelPath: '/3d/buildings/fixed/4.glb',

    cameraPosition: [-8.31, 0.84, 7.75],
    target: [-0.25, 2, -0.17],
    angle: 1.67,

    scale: 0.05,
    ground: true,
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
    modelPath: '/3d/buildings/fixed/2.glb',

    cameraPosition: [-4.78, 0.34, -2.98],
    target: [-0.17, 1.04, 0.01],
    angle: 1.69,

    scale: 0.005,
    ground: true,
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
  },
];