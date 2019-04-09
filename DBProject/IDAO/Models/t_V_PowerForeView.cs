using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    [Serializable]
    public class t_V_PowerForeView
    {
        public int FID { get; set; }
        public DateTime RecordTime { get; set; }
        public int PID { get; set; }
        public int CID { get; set; }
        public decimal ForeUsePower { get; set; }
    }
}
