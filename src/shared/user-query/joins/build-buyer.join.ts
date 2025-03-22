import { Knex } from 'knex';

export function buildBuyerJoin(knex: Knex) {
  return knex.raw(`
    LATERAL (
      SELECT json_build_object(
        'image_id', ub.image_id,
        'budgetRangeFrom', ub.budget_range_from,
        'budgetRangeTo', ub.budget_range_to,
        'phoneNumber', ub.phone_number,
        'preferredContactMethod', ub.preferred_contact_method,
        'currentLocation', json_build_object(
          'id', loc.id,
          'name', loc.name,
          'code', loc.code
        ),
        'preferredResidenceLocation', json_build_object(
          'id', res.id,
          'name', res.name,
          'code', res.code
        )
      )::json AS buyer
      FROM user_buyers ub
      LEFT JOIN countries loc ON loc.id = ub.current_location
      LEFT JOIN countries res ON res.id = ub.preferred_residence_location
      WHERE ub.user_id = users.id
    ) buyer ON TRUE
  `);
}
