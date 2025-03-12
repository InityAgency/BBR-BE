import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // ✅ Auto-generate UUID
    table.string('first_name', 64).notNullable();
    table.string('last_name', 128).notNullable();
    table.string('email', 128).notNullable().unique();
    table.string('password', 256).notNullable();
    table.string('signup_method').notNullable().defaultTo('email');
    table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.boolean('email_verified').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
