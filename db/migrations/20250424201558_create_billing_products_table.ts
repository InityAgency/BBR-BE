import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('billing_products', (table) => {
    table.increments('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('feature_key').notNullable(); // npr. unlock_bonus
    table.string('type').notNullable(); //'ONE_TIME', 'SUBSCRIPTION'
    table.string('product_id').notNullable(); // stripe
    table.string('price_id').notNullable(); // stripe
    table.boolean('active').defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('billing_products');
}
