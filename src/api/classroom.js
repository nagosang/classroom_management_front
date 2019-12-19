import request from '@/utils/request'

/**
 *
 * @param {查询条件} data
 */
export function queryByPage(data) {
  return request({
    url: '/classroom/queryByPage',
    method: 'post',
    data
  })
}

/**
 *
 * @param {添加的对象} data
 */
export function createRoom(data) {
  return request({
    url: '/classroom/newRoom',
    method: 'post',
    data
  })
}

/**
 *
 * @param {int} id
 */
export function delRoom(id) {
  return request({
    url: '/classroom/delRoom?id=' + id,
    method: 'get'
  })
}

/**
 *
 * @param {更新的数据} data
 */
export function updateRoom(data) {
  return request({
    url: '/classroom/updateRoom',
    method: 'post',
    data
  })
}


/**
 * 
 * @param {更新的数据} data 
 * @param {对象的id} id 
 */
export function updateEquipment(data, id) {
  return request({
    url: '/classroom/updateEquipment?id=' + id,
    method: 'post',
    data
  })
}

/**
 * 
 * @param {教学楼id} id 
 */
export function getRoomList(id) {
  return request({
    url: '/classroom/getList?id=' + id,
    method: 'get'
  })
}
