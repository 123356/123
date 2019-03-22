using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_EE_ExEnergy
    {
        public int ID { get; set; }
        public DateTime RecordTime { get; set; }
        public int enerUserTypeID { get; set; }//区域ID
        public int DID { get; set; }
        public int CID { get; set; }
        public int CODID { get; set; }      //能耗类型ID
        public decimal BudgetEnergy { get; set; }//预测能耗
        public decimal ActualEnergy { get; set; }//实际能耗
        public decimal Proportion { get; set; }//异常占比
        public decimal ProportionValue { get; set; }//阈值
        public decimal Temperature { get; set; }//温度
        public decimal People { get; set; }//人数
        public decimal Area { get; set; }//面积
        public string Purpose { get; set; }//目的


        public string Conclusion { get; set; }
        public string EName { get; set; }
        public string DeviceName { get; set; }
        public string CName { get; set; }
        public string COName { get; set; }
        public string PName { get; set; }
    }


    public class t_EE_ExEnergy1: t_EE_ExEnergy
    {
        public int PID { get; set; }
    }



}
