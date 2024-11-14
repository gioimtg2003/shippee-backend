import { SelectQueryBuilder } from 'typeorm';
import { SortOrderInput } from './dto/sort.dto';
import { CoreEntity } from './entities';

export function applyQuerySortOrder<T extends CoreEntity>(
  query: SelectQueryBuilder<T>,
  sort: SortOrderInput,
): SelectQueryBuilder<T> {
  if (!sort) return query;

  const keys = Object.keys(sort);
  if (!keys.length) {
    query.orderBy(`${query.alias}.${query.alias}_id`, 'DESC');
  } else {
    keys.forEach((key) => {
      query.addOrderBy(`${query.alias}.${key}`, sort[key]);
    });
  }
  return query;
}

export function applyQueryOperators<T extends CoreEntity>(
  query: SelectQueryBuilder<T>,
  key: string,
  operation: any,
): SelectQueryBuilder<T> {
  if (!operation) return query;

  const isNegative = operation.negative;

  if (typeof operation.eq !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? '!=' : '='} :${key}`, {
      [key]: operation.eq,
    });
  }

  if (typeof operation.gt !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? '<=' : '>'} :${key}`, {
      [key]: operation.gt,
    });
  }

  if (typeof operation.gte !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? '<' : '>='} :${key}`, {
      [key]: operation.gte,
    });
  }

  if (typeof operation.lt !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? '>=' : '<'} :${key}`, {
      [key]: operation.lt,
    });
  }

  if (typeof operation.lte !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? '>' : '<='} :${key}`, {
      [key]: operation.lte,
    });
  }

  if (typeof operation.in !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? 'NOT IN' : 'IN'} (:...${key})`, {
      [key]: operation.in,
    });
  }

  if (typeof operation.contains !== 'undefined') {
    query.andWhere(`${key} ${isNegative ? 'NOT ILIKE' : 'ILIKE'} :${key}`, {
      [key]: `%${operation.contains}%`,
    });
  }

  if (typeof operation.isNull !== 'undefined') {
    query.andWhere(`${key} IS ${operation.isNull ? 'NULL' : 'NOT NULL'}`);
  }

  return query;
}

export function applyQueryFilter<T extends CoreEntity>(
  query: SelectQueryBuilder<T>,
  filter: Record<string, any>,
): SelectQueryBuilder<T> {
  if (!filter) return query;

  Object.keys(filter).forEach((filterKey) => {
    const operation = filter[filterKey];
    if (!operation) return;

    const key = `${query.alias}.${filterKey}`;
    applyQueryOperators(query, key, operation);
  });

  return query;
}

export function applyQueryRelations<T extends CoreEntity>(
  query: SelectQueryBuilder<T>,
  relations?: string[],
) {
  if (relations && relations.length) {
    relations.forEach((relation) => {
      // Check if the relation is already joined to avoid duplicates
      if (
        !query.expressionMap.joinAttributes.some(
          (join) => join.relation.propertyName === relation,
        )
      ) {
        query.leftJoinAndSelect(`${query.alias}.${relation}`, relation);
      }
    });
  }

  return query;
}
