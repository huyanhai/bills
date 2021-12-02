import { Toast } from "vant";
import { post, get } from "./request.js";
import wx from "weixin-js-sdk";

export const getAuth = () => {
    return (window.location.href = `https://pmy.funku.cn/agent/wechat/auth?callbackUrl=${location.href}`);
};

export const getConfig = async() => {
    const { data } = await get("http://88yqq.cn/agent/wechat/config");
    wx.config({
        appId: data.appid, // 必填，公众号的唯一标识
        timestamp: data.jstimestamp, // 必填，生成签名的时间戳
        nonceStr: data.jsnonceStr, // 必填，生成签名的随机串
        signature: data.jssignature, // 必填，签名
    });
    wx.ready(() => {
        console.log("ready");
    })
};