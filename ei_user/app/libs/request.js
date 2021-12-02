import { BASE_URL, TIMEOUT } from "../config/index.js";
import { userLogin } from "./auth";

export async function get(url, data, showTips = true) {
    let authCode = uni.getStorageSync("authCode");
    let check = uni.getStorageSync("check");
    if (!authCode && !check) {
        uni.setStorageSync("check", true);
        await userLogin();
    }
    return new Promise((resolve, reject) => {
        if (showTips) {
            uni.showLoading({
                title: "加载中",
                mask: true,
            });
        }
        uni.request({
            method: "GET",
            url: BASE_URL + url,
            header: {
                token: authCode,
            },
            data: data,
            timeout: TIMEOUT,
            success: async(res) => {
                if (res.data.code !== 0) {
                    if (res.data.code === 2) {
                        uni.clearStorage("authCode");
                        uni.clearStorage("check");
                        await userLogin();
                        return resolve(res.data);
                    }
                    setTimeout(() => {
                        uni.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: 3000,
                        });
                    }, 100);
                }
                resolve(res.data);
            },
            fail: function(err) {
                setTimeout(() => {
                    uni.showToast({
                        title: err.msg,
                        icon: "none",
                        duration: 3000,
                    });
                }, 100);
                reject(err);
            },
            complete: function() {
                uni.hideLoading();
            },
        });
    });
}

export async function post(url, data) {
    let authCode = uni.getStorageSync("authCode");
    let check = uni.getStorageSync("check");
    if (!authCode && !check) {
        uni.setStorageSync("check", true);
        await userLogin(check);
    }
    return new Promise((resolve, reject) => {
        uni.showLoading({
            title: "加载中",
            mask: true,
        });
        uni.request({
            method: "POST",
            url: BASE_URL + url,
            timeout: TIMEOUT,
            header: {
                token: authCode,
            },
            data: data,
            success: async(res) => {
                if (res.data.code !== 0) {
                    if (res.data.code === 2) {
                        uni.clearStorage("authCode");
                        uni.clearStorage("check");
                        await userLogin();
                        return resolve(res.data);
                    }
                    setTimeout(() => {
                        uni.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: 3000,
                        });
                    }, 100);
                }
                resolve(res.data);
            },
            fail: function(err) {
                setTimeout(() => {
                    uni.showToast({
                        title: err.msg,
                        icon: "none",
                        duration: 3000,
                    });
                }, 100);
                reject(err);
            },
            complete: function() {
                uni.hideLoading();
            },
        });
    });
}