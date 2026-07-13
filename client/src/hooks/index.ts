import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  vehicleService,
  partService,
  clothingService,
  searchService,
  authService,
} from "@/services";
import { Vehicle, Part, Clothing } from "@/types";

const VEHICLES_KEY = ["vehicles"] as const;
const PARTS_KEY = ["parts"] as const;
const CLOTHING_KEY = ["clothing"] as const;

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_KEY,
    queryFn: vehicleService.getAll,
    staleTime: 60_000,
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
}

export function useParts() {
  return useQuery({
    queryKey: PARTS_KEY,
    queryFn: partService.getAll,
    staleTime: 60_000,
  });
}

export function usePart(id: string) {
  return useQuery({
    queryKey: ["part", id],
    queryFn: () => partService.getById(id),
    enabled: !!id,
  });
}

export function useGlobalSearch() {
  const queryClient = useQueryClient();

  const search = (q: string) =>
    queryClient.fetchQuery({
      queryKey: ["search", q],
      queryFn: () => searchService.globalSearch(q),
      staleTime: 300_000,
    });

  const getCached = (q: string) =>
    queryClient.getQueryData(["search", q]);

  return { search, getCached };
}

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => vehicleService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      vehicleService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: VEHICLES_KEY }),
  });
}

export function useCreatePart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Part>) => partService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PARTS_KEY }),
  });
}

export function useUpdatePart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Part> }) =>
      partService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PARTS_KEY }),
  });
}

export function useDeletePart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PARTS_KEY }),
  });
}

export function useClothing() {
  return useQuery({
    queryKey: CLOTHING_KEY,
    queryFn: clothingService.getAll,
    staleTime: 60_000,
  });
}

export function useClothingItem(id: string) {
  return useQuery({
    queryKey: ["clothing", id],
    queryFn: () => clothingService.getById(id),
    enabled: !!id,
  });
}

export function useCreateClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Clothing>) => clothingService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLOTHING_KEY }),
  });
}

export function useUpdateClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Clothing> }) =>
      clothingService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLOTHING_KEY }),
  });
}

export function useDeleteClothing() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clothingService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CLOTHING_KEY }),
  });
}

export function useAuth() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(currentPassword, newPassword),
  });
}
