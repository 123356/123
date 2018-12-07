using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class t_ES_ContractTempletI 
    {
        public Nullable<global::System.Int32> ID { get; set; }
        public global::System.String CtrName { get; set; }
        public global::System.String Remark { get; set; }
        public global::System.String UserName { get; set; }
        public global::System.String ConNo { get; set; }
        
        public global::System.String Name { get; set; }
        public Nullable<global::System.Int32> IsOk { get; set; }
         public Nullable<global::System.DateTime> AlarmTime { get; set; }
         public Nullable<global::System.DateTime> CreatTime { get; set; }
         public Nullable<global::System.DateTime> StartTime { get; set; }
         public Nullable<global::System.DateTime> CompleTime { get; set; }

         public List<t_cm_files> images { get; set; }
    }
}
