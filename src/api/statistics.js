import request from '../utils/request';

export function getHomeStatistics(params) {
  return request({
    url: '/statistics/home',
    method: 'get',
    params,
  });
}
