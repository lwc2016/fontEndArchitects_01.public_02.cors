function jsonp({url, params={}, callback}){
    return new Promise((resolve, reject) => {
        // 创建script标签
        const script = document.createElement("script");
        // 将url赋值给script标签的src属性
        params = Object.assign(params, {[callback]: "callback"});
        // 拼接querystring
        const querystring = Object.keys(params).map(key => [key, params[key]].join("=")).join("&");
        script.src = url.includes("?") ? `${url}&${querystring}` : `${url}?${querystring}`;
        script.onerror = reject;
        // 将script标签插入到body中
        document.body.appendChild(script);
        // 成功后的回调函数
        window.callback = function(data){
            // 成功后将body中的script标签删除
            document.body.removeChild(script);
            window.callback = null;
            resolve(data);
        }
    })
}