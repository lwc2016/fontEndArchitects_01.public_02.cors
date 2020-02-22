#### 各种跨域方案介绍
##### 一，jsonp
jsonp是利用script，img等标签引用外部资源时没有跨域限制实现的。它将请求地址放在script或img标签的src上，地址上携带一个回调的方法名称。后端服务接收到请求后，将需要返回的数据包裹在请求参数中的回调名称内。这样前端script或img标签加载完毕后，会执行之前定义好的回调函数。回调函数的参数就是接收到的数据。

这种方式，只能用于get请求中。百度首页搜索时，就利用了jsonp进行实现的。

1.前端js实现
```javascript
const button = document.querySelector("#button");
button.onclick = function(){
    const script = document.createElement("script");
    script.src = "http://localhost:3030/detail?callback=getDetail";
    document.body.append(script);
    window.getDetail = function(data){
        document.body.removeChild(script);
        console.log(data);
    }
}
```

2.后端接口实现
```javascript
// 这里使用的express框架
app.get("/detail", function(req, res, next){
    const { callback } = req.query;
    const data = { message: "hello world" };
    res.send(`${callback}(${JSON.stringify(data)})`);
});
```
3.封装jsonp方法
```javascript
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

// 使用jsonp方法
button.onclick = function(){
    jsonp({
        url: "http://localhost:3030/detailddd",
        callback: "callback"
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    })
}
```
#### 二，cors
这种方法是纯后端实现的，跟前端没任何关系，前端不要作出修改。
```javascript
if(req.headers.origin === "http://localhost:3030"){
    // 允许哪个源进行跨域
    res.setHeader("Access-Control-Allow-origin", req.headers.origin);
    // 允许前端设置请求头
    res.setHeader("Access-Control-Allow-headers", "content-type,token");
    // 允许哪些请求方式，默认只有get和post可以
    res.setHeader("Access-Control-Allow-Methods", "PUT");
    // 允许携带cookie信息
    res.setHeader("Access-Control-Allow-Credentials", true);
    // 允许前端访问响应头里的哪个数据
    res.setHeader("Access-Control-Expose-Headers", "name");
}
```
- Access-Control-Allow-Origin: 允许哪个源可以跨域访问
- Access-Control-Allow-Headers; 允许设置哪些请求头
- Access-Control-Allow-Methods: 允许哪些请求方式，默认只允许get和post请求
- Access-Control-Allow-Credentials: 允许携带cookie信息
- Access-Control-Expose-Headers: 允许哪些响应头中的信息可以被前端访问

#### 三，websocket
websocket不存在跨域问题，因此可以访问其他域的数据。

1.前端js实现过程
```javascript
const ws = new this.WebSocket("ws://localhost:3030");
// 连接websocket
ws.onopen = function(){
    console.log("连接成功了");
}
// 获取到消息
ws.onmessage = function(message){
    const data = JSON.parse(message.data);
    console.log(data);
}
// 发送消息
form.onsubmit = function(event){
    event.preventDefault();
    const value =  textArea.value;
    if(value){
        ws.send(value);
        textArea.value = "";
    }
}; 
```
2.后端服务器相见github源码

#### 四，postMessage
当一个域名下面的一个网页，通过iframe嵌套另外一个域名下的一个网页，这是可以使用postMessage进行跨域访问。

1.a页面签到b页面
```
<iframe class="iframe" src="http://localhost:8080/detail.html" frameborder="0"></iframe>
```
2.a页面的js实现方式
```javascript
const iframe = document.querySelector(".iframe");
iframe.onload = function(){
    // iframe.contentWindow获取到iframe嵌套页面的window对象。
    // postMessage接收2个参数，第一个参数需要传递的数据，第二个参数b页面的域；
    iframe.contentWindow.postMessage("i love you", "http://localhost:8080");
}

window.onmessage = function(event){
    console.log("这是http://localhost:3030/index.html页面", event.data);
}
```
3.b页面的js实现方式
```javascript
window.onmessage = function(event){
    console.log("这是http://localhost:8080/detail页面：", event.data);
    event.source.postMessage("id not love you", "http://localhost:3030");
}
```
#### 五，nginx
使用nginx实现跨域，主要有2中方式：
- 1. 前端请求页面所在服务，使用nginx可以实现代理，将前端的请求转发到需要请求的服务器。
- 2. 需要访问的服务器，使用nginx设置cors。

1.使用nginx代理
```nginx
upstream a_supersummer_top  {
    server localhost:3030; #Apache
}
 
## Start www.quancha.cn ##
server {
    listen 80;
    server_name  a.supersummer.top;
 
    # access_log  logs/quancha.access.log;
    # error_log  logs/quancha.error.log;
    root   html;
    index  index.html index.htm index.php;
 
    ## send request back to apache ##
    location ^~/api/ {
    	proxy_pass http://b.supersummer.top/;
    }
    location / {
        proxy_pass  http://a_supersummer_top;
 
        #Proxy Settings
        proxy_redirect     off;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;
        proxy_connect_timeout      90;
        proxy_send_timeout         90;
        proxy_read_timeout         90;
        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;
   }
}
```
2.使用nginx设置cors
```nginx
upstream b_supersummer_top  {
    server localhost:8080; #Apache
}
 
## Start www.quancha.cn ##
server {
    listen 80;
    server_name  b.supersummer.top;
 
    # access_log  logs/quancha.access.log;
    # error_log  logs/quancha.error.log;
    root   html;
    index  index.html index.htm index.php;
     
    ## send request back to apache ##
    location / {
        proxy_pass  http://b_supersummer_top;
 
        #Proxy Settings
        proxy_redirect     off;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;
        proxy_connect_timeout      90;
        proxy_send_timeout         90;
        proxy_read_timeout         90;
        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;

        # 设置跨域
        add_header "Access-Control-Allow-Origin" "http://a.supersummer.top";
        add_header "Access-Control-Allow-Methods" "PUT";
        add_header "Access-Control-Allow-Headers" "token,content-type";
        add_header "Access-Control-Expose-Headers" "name";
        add_header "Access-Control-Allow-Credentials" "true";
   }
}
```
#### 六，http-proxy
在应用服务器上可以使用代理，将前端接收到请求转发给真正提供/处理数据的服务器。

1.express框架中使用`express-http-proxy`模块实现代理。
```javascript
const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

app.use(express.static("./static"));

app.use('/api', proxy('localhost:8080'));
// 启动服务
app.listen(3030, () => {
    console.log("server is running at port: 3030");
})
```

#### 七，其他方式
除了前面介绍的6中跨域方式外，页面与页面之间进行跨域传递数据还有一下3种方式：
- window.name
- window.domain
- window.hash

这三种方式，实际工作中几乎不会被用到。