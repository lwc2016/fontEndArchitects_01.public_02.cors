window.onload = function(){
    // 获取元素
    const form = document.querySelector(".form");
    const textArea = document.querySelector(".input");
    const listElement = document.querySelector(".list");
    const listInnerElement = document.querySelector(".list-inner");
    // 获取当前用户id
    const currend_id = document.querySelector("#id").value;
    // 创建websockt连接
    const ws = new this.WebSocket("ws://localhost:3030");
    // 连接websocket
    ws.onopen = function(){
        console.log("连接成功了");
    }
    // 获取到消息
    ws.onmessage = function(message){
        const data = JSON.parse(message.data);
        renderMessage(data);
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
    // 创建fragment
    const renderMessage = (data)=>{
        console.log(data);
        listInnerElement.innerHTML += `
            <div class="item ${data.user.id == currend_id ? 'item-right' : ''}">
                ${data.user.id == currend_id ? (
                    `
                    <div class="item-content">
                        <div class="item-name">${data.user.nickName}</div>
                        <div class="item-message">${data.content}</div>
                    </div>
                    <img class="avatar" src="${`/img/${data.user.avatar}`}" alt="">
                    `
                ): (
                    `
                    <img class="avatar" src="${`/img/${data.user.avatar}`}" alt=""></img>
                    <div class="item-content">
                        <div class="item-name">${data.user.nickName}</div>
                        <div class="item-message">${data.content}</div>
                    </div>
                    `    
                )}
            </div>
        `
        // 获取父元素的高度
        const parentHeight = listElement.clientHeight;
        // 获取元素的高度
        const clientHeight = listInnerElement.clientHeight;
        console.log(clientHeight - parentHeight);
        console.log(clientHeight);
        console.log(parentHeight);
        listElement.scrollTo(0, clientHeight - parentHeight + 20);
    };  
}