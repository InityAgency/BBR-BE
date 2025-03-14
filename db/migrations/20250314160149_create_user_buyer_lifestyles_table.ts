import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_buyer_lifestyles', (table) => {
    table.uuid('user_id').references('user_id').inTable('user_buyers').onDelete('CASCADE');
    table.uuid('lifestyle_id').references('id').inTable('lifestyles').onDelete('CASCADE');
    table.primary(['user_id', 'lifestyle_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('user_buyer_lifestyles');
}
