import { Knex } from 'knex';

export function buildRoleJoin(knex: Knex) {
  return knex.raw(`
    LATERAL (
      SELECT json_build_object('id', r.id, 'name', r.name)::json AS role
      FROM roles r
      WHERE r.id = users.role_id
    ) role ON TRUE
  `);
}
