import request from '../utils/request';

export function getBlogList(params) {
  return request({
    url: '/blog',
    method: 'get',
    params,
  });
}
