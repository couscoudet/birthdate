import BirthDay from "../entity/BirthDay";
import { dataBaseSource } from "../data-source";

export class BirthDayService {
  private BirthDayRepository = dataBaseSource
    .getDataSource()
    .getRepository(BirthDay);

  async store({ name, day, month }, userId): Promise<BirthDay> {
    try {
      return await this.BirthDayRepository.save(
        this.BirthDayRepository.create({
          name,
          day,
          month,
          user: { id: userId },
        })
      );
    } catch (e) {
      throw new Error(e.message ? e.message : e);
    }
  }

  async getById(id: number): Promise<BirthDay> {
    try {
      return await this.BirthDayRepository.findOne({
        where: { id: id },
      });
    } catch (e) {
      throw new Error(e.message ? e.message : e);
    }
  }

  async getByMonth(month: number, userId: number): Promise<BirthDay[]> {
    try {
      return await this.BirthDayRepository.find({
        where: { month: month, user: { id: userId } },
      });
    } catch (e) {
      throw new Error(e.message ? e.message : e);
    }
  }

  async searchByNameQuery(query: string): Promise<BirthDay[]> {
    try {
      return await this.BirthDayRepository.createQueryBuilder()
        .where("name like :name", { name: `%${query}%` })
        .getMany();
    } catch (e) {
      throw new Error(e.message ? e.message : e);
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      await this.BirthDayRepository.delete(id);
      return { message: "birthday deleted" };
    } catch (e) {
      throw new Error(e.message ? e.message : e);
    }
  }
}
