using Loger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using YWWeb.Lib.Base;

namespace YWWeb.PubClass
{
    public class UserControllerBaseEx:UserControllerBase
    {
        public override void LogDebug(string msg)
        {
            Loger.LogHelper.Debug(msg);
        }
        public override void LogInfo(string msg)
        {
            LogHelper.Info(msg);
        }
        public override void LogException(Exception ex)
        {
            LogHelper.Error(ex);
        }
    }
}