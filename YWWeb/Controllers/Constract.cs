using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class Constract
    {
        public Nullable<global::System.Int32> id { get; set; }
        public Nullable<global::System.Int32> isOk { get; set; }
        public string CtrName { get; set; }
        public string CtrCom { get; set; }
        public string CtrAdmin { get; set; }
        public Nullable<global::System.Int32> CtrPid { get; set; }
        public Nullable<global::System.DateTime> start_time { get; set; }
        public Nullable<global::System.DateTime> end_time { get; set; }
        public string person { get; set; }
        public Nullable<global::System.Int32> personid { get; set; }
        public string personids { get; set; }
        public string msgids { get; set; }
        public string CtrPName { get; set; }
        public string CtrInfo { get; set; }
        public Nullable<global::System.DateTime> createDate { get; set; }
        public string rcTemplateIds { get; set; }
        public string syTemplateIds { get; set; }
        public string orderrc { get; set; }
        public string orderjx { get; set; }
        public Nullable<global::System.Int32> UID { get; set; }
        public Nullable<global::System.Int32> ConType { get; set; }
        public Nullable<global::System.Int32> Type { get; set; }
        public string IsAlarm { get; set; }
        public string LinkMan { get; set; }
        public string Tel { get; set; }
        public string ConNo { get; set; }
        public string UnitProvince { get; set; }
        public string UnitCity { get; set; }
        public string ProjectName { get; set; }
    }
}
