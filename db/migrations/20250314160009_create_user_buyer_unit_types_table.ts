import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_buyer_unit_types', (table) => {
    table.uuid('user_id').references('user_id').inTable('user_buyers').onDelete('CASCADE');
    table.uuid('unit_type_id').references('id').inTable('unit_types').onDelete('CASCADE');
    table.primary(['user_id', 'unit_type_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_buyer_unit_types');
}
