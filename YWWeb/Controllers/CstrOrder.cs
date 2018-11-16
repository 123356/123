using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class CstrOrder
    {
        public Nullable<global::System.Int32> CtrId { get; set; }
        public Nullable<global::System.Int32> CtrInfoId { get; set; }
        public Nullable<global::System.Int32> OrderId { get; set; }

        public Nullable<global::System.Int32> id { get; set; }//t_CM_CstrOrder id
        public Nullable<global::System.Int32> id1 { get; set; }//t_CM_CstrOrder id

        public string orderType { get; set; }
        public string TemplateIds { get; set; }

        public Nullable<global::System.DateTime> PlanDate { get; set; }

    }
}
