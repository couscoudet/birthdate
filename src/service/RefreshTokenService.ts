import { dataBaseSource } from "../data-source";
import RefreshToken from "../entity/RefreshToken";

export default class RefreshTokenService {
  private refreshTokenRepository = dataBaseSource
    .getDataSource()
    .getRepository(RefreshToken);

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

  async getRefreshTokenFromUser(id: number): Promise<string> {
    try {
      const refreshToken = await this.refreshTokenRepository.findOne({
        relations: ["user"],
        // loadRelationIds: true,
        where: { user: { id: id } },
        select: { id: true, refreshToken: true, user: { id: false } },
      });
      return refreshToken.refreshToken;
    } catch (e) {
      throw e;
    }
  }
}
