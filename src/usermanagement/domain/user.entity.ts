import * as bcrypt from 'bcrypt';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  signupMethod: string;
  emailVerified?: boolean;
  status?: 'active' | 'inactive';
  roleId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  private constructor(user: Partial<User>) {
    Object.assign(this, user);
  }

  static async create(data: Partial<User>): Promise<User> {
    return new User(await this.beforeInsert(data));
  }

  static async beforeInsert(user: Partial<User>): Promise<Partial<User>> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    console.log('role', user.roleId);

    return {
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static async beforeUpdate(user: Partial<User>): Promise<Partial<User>> {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return {
      ...user,
      updatedAt: new Date(),
    };
  }
}
