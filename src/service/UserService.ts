import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export default class UserService {
  private UserRepository = AppDataSource.getRepository(User);
}
