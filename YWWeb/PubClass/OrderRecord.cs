using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.PubClass
{
    class OrderRecord
    {
        public string templateInfo { get; set; }
        public string templateName { get; set; }
        public Nullable<global::System.Int32> id { get; set; }
        public Nullable<global::System.Int32> orderId { get; set; }
        public Nullable<global::System.Int32> templateId { get; set; }
        public Nullable<global::System.Int32> tInfoId { get; set; }
        public string infoValue { get; set; }
        public Nullable<global::System.Int32> infoType { get; set; }
        public Nullable<global::System.Int32> DID { get; set; }
    }
}
