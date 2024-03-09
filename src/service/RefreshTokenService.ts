import { AppDataSource } from "../data-source";
import RefreshToken from "../entity/RefreshToken";

export default class RefreshTokenService {
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async storeOrUpdate(refreshToken: RefreshToken): Promise<void> {
    try {
      await this.refreshTokenRepository.save(refreshToken);
    } catch (e) {
      if (e.message.includes("Duplicate")) {
        try {
          await this.refreshTokenRepository.update(
            { user: refreshToken.user },
            { refreshToken: refreshToken.refreshToken }
          );
        } catch (e) {
          throw new Error(e);
        }
      } else {
        throw new Error(e);
      }
    }
  }
}
