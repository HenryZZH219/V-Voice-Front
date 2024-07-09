import request from '../utils/request';

// 获取历史消息
export const GetRoomsInfo = () => {
    return request({
        url: `/rooms/GetRoomsInfo`,
        method: 'get',
    })
}

// 