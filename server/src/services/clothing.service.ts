import { AppDataSource } from "@/database/data-source";
import { Clothing } from "@/entities/Clothing";
import { deleteMultipleFromCloudinary } from "@/utils/cloudinary";
import { FindOptionsWhere, ILike } from "typeorm";

const clothingRepository = () => AppDataSource.getRepository(Clothing);

export const clothingService = {
  async findAll(): Promise<Clothing[]> {
    return clothingRepository().find({ order: { createdAt: "DESC" } });
  },

  async findById(id: string): Promise<Clothing | null> {
    return clothingRepository().findOneBy({ id });
  },

  async create(data: Partial<Clothing>): Promise<Clothing> {
    const clothing = clothingRepository().create(data);
    return clothingRepository().save(clothing);
  },

  async update(id: string, data: Partial<Clothing>): Promise<Clothing | null> {
    await clothingRepository().update(id, data);
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const clothing = await this.findById(id);
    if (!clothing) return false;
    if (clothing.images?.length) {
      await deleteMultipleFromCloudinary(clothing.images);
    }
    const result = await clothingRepository().delete(id);
    return (result.affected ?? 0) > 0;
  },

  async search(query: string): Promise<Clothing[]> {
    const where: FindOptionsWhere<Clothing>[] = [
      { name: ILike(`%${query}%`) },
    ];
    return clothingRepository().find({ where, order: { createdAt: "DESC" } });
  },
};
