import { dataBaseSource } from "../data-source";
import User from "../entity/User";

export default class UserService {
  private UserRepository = dataBaseSource.getDataSource().getRepository(User);

  async store({ email, password }) {
    try {
      console.log(email, password);
      return await this.UserRepository.save(
        this.UserRepository.create({ email, password })
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async getUser(email: string): Promise<User> {
    try {
      return await this.UserRepository.findOneBy({ email: email });
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateUser(id: number, user: User) {
    try {
      return await this.UserRepository.update(id, user);
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteUser(id) {
    try {
      return await this.UserRepository.delete(id);
    } catch (e) {
      throw new Error(e);
    }
  }
}
