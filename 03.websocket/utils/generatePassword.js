const crypto = require("crypto");

module.exports = (str)=>{
    const hash = crypto.createHash('md5');
    hash.update(String(str)); // 传入用户名
    return hash.digest('hex');
};
