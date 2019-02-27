using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_DM_ElementDevice
    {
        public int ID { get; set; }
        public string DeviceCode { get; set; }
        public string DeviceName { get; set; }
        public string DeviceModel { get; set; }
        public string Manufactor { get; set; }
        public int DID { get; set; }
        public int PID { get; set; }
        public string DName { get; set; }
        public string PName { get; set; }
    }
}
