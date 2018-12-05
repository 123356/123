using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class HomeInfo
    {
        public string thismon;
        public string lastmon;
        public string thisyear;
        public string allPower;
        public string minPowerRate;
        public string maxPowerRate;

        public HomeInfo(string thismon, string lastmon, string thisyear, string allPower, string minPowerRate, string maxPowerRate)
        {
            // TODO: Complete member initialization
            this.thismon = thismon;
            this.lastmon = lastmon;
            this.thisyear = thisyear;
            this.allPower = allPower;
            this.minPowerRate = minPowerRate;
            this.maxPowerRate = maxPowerRate;
        }
    }
}
