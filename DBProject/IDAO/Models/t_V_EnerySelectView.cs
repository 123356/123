using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_V_EnerySelectView
    {
        public DateTime RecordTime { get; set; }
        public string DeviceName { get; set; }
        public string Name { get; set; }
        public int QID { get; set; }
        public decimal UserPowerRate { get; set; }
    }
}
