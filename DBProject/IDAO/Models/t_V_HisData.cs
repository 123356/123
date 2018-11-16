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
    [Table("配电房_00001_历史数据表")]
    public partial class t_V_HisData
    {
       
        public System.DateTime 记录时间 { get; set; }
        public int 配电房编号 { get; set; }
        public int 测点编号 { get; set; }
        public string 测点名称 { get; set; }
        public Nullable<double> 测量值 { get; set; }
        public string 安装地点 { get; set; }
        //public string 单位 { get; set; }
        public string 数据类型 { get; set; }
        public string 测点位置 { get; set; }
        public string 监测位置 { get; set; }
        public string 设备名称 { get; set; }
        public string 设备编码 { get; set; }
        public string 单位名称 { get; set; }
        public string 报警状态 { get; set; }
        public Nullable<double> 报警限值 { get; set; }
    }
}
