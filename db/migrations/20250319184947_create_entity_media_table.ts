import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('entity_media', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('entity_id').notNullable(); // Entity ID (e.g., Brand, Residence)
    table.string('entity_type').notNullable(); // Entity Type ('brand', 'residence')
    table.uuid('media_id').notNullable().references('id').inTable('media').onDelete('CASCADE'); // FK to `media`
    table.string('media_type').notNullable(); // Media Type (e.g., 'mainGallery', 'profileImage')

    table.integer('order').notNullable().defaultTo(0); // Image order
    table.boolean('highlighted').notNullable().defaultTo(false); // Highlighted image?

    // Indexes for performance
    table.index(['entity_id', 'entity_type']);
    table.index(['media_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('entity_media');
}
