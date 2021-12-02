/*
 * @Author: huyanhai
 * @since: 2020-04-19 13:57:16
 * @LastAuthor: huyanhai
 * @lastTime: 2021-11-13 09:48:11
 * @FilePath: /user-h5/src/libs/utils.js
 * @Description:工具库
 */

export function scan() {
    // 只允许通过相机扫码
    return new Promise((resolve, reject) => {
        uni.scanCode({
            onlyFromCamera: true,
            success: function(res) {
                resolve(res);
                console.log("条码类型：" + res.scanType);
                console.log("条码内容：" + res.result);
            },
            fail(e) {
                Toast({
                    title: "扫码失败",
                    icon: "none",
                });
                reject(e);
            },
        });
    });
}

export function checkPhone(num) {
    return /^1[3456789]\d{9}$/.test(num);
}

export function checkEmail(num) {
    return num.includes('@');
}

// 解析本地静态资源
export function getAssets(fliePath) {
    const modules =
        import.meta.globEager("../static/image/*");
    return modules[fliePath].default;
}