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
    [Table("t_CM_ValueType")]
    public partial class t_CM_ValueTypeComBox
    {

        public int DataTypeID { get; set; }
        public string Name { get; set; }
        //public string NameEn { get; set; }
        //public string 单位 { get; set; }
        //public int UseState { get; set; }
        //public string Remarks { get; set; }
        //public string CateName { get; set; }
        //public string Units { get; set; }
    }
}
