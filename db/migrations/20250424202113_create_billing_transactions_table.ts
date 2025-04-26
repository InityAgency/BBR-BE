import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('billing_transactions', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();
    table.string('payment_intent_id').notNullable(); // stripe
    table.string('invoice_id'); // stripe
    table.string('type').notNullable(); // one_time / subscription
    table.decimal('amount', 10, 2).notNullable();
    table.string('currency', 10).defaultTo('USD');
    table.string('status').notNullable(); // succeeded, failed, etc.
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('billing_transactions');
}
