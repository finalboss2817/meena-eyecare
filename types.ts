
export interface Category {
  id: string;
  name: string;
}

export type FrameType = 'thick-rim' | 'half-rim' | 'rimless' | 'standard';
export type LensType = 'blue-cut' | 'progressive' | 'bifocal';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  category_id: string;
  offer?: string;
  frame_type: FrameType;
  lens_type?: LensType;
}

export interface PrescriptionData {
  fileName: string;
  data: string; // Base64 string
}

export interface CartItem {
  productId: string;
  quantity: number;
  prescription?: PrescriptionData;
}

export interface WishlistItem {
  productId: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'user' | 'admin';
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface EducationContent {
  id: string;
  title: string;
  content: string;
  image_url: string;
  display_order: number;
}

export interface TryOnState {
  userImage: string | null;
  frameX: number;
  frameY: number;
  frameScale: number;
  frameRotation: number;
}