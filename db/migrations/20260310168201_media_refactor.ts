import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('media', (table) => {
    // Add the new columns
    table.string('original_file_name').notNullable(); 
    table.string('upload_status', 32).notNullable().defaultTo('PENDING'); 
    table.string('storage', 32).notNullable(); 
    table.string('base_path').notNullable(); 
    table.integer('size').notNullable(); 
    table.string('external_id').nullable(); 
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now()); 
    table.timestamp('deleted_at').nullable(); 
    
    // Remove old columns
    table.dropColumn('file_name');
    table.dropColumn('file_url');
    table.dropColumn('bucket_name');
    table.dropColumn('uploaded_by');
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('media');
}