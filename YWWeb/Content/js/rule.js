//自定义的验证

//坐标
var locationValidate = function (rule, value, callback) {
    if (!value) {
        return callback(new Error('请输入坐标'));
    } else if (!value.includes("|")) {
        return callback(new Error('坐标格式有误'));
    } else {
        callback();
    }
};
//金额
var moneyValidate = function (rule, value, callback) {
    var reg = /^[1-9]\d*\.\d*|0\.\d*[1-9]|[1-9]\d*$/;
    console.log(value)
    if (!reg.test(value) && value != "" && value!=null) {
            return callback(new Error('请输入大于0的数字'));
        } else {
            callback();
        }
};
//手机号
var mobilePhoneValidate = function (rule, value, callback) {
    var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
    if (!reg.test(value)) {
        return callback(new Error('电话格式有误'));
    } else {
        callback();
    }
};