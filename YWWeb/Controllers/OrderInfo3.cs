using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class OrderInfo3
    {
        public int templateId;
        public string cname;
        public List<OrderInfo2> cdata;

        public OrderInfo3(int templateId, string cname, List<OrderInfo2> cdata)
        {
            // TODO: Complete member initialization
            this.templateId = templateId;
            this.cname = cname;
            this.cdata = cdata;
        }
    }
}
