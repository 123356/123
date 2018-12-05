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
    //[Table("t_CM_RoleRight")]
    public partial class t_CM_RoleRight
    {
       
        public int RoleRightID { get; set; }
        public int RoleID { get; set; }
        public int ModuleID { get; set; }
        public bool Disenable { get; set; }
       
    }
}
