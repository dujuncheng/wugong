const axios = require('axios')

const remoteHost = 'http://118.24.193.194:83';
const localHost = 'http://127.0.0.1:83';

let cleanCache = (param) => {
    return axios({
        method: 'post',
        url: `${localHost}/wugong_serve?method=clean_cache`,
        data: param,
    })

}


export {cleanCache}
