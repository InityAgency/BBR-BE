import { Model, QueryBuilder } from 'objection';
import { validate as isValidUUID } from 'uuid';

type FilterValue = string | number | boolean | Array<string | number>;
type FilterConfig<T> = {
  [K in keyof T]?: FilterValue;
};

export function applyFilters<T extends Model>(
  query: QueryBuilder<T, T[]>,
  filters: FilterConfig<T>,
  alias?: string
): QueryBuilder<T, T[]> {
  Object.entries(filters).forEach(([key, value]) => {
    const column = alias ? `${alias}.${key}` : key;

    if (Array.isArray(value)) {
      const validValues = value.filter((v) => {
        if (
          (key.toLowerCase().endsWith('id') || key.toLowerCase() === 'id') &&
          typeof v === 'string'
        ) {
          return isValidUUID(v);
        }
        return true;
      });

      if (validValues.length) {
        query.whereIn(column, validValues);
      }
    } else if (value !== undefined && value !== null) {
      // ✅ Dodaj UUID validaciju ako je field "id" ili se završava na "Id"
      if (
        (key.toLowerCase().endsWith('id') || key.toLowerCase() === 'id') &&
        typeof value === 'string' &&
        !isValidUUID(value)
      ) {
        return; // skip invalid uuid
      }

      query.where(column, value);
    }
  });

  return query;
}
