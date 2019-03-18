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
    public partial class t_CM_Unit
    {
        public int UnitID { get; set; }
        public string UnitName { get; set; }
        public string PDRList { get; set; }
        public string ArchitectureArea { get; set; }
    }
}
