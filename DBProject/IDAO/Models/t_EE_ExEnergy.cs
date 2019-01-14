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
        public int enerUserTypeID { get; set; }
        public int DID { get; set; }
        public int CID { get; set; }
        public int CODID { get; set; }
        public decimal BudgetEnergy { get; set; }
        public decimal ActualEnergy { get; set; }
        public decimal Proportion { get; set; }
        public decimal ProportionValue { get; set; }
        public decimal Temperature { get; set; }
        public decimal People { get; set; }
        public decimal Area { get; set; }
        public string Purpose { get; set; }
        public string Conclusion { get; set; }
        public string EName { get; set; }
        public string DeviceName { get; set; }
        public string CName { get; set; }
        public string COName { get; set; }
    }
}
