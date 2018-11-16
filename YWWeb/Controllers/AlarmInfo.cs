using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class AlarmInfo
    {
        public string AlarmAddress { get; set; }
        public string AlarmArea { get; set; }
        public double AlarmValue { get; set; }
        public string ALarmType { get; set; }
        public int AlarmState { get; set; }
        public string Units { get; set; }
        public string AlarmCate { get; set; }
        public int DID { get; set; }
    }
}
