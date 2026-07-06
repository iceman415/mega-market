import { AppDataSource } from "@/database/data-source";
import { Part } from "@/entities/Part";
import { deleteMultipleFromCloudinary } from "@/utils/cloudinary";
import { FindOptionsWhere, ILike } from "typeorm";

const partRepository = () => AppDataSource.getRepository(Part);

export const partService = {
  async findAll(): Promise<Part[]> {
    return partRepository().find({ order: { createdAt: "DESC" } });
  },

  async findById(id: string): Promise<Part | null> {
    return partRepository().findOneBy({ id });
  },

  async create(data: Partial<Part>): Promise<Part> {
    const part = partRepository().create(data);
    return partRepository().save(part);
  },

  async update(id: string, data: Partial<Part>): Promise<Part | null> {
    await partRepository().update(id, data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const part = await this.findById(id);
    if (!part) return false;
    if (part.images?.length) {
      await deleteMultipleFromCloudinary(part.images);
    }
    const result = await partRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },

  async search(query: string): Promise<Part[]> {
    const where: FindOptionsWhere<Part>[] = [
      { name: ILike(`%${query}%`) },
      { partNumber: ILike(`%${query}%`) },
      { compatibility: ILike(`%${query}%`) },
    ];
    return partRepository().find({ where, order: { createdAt: "DESC" } });
  },
};
