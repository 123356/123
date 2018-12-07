using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class OrderInfo4
    {
        public string title;
        public List<OrderInfo> element;

        public OrderInfo4(string title, List<OrderInfo> element)
        {
            // TODO: Complete member initialization
            this.title = title;
            this.element = element;
        }

    }
}
