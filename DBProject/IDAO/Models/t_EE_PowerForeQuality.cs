using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_EE_PowerForeQuality
    {
        public int FID { get; set; }
        public int PID { get; set; }
        public int CID { get; set; }
        public decimal ForeUsePower { get; set; }
        public decimal UsePower { get; set; }
        public DateTime RecordTime { get; set; }
    }
}
