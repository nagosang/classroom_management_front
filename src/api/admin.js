import request from '@/utils/request'

/**
 *
 * @param {对象数据} data
 */
export function changePwd(data) {
  return request({
    url: '/admin/changePwd',
    method: 'post',
    data
  })
}
