import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import bcrypt from "bcrypt";

export class UserRepository {
  private repository = AppDataSource.getRepository(User);

  async create(userData: Partial<User>): Promise<User> {
    // Hash password before saving
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Assign default role
    const role = await AppDataSource.getRepository(Role).findOne({ where: { name: "user" } });
    if (role) {
      userData.role = role;
    }

    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    return isPasswordMatch ? user : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async updateAvatar(userId: number, avatar: string): Promise<User | null> {
    await this.repository.update(userId, { avatar });
    return this.findById(userId);
  }
}

export const userRepository = new UserRepository();