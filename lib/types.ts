
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

  scale?: number;
  ground?: boolean;
  category?: string;
}

export interface ModelViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}