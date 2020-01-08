import request from '../utils/request';

export function logIn(data) {
  return request({
    url: '/user/auth',
    method: 'post',
    data,
  });
}

export function putUser(_id, data) {
  return request({
    url: `/user/${_id}`,
    method: 'put',
    data,
  });
}

export function getUserList(params) {
  return request({
    url: '/user',
    method: 'get',
    params,
  });
}

export function getMe() {
  return request({
    url: '/user/me',
    method: 'get',
  });
}
