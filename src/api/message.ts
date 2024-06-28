import request from '../utils/request';

// 获取历史消息
export const GetMessageByRoomId = (roomId) => {
    return request({
        url: `getMessage/room/${roomId}`,
        method: 'get',
    })
}