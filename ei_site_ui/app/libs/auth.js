import { post } from "./request.js";
// 获取授权名
export function getOauthName() {
    let name;
    uni.getProvider({
        service: "oauth",
        success(e) {
            name = e.provider[0];
        },
    });
    return name;
}

// 用户登录
export function userLogin() {
    let name = getOauthName();
    uni.showLoading();
    return new Promise((resolve, reject) => {
        uni.login({
            provider: name,
            scopes: "auth_base",
            success: function(loginRes) {
                uni.getUserInfo({
                    provider: name,
                    success: function(infoRes) {
                        let data = Object.assign(loginRes, infoRes);
                        // // #ifdef MP-WEIXIN
                        // post("site/up/uniapp/info", {
                        //   code: data.code,
                        //   encryptedData: data.encryptedData,
                        //   iv: data.iv,
                        // }).then((res) => {
                        //   return resolve(res);
                        // });
                        // // #endif
                        return resolve(data)
                    },
                    fail(err) {
                        reject(err);
                    },
                });
            },
            fail(err) {
                reject(err);
            },
            complete() {
                uni.hideLoading();
            },
        });
    });
}

// 获取当前位置
export function getLocation() {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            type: "gcj02",
            success: function(res) {
                uni.setStorageSync("user_address", res);
                console.log("this.addressInfo1", res);
                resolve(res);
            },
            fail(err) {
                uni.showToast({
                    title: "获取定位失败",
                });
                reject(err);
            },
        });
    });
}

// 获取已经授权的信息
export function getSetting() {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success: function(res) {
                let data = res.authSetting;
            },
            fail(err) {
                uni.showToast("获取配置信息失败");
                reject(err);
            },
        });
    });
}