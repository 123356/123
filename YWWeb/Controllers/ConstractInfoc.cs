using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ConstractInfoc
    {
        public Constract constract;
        public List<CstrOrder> ordersRC;//日常；
        public List<CstrOrder> ordersSY;//试验；

        public List<t_PM_Order> ordersDays;//已下发的日常巡检工单；
        public List<t_PM_Order> ordersTests;//已下发的试验工单；
        public List<t_PM_Order> others;//合同外的工单；

        public ConstractInfoc(Constract constract, List<CstrOrder> ordersRC, List<CstrOrder> ordersSY, List<t_PM_Order> allOrders)
        {
            // TODO: Complete member initialization
            this.constract = constract;
            this.ordersRC = ordersRC;
            this.ordersSY = ordersSY;
            if (allOrders != null && allOrders.Count > 0)
            {
                ordersDays = new List<t_PM_Order>();
                ordersTests = new List<t_PM_Order>();
                others = new List<t_PM_Order>();
                for (int i = 0; i < allOrders.Count; i++)
                {
                    Boolean added = false;
                    if (ordersRC != null && ordersRC.Count > 0)
                    {
                        CstrOrder cso = ordersRC.Find((CstrOrder s) => s.OrderId == allOrders[i].OrderID);
                        if (cso != null)
                        {
                            ordersDays.Add(allOrders[i]);
                            added = true;
                        }
                    }
                    if (ordersSY != null && ordersSY.Count > 0)
                    {
                        CstrOrder cso2 = ordersSY.Find((CstrOrder s) => s.OrderId == allOrders[i].OrderID);
                        if (cso2 != null)
                        {
                            ordersTests.Add(allOrders[i]);
                            added=true;
                        }
                    }
                    if (!added)
                    {
                        others.Add(allOrders[i]);
                    }
                }
            }
        }
    }
}
