import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // Role ID
    table.string('name', 50).notNullable().unique(); // Role name (e.g., "admin", "user", "moderator")
    table.string('description', 255).nullable(); // Optional description
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('roles');
}
