using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ConsumptionBean
    {
       //本月电量，上月电量；今年电量；本月电费峰谷平，本月电量峰谷平；
        public Consumption thisMonthC;
        public Consumption lastMonthC;
        public Consumption thisYearC;

        public ConsumptionBean(Consumption thisMonthC, Consumption lastMonthC, Consumption thisYearC)
        {
            this.thisMonthC = thisMonthC;
            this.lastMonthC = lastMonthC;
            this.thisYearC = thisYearC;
        }
    }
}
