import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('residences', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .enum('status', ['DRAFT', 'ACTIVE', 'INACTIVE', 'DELETED'])
      .notNullable()
      .defaultTo('DRAFT');
    table.string('name').notNullable();
    table.string('website_url').nullable();
    table.string('subtitle').notNullable();
    table.text('description').notNullable();
    table.string('budget_start_from').notNullable();
    table.string('budget_start_to').notNullable();
    table.string('address').notNullable();
    table.string('latitude').notNullable();
    table.string('longitude').notNullable();
    table.string('year_build').notNullable();
    table
      .enum('development_status', ['COMPLETED', 'UNDER_CONSTRUCTION', 'PLANNED'])
      .notNullable()
      .defaultTo('PLANNED');
    table.string('floor_sqft').notNullable();
    table.integer('staff_ratio').notNullable();
    table.string('avg_price_per_unit').nullable();
    table.string('avg_price_per_sqft').nullable();
    table.enum('rental_portential', ['HIGH', 'MEDIUM', 'LOW']).nullable();
    table.boolean('pet_friendly').notNullable().defaultTo(false);
    table.boolean('disabled_friendly').notNullable().defaultTo(false);

    table.uuid('brand_id').references('id').inTable('brands').onDelete('SET NULL');

    table.uuid('country').references('id').inTable('countries').onDelete('SET NULL');

    table.uuid('city').references('id').inTable('cities').onDelete('SET NULL');

    table.uuid('video_tour_id').references('id').inTable('media').onDelete('SET NULL');
    table.string('video_tour_url').nullable();

    table.uuid('amenity_id').references('id').inTable('amenities').onDelete('SET NULL');

    table.uuid('company_id').references('id').inTable('companies').onDelete('SET NULL');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('residences');
}
