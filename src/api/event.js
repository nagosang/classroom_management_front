import request from '@/utils/request'

/**
 * 
 * @param {分页对象} data 
 */
export function getList(data) {
  return request({
    url: '/event/getList',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {创建对象数据} data 
 */
export function createEvent(data) {
  return request({
    url: '/event/create',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {事件id} id 
 */
export function eventPass(id) {
  return request({
    url: '/event/pass?id=' + id,
    method: 'get'
  })
}

/**
 * 
 * @param {事件id} id 
 */
export function eventNotPass(id) {
  return request({
    url: '/event/notPass?id=' + id,
    method: 'get'
  })
}

/**
 * 
 * @param {事件id} id 
 */
export function eventCancel(id) {
  return request({
    url: '/event/cancel?id=' + id,
    method: 'get'
  })
}

/**
 * 
 * @param {申请者id} id 
 */
export function result(id) {
  return request({
    url: '/event/getResults?id=' + id,
    method: 'get'
  })
}
