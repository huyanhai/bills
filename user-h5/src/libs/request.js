import axios from "axios";
import { BASE_URL } from "../config/index";
import { Toast } from "vant";
import { session } from "./storage";
import { getAuth } from "./auth";

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000,
    headers: {},
});
// 拦截请求
instance.interceptors.request.use(function(config) {
    const token = session.get("token");
    if (!token) {
        // return getAuth();
    }
    return {
        ...config,
        headers: {
            ...config.headers,
            token: token,
        },
        params: {
            ...config.params,
        },
    };
});

// 过滤逻辑错误
instance.interceptors.response.use(
    (rawResponse) => {
        let { code, msg } = rawResponse.data;
        if (code !== 0) {
            Toast(msg);
        }
        return Promise.resolve(rawResponse.data);
    },
    (rawError) => {
        Toast(rawError.msg);
        return Promise.reject(rawError);
    }
);

export const all = axios.all;
export const spread = axios.spread;
export const CancelToken = axios.CancelToken;

export function get(url, data = {}, config = {}) {
    return instance.get(url, data, config);
}

export function post(url, data = {}, config = {}) {
    return instance.post(url, data, config);
}

export function put(url, data = {}, config = {}) {
    return instance.put(url, data, config);
}

export function del(url, config = {}) {
    return instance.delete(url, config);
}