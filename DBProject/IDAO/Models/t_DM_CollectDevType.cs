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
    [Table("t_DM_CollectDevType")]
    public class t_DM_CollectDevType
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Remaks { get; set; }

    }
}
