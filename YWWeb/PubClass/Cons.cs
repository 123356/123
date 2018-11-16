using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace S5001Web.PubClass
{
    public class Cons
    {
        //0正常；1未登录；2报错；
        public const int CODE_SUCCESS = 0;
        public const int CODE_NEED_LOGIN = 1;
        public const int CODE_EX = 2;

        public const string MSG_SUCCESS = "成功";
        public const string MSG_NEED_LOGIN = "未登录";
        public const string MSG_EX = "异常信息";
    }
}