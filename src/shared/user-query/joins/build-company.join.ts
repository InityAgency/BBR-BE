import { Knex } from 'knex';

export function buildCompanyJoin(knex: Knex) {
  return knex.raw(`
    LATERAL (
        SELECT json_build_object(
        'id', companies.id, 
        'name', companies.name, 
        'address', companies.address, 
        'phone_number', companies.phone_number, 
        'website', companies.website, 
        'image_id', companies.image_id, 
        'contact_person_avatar_id', companies.contact_person_avatar_id,
        'contact_person_full_name', companies.contact_person_full_name, 
        'contact_person_job_title', companies.contact_person_job_title, 
        'contact_person_email', companies.contact_person_email, 
        'contact_person_phone_number', companies.contact_person_phone_number, 
        'contact_person_phone_number_country_code', companies.contact_person_phone_number_country_code 
        )::json AS company
        FROM companies 
        WHERE companies.id = users.company_id
    ) company ON TRUE
  `);
}
