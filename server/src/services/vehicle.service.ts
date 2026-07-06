import { AppDataSource } from "@/database/data-source";
import { Vehicle } from "@/entities/Vehicle";
import { deleteMultipleFromCloudinary } from "@/utils/cloudinary";
import { FindOptionsWhere, ILike } from "typeorm";

const vehicleRepository = () => AppDataSource.getRepository(Vehicle);

export const vehicleService = {
  async findAll(): Promise<Vehicle[]> {
    return vehicleRepository().find({ order: { createdAt: "DESC" } });
  },

  async findById(id: string): Promise<Vehicle | null> {
    return vehicleRepository().findOneBy({ id });
  },

  async create(data: Partial<Vehicle>): Promise<Vehicle> {
    const vehicle = vehicleRepository().create(data);
    return vehicleRepository().save(vehicle);
  },

  async update(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
    await vehicleRepository().update(id, data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const vehicle = await this.findById(id);
    if (!vehicle) return false;
    if (vehicle.images?.length) {
      await deleteMultipleFromCloudinary(vehicle.images);
    }
    const result = await vehicleRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },

  async search(query: string): Promise<Vehicle[]> {
    const where: FindOptionsWhere<Vehicle>[] = [
      { brand: ILike(`%${query}%`) },
      { model: ILike(`%${query}%`) },
      { year: ILike(`%${query}%`) },
    ];
    return vehicleRepository().find({ where, order: { createdAt: "DESC" } });
  },
};
