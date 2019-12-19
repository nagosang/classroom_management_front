import request from '@/utils/request'

/**
 * @param {查询的id} id
 */
export function getCourseName(id){
    return request({
        url: '/course/getName?id='+ id,
        method: 'get'
    })
}
