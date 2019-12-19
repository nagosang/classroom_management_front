import request from '@/utils/request'

/**
 *
 * @param {查询} data
 */
export function getEquipmentList() {
  return request({
    url: '/equipment/getEquipmentList',
    method: 'get'
  })
}

/**
 * 
 * @param {分页对象} data 
 */
export function queryByPage(data) {
  return request({
    url: '/equipment/queryByPage',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {修改的对象数据} data 
 */
export function updateEquipment(data) {
  return request({
    url: '/equipment/updateEquipment',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {删除对象id} id 
 */
export function deleteEquipment(id) {
  return request({
    url: '/equipment/deleteEquipment?id=' + id,
    method: 'get'
  })
}

/**
 * 
 * @param {添加对象数据} data 
 */
export function createEquipment(data) {
  return request({
    url: '/equipment/createEquipment',
    method: 'post',
    data
  })
}
