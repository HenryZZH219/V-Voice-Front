import request from '../utils/request';

// 获取历史消息
export const GetMessageByRoomId = (roomId) => {
    return request({
        url: `getMessage/room/${roomId}`,
        method: 'get',
    })
}

// 分页消息
export const GetMessageByRoomIdByPage = (roomId, page, size) => {
    return request({
        url: `getMessage/roomByPage/${roomId}`,
        method: 'get',
        params: {
            page: page,
            size: size
        }
    })
}