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
    [Table("t_CM_DeviceType")]
    public partial class t_CM_DeviceTypeComBox
    {

        public int DTID { get; set; }
        public string Name { get; set; }
    }
}
