const crypto = require("crypto");
const Identicon = require("identicon.js");
const fs = require("fs");
const path = require("path");

module.exports = (baseDir, str) => {
    return new Promise((resolve, reject)=>{
        const hash = crypto.createHash('md5');
        hash.update(str); // 传入用户名
        const imgData = new Identicon(hash.digest('hex')).toString();
        const buffer = Buffer.from(imgData, "base64");
        const filename = new Date().getTime() + ".png";
        const _path = path.join(__dirname, baseDir, filename);
        console.log(_path);
        fs.writeFile(_path, buffer, (error)=>{
            if(error){
                reject();
            }else{
                resolve(filename);
            }
        });
    });
};

