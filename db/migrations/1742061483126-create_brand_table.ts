import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('brands', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')); // Auto-generate UUID
    table.string('name', 126).notNullable();
    table.string('description', 1024).nullable();
    table.string('type', 32).notNullable();
    table.string('status', 32).notNullable().defaultTo('DRAFT');
    table.timestamp('registered_at').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('brands');
}
