using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;
    [Serializable]
    public partial class t_V_DeviceInfoState_PDR1
    {

        //pid
        public int PID { get; set; }
        public string Name { get; set; }

        //did
        public int DID { get; set; }
        public string DeviceName { get; set; }
        //cid
        public int CID { get; set; }
        public string CName { get; set; }
    }
}
