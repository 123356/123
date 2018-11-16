using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class UsePower
    {
        //电费
        public Nullable<global::System.Decimal> UserPowerRateFlat { get; set; }
        public Nullable<global::System.Decimal> UserPowerRatePeak { get; set; }
        public Nullable<global::System.Decimal> UserPowerRatePeakPeak { get; set; }
        public Nullable<global::System.Decimal> UserPowerRateValley { get; set; }
        //电量
        public Nullable<global::System.Decimal> UserPowerFlat { get; set; }
        public Nullable<global::System.Decimal> UserPowerPeak { get; set; }
        public Nullable<global::System.Decimal> UserPowerPeakPeak { get; set; }
        public Nullable<global::System.Decimal> UserPowerValley { get; set; }
    }
}
