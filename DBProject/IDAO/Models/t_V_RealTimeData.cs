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
    //[Table("t_SM_RealTime")]
    public partial class t_V_RealTimeData
    {
       
        public int TagID { get; set; }
        public string DeviceTypeName { get; set; }
        public string DeviceName { get; set; }
        public string Position { get; set; }
        public string Units { get; set; }
        //public string 单位 { get; set; }
        public double ?PV { get; set; }
        public string CName { get; set; }
        public DateTime ?RecTime { get; set; }
    }

    [Serializable]
    public partial class t_V_RealTimeData1 : t_V_RealTimeData
    {
        public string TagName { get; set; }
        public int CID { get; set; }
        public int PID { get; set; }
        // public string TypeName { get; set; }
        public int? DataTypeID { get; set; }
        public int? ABCID { get; set; }
        public string Remarks { get; set; }
    }
}
