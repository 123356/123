using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class ReportInfo
    {
        public DateTime RecTime { get; set; }

        public double VoltageA;
        public double VoltageB;
        public double VoltageC;

        public double CurrentA;
        public double CurrentB;
        public double CurrentC;

        public double PowerFactor;//功率因素
        public double PowerConsumption;//用电量


        public ReportInfo(DateTime RecTime,double VoltageA, double VoltageB, double VoltageC, double CurrentA, double CurrentB, double CurrentC, double PowerFactor, double PowerConsumption)
        {
            this.RecTime = RecTime;

            this.VoltageA = VoltageA;
            this.VoltageB = VoltageB;
            this.VoltageC = VoltageC;

            this.CurrentA = CurrentA;
            this.CurrentB = CurrentB;
            this.CurrentC = CurrentC;

            this.PowerFactor = PowerFactor;
            this.PowerConsumption = PowerConsumption;
        }
    }
}
