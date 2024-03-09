import { AppDataSource } from "../data-source";
import User from "../entity/User";

export default class UserService {
  private UserRepository = AppDataSource.getRepository(User);

  static async initiateUserCleanEvents() {
    try {
      await AppDataSource.manager.query(`SET GLOBAL event_scheduler=1;`);
      await AppDataSource.manager.query(`CREATE EVENT IF NOT EXISTS clearExpired
      ON SCHEDULE EVERY 1 HOUR
      DO
      BEGIN
      DELETE FROM user
      WHERE emailConfirmed = 0
      AND created_at < DATE_SUB(CURRENT_TIME(), INTERVAL 48 HOUR);
      END;`);
      console.log("user cleaning after 2d initiated");
    } catch (e) {
      console.log("can't initiate user cleaner after 2d" + e);
    }
  }

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
}
