export async function applyPagination(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  // Calculate total pages and total count
  const totalResult = (await query
    .clone()
    .clearSelect()
    .clearOrder()
    .count('* as total')
    .first()) as unknown as { total: string };

  const totalCount = Number(totalResult.total);
  const totalPages = Math.ceil(totalCount / limit);
  const paginatedQuery = await query.limit(limit).offset(offset);

  return { paginatedQuery, totalCount, totalPages };
}
