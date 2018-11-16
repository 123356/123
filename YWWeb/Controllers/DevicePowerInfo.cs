using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace S5001Web.Controllers
{
    public class DevicePowerInfo
    {
        public string current;       //DataTypeID=2:电流;
        public string voltage;       //3:电压;
        public double activePower;   //45:有功功率；
        public double reactivePower; //47：无功功率；
        public double inspectingPower;//视在功率；
        public string loadStr;//视在功率；
        public double load;//视在功率；
        public double capacity;
        public DevicePowerInfo(double current, string cUnits, double voltage, string vUnits, double activePower, double reactivePower, double capacity, string deviceName)
        {
            this.current = current < 0 ? "--" : (current + cUnits);
            this.voltage = voltage < 0 ? "--" : (voltage + vUnits);
            this.activePower = activePower;
            this.reactivePower = reactivePower;
            this.capacity = capacity;
            this.inspectingPower = System.Math.Sqrt(activePower * activePower + reactivePower * reactivePower);
            this.load = 100.00 * inspectingPower / capacity;
            if (load<0)
            {
                this.loadStr = "--";
            }else{
                this.loadStr = (100.00 * inspectingPower / capacity).ToString("F2") + "%";
                this.loadStr += "(" + deviceName + ")";
            }
        }
    }
}