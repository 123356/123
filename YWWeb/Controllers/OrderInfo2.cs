using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class OrderInfo2
    {
        public int templateId;
        public string title;
        public string templateName;
        public List<OrderInfo> element;

        public OrderInfo2(int templateId, string title, List<OrderInfo> element, string templateName)
        {
            // TODO: Complete member initialization
            this.templateId = templateId;
            this.title = title;
            this.element = element;
            this.templateName = templateName;
        }
    }
}
