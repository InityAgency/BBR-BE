import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('permissions').del();

  const permissions = [{ name: 'create' }, { name: 'read' }, { name: 'edit' }, { name: 'delete' }];

  for (const permission of permissions) {
    const exists = await knex('permissions').where('name', permission.name).first();
    if (!exists) {
      await knex('permissions').insert(permission);
    }
  }
}
