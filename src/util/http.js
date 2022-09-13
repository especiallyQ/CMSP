import Axios from 'axios'
import router from '../router'
import Cookies from 'js-cookie'
let axiosIns = Axios.create({
    timeout: 60 * 1000
});

var mock = {}
if (process.env.NODE_ENV == 'test'){
    var MockAdapter = require("axios-mock-adapter");
     mock = new MockAdapter(axiosIns);

}
export function setGetTestData( rules,  status, response) {
    mock.onGet(rules).reply(status, response);
}

export function setPostTestData( rules,  status, response) {
    mock.onPost(rules).reply(status, response);
}

export function setDeleteTestData( rules,  status, response) {
    mock.onDelete(rules).reply(status, response);
}

export function setPutTestData( rules,  status, response) {
    mock.onPut(rules).reply(status, response);
}


export function resetTestData(){
    mock.restore();
}

axiosIns.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axiosIns.defaults.responseType = 'json';
axiosIns.defaults.validateStatus = function () {
    return true
};
// http response interceptor
axiosIns.interceptors.response.use(
    response => {

        if (response.data && response.data.code === 302000) {
            router.push({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath }
            })
        }
        if (response.data && (response.data.code === 202052 || response.data.code === 202053)) {
            router.push({
                path: "/login"
            })
        }
        return response;
    },
    error => {
        if (error.message.includes('timeout')) {
            if (localStorage.getItem('lang') === "en") {
                error.data = 'Timeout'
            } else {
                error.data = '请求超时'
            }
        }
        return Promise.reject(error)
    });

export default {
    axiosIns
}
/**post
 * @param options
 * @return {Promise}
 */
export function post(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**get
 * @param options
 * @return {Promise}
 */
export function get(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};

/**patch
 * @param options
 * @return {Promise}
 */
export function patch(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**put
 * @param options
 * @return {Promise}
 */
export function put(options) {
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
/**delete
 * @param options
 * @return {Promise}
 */
export function deleted(options) {
    console.log('options', options);
    return new Promise((resolve, reject) => {
        axiosIns(options).then(response => {
            resolve(response)
        })
            .catch(error => {
                reject(error)
            })
    })
};
