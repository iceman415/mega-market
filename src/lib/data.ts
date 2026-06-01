import { Vehicle, Part } from '@/types';
import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

export function getVehicles(): Vehicle[] {
  const filePath = path.join(dataDirectory, 'vehicles.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getParts(): Part[] {
  const filePath = path.join(dataDirectory, 'parts.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export function getVehicleById(id: string): Vehicle | undefined {
  const vehicles = getVehicles();
  return vehicles.find((v) => v.id === id);
}

export function getPartById(id: string): Part | undefined {
  const parts = getParts();
  return parts.find((p) => p.id === id);
}