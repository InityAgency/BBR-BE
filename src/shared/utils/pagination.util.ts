export function applyPagination(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const paginatedQuery = query.limit(limit).offset(offset);

  return paginatedQuery;
}
