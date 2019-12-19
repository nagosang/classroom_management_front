import request from '@/utils/request'

/**
 * @param {登录表单数据} data
 */

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}
