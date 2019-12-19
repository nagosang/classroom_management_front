import request from '@/utils/request'

export function getSystemTime() {
  return request({
    url: '/getSystemTime',
    method: 'get'
  })
}
