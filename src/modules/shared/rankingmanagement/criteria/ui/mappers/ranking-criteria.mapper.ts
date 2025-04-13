export class RankingCriteriaMapper {
  static toResponse(rankingCriteria: any): any {
    return {
      id: rankingCriteria.id,
      name: rankingCriteria.name,
      description: rankingCriteria.description,
      weight: rankingCriteria.weight,
      is_default: rankingCriteria.is_default,
      created_at: rankingCriteria.created_at,
      updated_at: rankingCriteria.updated_at,
    };
  }
}
