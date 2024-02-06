import { QueryParams } from '../interfaces/http.interface';
import { config as Config } from 'src/app/gateways/config';
import axios, { AxiosRequestConfig } from 'axios';

export function getDefaultOptions(config: AxiosRequestConfig, token?: string): any
{
  if (token)
  {
    const headers = config.headers || {};
    Object.assign(headers, { Authorization: `Bearer ${token}` });
    config.headers = headers;
  }
  return {
    method: 'GET',
    ...config,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    }
  };
}

export function createAxios()
{
  const { withCredentials } = Config.apiGateway.server;

  return axios.create({
    withCredentials
  });
}

export function getParams(queryParams?: QueryParams)
{
  if (!queryParams)
  {
    return null;
  }
  const params = new URLSearchParams(queryParams?.filter);

  if (queryParams?.pagination)
  {
    if (queryParams?.pagination?.limit)
    {
      params.set('pagination[limit]', queryParams?.pagination?.limit);
    }
    if (queryParams?.pagination?.skip)
    {
      params.set('pagination[skip]', queryParams?.pagination?.skip);
    }
  }

  if (queryParams?.limit)
  {
    params.set('limit', queryParams?.limit);
  }
  if (queryParams?.skip !== undefined && queryParams?.skip !== null)
  {
    params.set('skip', queryParams?.skip);
  }

  Object.keys(queryParams).forEach((key) =>
  {
    if (['filter', 'pagination', 'limit', 'skip'].includes(key))
    {
      return;
    }
    if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined )
    {
      return;
    }
    params.append(key, queryParams[key]);
  });
  params.toString();

  return params;
}
