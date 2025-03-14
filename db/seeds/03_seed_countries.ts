import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('countries').del(); // Clear existing data

  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Arab Emirates', code: 'AE' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Thailand', code: 'TH' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'Australia', code: 'AU' },
    { name: 'Spain', code: 'ES' },
    { name: 'Switzerland', code: 'CH' },
    { name: 'Singapore', code: 'SG' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Turkey', code: 'TR' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Canada', code: 'CA' },
    { name: 'Austria', code: 'AT' },
    { name: 'Italy', code: 'IT' },
    { name: 'Greece', code: 'GR' },
    { name: 'Portugal', code: 'PT' },
    { name: 'China', code: 'CN' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Maldives', code: 'MV' },
  ];

  await knex('countries').insert(
    countries.map(({ name, code }) => ({
      id: knex.raw('uuid_generate_v4()'),
      name,
      code,
    }))
  );
}
