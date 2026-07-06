export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  description: string;
  location: string;
  images: string[];
  sold: boolean;
  youtubeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Part {
  id: string;
  name: string;
  partNumber: string;
  compatibility: string;
  price: string;
  description: string;
  location: string;
  images: string[];
  sold: boolean;
  youtubeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  vehicles: Vehicle[];
  parts: Part[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
}

export interface VerifyResponse {
  valid: boolean;
  user: User;
}
