import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_relation_multi_fields', (table) => {
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('field_name').notNullable();
    table.uuid('related_id').notNullable();
    table.string('related_table').notNullable();
    table.primary(['user_id', 'field_name', 'related_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_relation_multi_fields');
}
