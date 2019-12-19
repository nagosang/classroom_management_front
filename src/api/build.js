import request from '@/utils/request'

/**
 *
 * @param {查询} data
 */
export function queryBuild() {
  return request({
    url: '/build/getBuild',
    method: 'get'
  })
}

/**
 * 
 * @param {当前页数} page 
 */
export function queryList(page) {
  return request({
    url: '/build/queryList?page=' + page,
    method: 'get'
  })
}

/**
 * 
 * @param {更新数据} data 
 */
export function updateBuild(data) {
  return request({
    url: '/build/updateBuild',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {添加的数据} data 
 */
export function createBuild(data) {
  return request({
    url: '/build/createBuild',
    method: 'post',
    data
  })
}

/**
 * 
 * @param {删除对象id} id 
 */
export function deleteBuild(id) {
  return request({
    url: '/build/deleteBuild?id='+id,
    method: 'get'
  })
}
