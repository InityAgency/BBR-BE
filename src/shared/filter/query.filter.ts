export function applySearchFilter(query, searchQuery: string | undefined, columns: string[]) {
    if (searchQuery && searchQuery.trim() !== '') {
      // Apply search filter to each column in the columns array
      query = query.where(function() {
        columns.forEach(column => {
          this.orWhere(column, 'ilike', `%${searchQuery}%`);
        });
      });
    }
    return query;
  }