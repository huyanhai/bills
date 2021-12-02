import { BASE_URL, TIMEOUT } from "../config/index.js";

export function get(url, data) {
  let authCode = String(uni.getStorageSync("authCode"));
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: "加载中",
    });
    uni.request({
      method: "GET",
      url: BASE_URL + url,
      header: {
        token: authCode,
      },
      data: data,
      timeout: TIMEOUT,
      success: function(res) {
        if (res.data.code !== 0) {
          if (res.data.code === 2) {
            uni.clearStorage("authCode");
            return uni.navigateTo({
              url: "Login",
            });
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

export function post(url, data) {
  let authCode = String(uni.getStorageSync("authCode"));
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: "加载中",
    });
    uni.request({
      method: "POST",
      url: BASE_URL + url,
      timeout: TIMEOUT,
      header: {
        token: authCode,
      },
      data: data,
      success: function(res) {
        if (res.data.code !== 0) {
          if (res.data.code === 2) {
            uni.clearStorage("authCode");
            return uni.navigateTo({
              url: "Login",
            });
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
