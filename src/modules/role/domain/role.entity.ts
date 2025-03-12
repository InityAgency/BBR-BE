export class Role {
  id: string;
  name: string;
  description: string;

  constructor(role: Partial<Role>) {
    Object.assign(this, role);
  }

  static create(name: string, description: string): Role {
    return new Role({ name, description });
  }
}
