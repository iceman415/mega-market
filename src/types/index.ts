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
}