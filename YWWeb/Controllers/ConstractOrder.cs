using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ConstractOrder
    {
        public Nullable<global::System.Int32> id { get; set; }
        public string CtrName { get; set; }
        public string CtrCom { get; set; }
        public string CtrAdmin { get; set; }
        public Nullable<global::System.Int32> CtrPid { get; set; }
        public Nullable<global::System.DateTime> start_time { get; set; }
        public Nullable<global::System.DateTime> end_time { get; set; }
        public string person { get; set; }
        public string orderTimes { get; set; }
    }
}
