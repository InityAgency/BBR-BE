export function applySearchFilter(query, searchQuery: string | undefined, columns: string[]) {
  if (!searchQuery) {
    return query;
  }
  const searchTerm = `%${searchQuery}%`;

  const filteredQuery = query.where((builder) => {
    columns.forEach((column, index) => {
      const method = index === 0 ? 'where' : 'orWhere';
      builder[method](`countries.${column}`, 'ILIKE', searchTerm);
    });
  });

    return filteredQuery;
  }