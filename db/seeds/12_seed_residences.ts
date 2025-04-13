import { Knex } from 'knex';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { chunk } from 'lodash';

interface ResidenceCSV {
  residence_name: string;
  website_url: string;
  associated_brand: string;
  brief_subtitle: string;
  brief_description: string;
  budget_start_range: number;
  budget_end_range: number;
  city: string;
  country: string;
  address: string;
}

async function parseCSV(filePath: string): Promise<ResidenceCSV[]> {
  return new Promise((resolve, reject) => {
    const results: ResidenceCSV[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data as ResidenceCSV))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

function toNumber(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export async function seed(knex: Knex): Promise<void> {
  const filePath = `${__dirname}/../csv/residences_data.csv`;
  const residences = await parseCSV(filePath);

  // Deletes ALL existing entries
  await knex('residences').del();

  const brands = await knex('brands').select('id', 'name');
  const city = await knex('cities').select('id', 'name');
  const country = await knex('countries').select('id', 'name');
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b.id]));
  const cityMap = Object.fromEntries(city.map((c) => [c.name, c.id]));
  const countryMap = Object.fromEntries(country.map((c) => [c.name, c.id]));

  const formattedResidences = residences
    .map((residence) => {
      const brandId = brandMap[residence.associated_brand];
      const cityId = cityMap[residence.city];
      const countryId = countryMap[residence.country];

      if (!brandId) return null; // Skip brands with unknown brand types

      return {
        id: knex.raw('uuid_generate_v4()'),
        name: residence.residence_name,
        websiteUrl: residence.website_url,
        brandId,
        subtitle: residence.brief_subtitle,
        description: residence.brief_description,
        budgetStartRange: toNumber(residence.budget_start_range),
        budgetEndRange: toNumber(residence.budget_end_range),
        address: residence.address,
        latitude: 0.0,
        longitude: 0.0,
        cityId,
        countryId,
        createdAt: knex.fn.now(),
        updatedAt: knex.fn.now(),
      };
    })
    .filter((brand) => brand !== null);

  const batchSize = 500;
  const brandChunks = chunk(formattedResidences, batchSize);

  for (const batch of brandChunks) {
    await knex('residences').insert(batch);
  }
}
