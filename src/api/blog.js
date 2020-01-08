import request from '../utils/request';

export function createBlog(data) {
  return request({
    url: '/blog',
    method: 'post',
    data,
  });
}

export function updateBlogById(_id, data) {
  return request({
    url: `/blog/${_id}`,
    method: 'put',
    data,
  });
}

export function updateBlogStick(_id, data) {
  return request({
    url: `/blog/${_id}/stick`,
    method: 'put',
    data,
  });
}

export function updateBlogStatus(_id, data) {
  return request({
    url: `/blog/${_id}/status`,
    method: 'put',
    data,
  });
}

export function getBlogList(params) {
  return request({
    url: '/blog',
    method: 'get',
    params,
  });
}

export function getBlogDetail(_id) {
  return request({
    url: `/blog/${_id}`,
    method: 'get',
  });
}

