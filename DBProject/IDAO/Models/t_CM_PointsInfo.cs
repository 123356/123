using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations.Schema;

namespace IDAO.Models
{
    [Serializable]
    public partial class t_CM_PointsInfoBase1
    {
        public int TagID { get; set; }

        public Nullable<int> CID { get; set; }
        public string 数据类型 { get; set; }
    }

    [Serializable]
    [Table("t_CM_PointsInfo")]
    public partial class t_CM_PointsInfo: t_CM_PointsInfoBase1
    {
        public string TagName { get; set; }
        public int DID { get; set; }
        public Nullable<int> DataTypeID { get; set; }
        public string Position { get; set; }
        public Nullable<int> MPID { get; set; }
        public int UseState { get; set; }
        public Nullable<int> PIOID { get; set; }
        public Nullable<int> ABCID { get; set; }
        public string Remarks { get; set; }
        public string 设备点名 { get; set; }
        public string 中文描述 { get; set; }
        public string 站内点号 { get; set; }
        public Nullable<int> 实时库索引 { get; set; }
        public Nullable<int> PID { get; set; }
        public Nullable<int> 通信地址 { get; set; }
        public Nullable<double> 例外报告死区 { get; set; }
        public Nullable<double> 工程下限 { get; set; }
        public Nullable<double> 工程上限 { get; set; }
        public Nullable<int> 码值下限 { get; set; }
        public Nullable<int> 码值上限 { get; set; }
        public string 远动数据类型 { get; set; }
        public Nullable<double> 报警下限1 { get; set; }
        public Nullable<double> 报警上限1 { get; set; }
        public Nullable<int> 报警定义 { get; set; }
        public string 置0说明 { get; set; }
        public string 置1说明 { get; set; }
        public string 单位 { get; set; }
        public Nullable<int> 分组 { get; set; }
        public Nullable<int> 最大间隔时间 { get; set; }
        public Nullable<double> 小信号切除值 { get; set; }
        public Nullable<double> 报警下限2 { get; set; }
        public Nullable<double> 报警上限2 { get; set; }
        public Nullable<double> 报警下限3 { get; set; }
        public Nullable<double> 报警上限3 { get; set; }
        public Nullable<double> 报警死区 { get; set; }
        public Nullable<int> 报警级别 { get; set; }
        public Nullable<int> 报警方式 { get; set; }
        public Nullable<double> 速率报警限制 { get; set; }
        public Nullable<int> 初始值 { get; set; }
        public string 传感器SN编码 { get; set; }
        public Nullable<double> 变比 { get; set; }
        public Nullable<double> 系数 { get; set; }
    }
}
