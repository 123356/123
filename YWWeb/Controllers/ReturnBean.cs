using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class ReturnBean<T>
    {
        public int code;
        public String msg;
        public T data;
        public ReturnBean(int code,String msg, T data)
        {
            this.code = code;
            this.msg = msg;
            this.data = data;
        }
    }
}
