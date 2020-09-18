import * as _ from 'lodash';
import * as qs from 'qs';

import { IQueryOptions } from '../interfaces/IQueryOptions';

export const PrepareHttpQuery = (options?: IQueryOptions, addQueryPrefix: boolean = true): string => {
  const query: any = {};
  query.pageSize = query.size = _.get(options, 'pageSize', 15);
  query.page = _.get(options, 'page', 0);
  query.sort = _.get(options, 'sort');
  const SEARCH = _.get(options, 'search', {});
  Object.keys(SEARCH).forEach(key =>
    query[key] = query[key] = SEARCH[key] instanceof Array ? SEARCH[key].join(', ') : SEARCH[key]
  );
  return qs.stringify(query, { addQueryPrefix });
};
