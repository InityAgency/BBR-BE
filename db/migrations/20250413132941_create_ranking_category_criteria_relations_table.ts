import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('ranking_category_criteria', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('ranking_category_id')
      .notNullable()
      .references('id')
      .inTable('ranking_categories')
      .onDelete('CASCADE');
    table
      .uuid('ranking_criteria_id')
      .notNullable()
      .references('id')
      .inTable('ranking_criteria')
      .onDelete('CASCADE');
    table.integer('weight').notNullable(); // mora biti zbir 100 za sve u toj kategoriji
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('ranking_category_criteria');
}
