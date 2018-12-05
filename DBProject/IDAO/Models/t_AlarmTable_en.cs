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
    public partial class t_AlarmTable_en
    {
        public int AlarmID { get; set; }
        public string ALarmType { get; set; }
       public int? AlarmState { get; set; }
        public string Company { get; set; }
        public int PID { get; set; }
        public int DID { get; set; }
        public int ?CID { get; set; }
        public string AlarmCate { set; get; }
        public double? AlarmValue { set; get; }
      public DateTime? AlarmDateTime { set; get; }
    }
}
