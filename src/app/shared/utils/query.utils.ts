import * as qs from 'qs';
import * as _ from 'lodash';

import { IQueryOptions } from '../interfaces/IQueryOptions';

export const PrepareHttpQuery = (options?: IQueryOptions, addQueryPrefix: boolean = true): string => {
  const query = {};
  query['tamanhoPagina'] = _.get(options, 'tamanhoPagina', 15);
  query['pagina'] = _.get(options, 'pagina', 1);
  query['ordenar'] = _.get(options, 'ordenar');
  const _pesquisa = _.get(options, 'pesquisa', {});
  Object.keys(_pesquisa).forEach(key =>
    query[key] = _pesquisa[key]
  );
  return qs.stringify(query, { addQueryPrefix });
}
