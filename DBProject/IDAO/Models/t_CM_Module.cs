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
    //[Table("t_CM_Module")]
    public partial class t_CM_Module
    {

        public int ModuleID { get; set; }
        public string ModuleName { get; set; }
        public int ParentID { get; set; }
        public string Icon { get; set; }
        public string Target { get; set; }
        public int ModuleType { get; set; }
        public string Location { get; set; }
        //public string 单位 { get; set; }
        public int? SN { get; set; }

    }
}
