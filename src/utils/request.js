import axios from 'axios';
import { MessageBox, Notification } from 'element-ui';
// import store from '@/store';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true,
  timeout: 5000,
});


instance.interceptors.response.use(
  response => response.data,
  (error) => {
    const { status, data } = error.response;
    if (status === 401) {
      MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // store.dispatch('user/resetToken')
          //   .then(() => {
          //     location.reload();
          //   });
        });
    } else {
      Notification({
        title: '服务端传回异常',
        type: 'warning',
        message: data.message || '直接乱汤',
      });
    }
    return Promise.reject(new Error(data.message || 'Error'));
  },
);

export default instance;
