import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data before seeding
  await knex('users').del();

  const roles = await knex('roles').select('id', 'name');
  const superAdminRole = roles.find((role) => role.name === 'superadmin')?.id;
  const adminRole = roles.find((role) => role.name === 'admin')?.id;
  const developerRole = roles.find((role) => role.name === 'developer')?.id;
  const buyerRole = roles.find((role) => role.name === 'buyer')?.id;

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Insert seed data
  await knex('users').insert([
    {
      id: uuidv4(),
      first_name: 'Super',
      last_name: 'Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: superAdminRole,
      status: 'active',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      first_name: 'Admin',
      last_name: 'Residence',
      email: 'admin@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: adminRole,
      status: 'active',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      first_name: 'Developer',
      last_name: 'Peter',
      email: 'developer@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: developerRole,
      status: 'active',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      first_name: 'Buyer',
      last_name: 'Smith',
      email: 'buyer@example.com',
      password: hashedPassword,
      signup_method: 'email',
      role_id: buyerRole,
      status: 'active',
      email_verified: true, // ✅ Verified user
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
