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
        public int PID { get; set; }
        public string PName { get; set; }
        public int DID { get; set; }
        public string DName { get; set; }
        public int CID { get; set; }
        public string CName { get; set; }
    }
    public partial class t_V_CidTree {
        public string id { get; set; }
        public string name { get; set; }
        public int PID { get; set; }
        public int CID { get; set; }
        public int DID { get; set; }
        public IList<t_V_CidTree> Children { get; set; }
    }
}
