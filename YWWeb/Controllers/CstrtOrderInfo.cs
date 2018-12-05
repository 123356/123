using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class CstrtOrderInfo
    {
        public Nullable<global::System.Int32> CtrPid { get; set; }
        public string orderType { get; set; }
        public string person { get; set; }
        public string UserName { get; set; }
        public Nullable<global::System.Int32> UserID { get; set; }
        public Nullable<global::System.DateTime> PlanDate { get; set; }
        public string TemplateIds { get; set; }
    }
}
