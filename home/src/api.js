const axios = require('axios')

const host = 'http://118.24.193.194:83';

let cleanCache = ({type, urls}) => {
    if (type === 1 && !Array.isArray(urls)) {
        return;
    }

    let param = {
        type,
        urls: urls,
    }
    return axios({
        method: 'post',
        url: `${host}/wugong_serve?method=clean_cache`,
        data: param,
    })

}


export {cleanCache}
