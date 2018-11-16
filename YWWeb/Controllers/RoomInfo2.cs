using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class RoomInfo2
    {
        public string days;
        public string temp;
        public string hum;
        public string maxTemp;
        public string load;
        public string loadPer;
        public string monMaxload;
        public string monNeedload;
        public string yearMaxload;

        public RoomInfo2(string days, string temp, string hum, string MaxPointTemperature, string allPower, string powerRate, string monPower, string monNeed, string yearPower)
        {
            // TODO: Complete member initialization
            this.days = days;
            this.temp = temp;
            this.hum = hum;
            this.maxTemp = MaxPointTemperature;
            this.load = allPower;
            this.loadPer = powerRate;
            this.monMaxload = monPower;
            this.monNeedload = monNeed;
            this.yearMaxload = yearPower;
        }
    }
}
