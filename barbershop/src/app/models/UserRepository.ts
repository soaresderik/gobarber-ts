import { EntityRepository, Repository, getRepository } from "typeorm";
import User from "../../entity/User";
import UserDTO from "../controllers/dto/user.dto";
import NotFoundException from "../exceptions/NotFoundException";

@EntityRepository(User)
export class UserRepository {
  private _db: Repository<User>;

  constructor() {
    this._db = getRepository(User);
  }
  async createUser({ name, email, password, provider }: UserDTO) {
    const user = await User.create({ name, email, password, provider }).save();

    return user;
  }

  async findOneUser(userId: number) {
    const user = await this._db
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.avatar", "avatar")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "avatar.name",
        "avatar.path"
      ])
      .where("user.id = :id", { id: userId })
      .getOne();

    return user;
  }

  async findProviders() {
    return this._db
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.avatar", "avatar")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "avatar.name",
        "avatar.path"
      ])
      .where("user.provider = :provider", { provider: true })
      .getMany();
  }

  async findOneProvider(id) {
    const provider = await this._db
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.avatar", "avatar")
      .select([
        "user.id",
        "user.name",
        "user.email",
        "avatar.name",
        "avatar.path"
      ])
      .where("user.provider = :provider and user.id = :id", {
        provider: true,
        id
      })
      .getOne();

    if (!provider) throw new NotFoundException("Provider");

    return provider;
  }
}
