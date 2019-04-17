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
    public partial class t_V_EnerProjectType
    {
        public int ID { get; set; }
        public string name { get; set; }
        public string Remarks { get; set; }
        public int item_type { get; set; }
        public int parent_id { get; set; }
        public int child_id { get; set; }
        public int unit_id { get; set; }
        public string unit_head { get; set; }
        public string unit_note { get; set; }
        public string addCid { get; set; }
        public string delCid { get; set; }
        public int unit_area { get; set; }
        public int unit_people { get; set; }
        public decimal NeedPower { get; set; }
        public decimal UsePower { get; set; }
        public string icon { get; set; }

    }
    public partial class t_V_EnerProjectTypeTree: t_V_EnerProjectType
    {
        public t_V_EnerProjectTypeTree(t_V_EnerProjectType o)
        {

            foreach (System.Reflection.PropertyInfo p in o.GetType().GetProperties())
            {
                //var xx = p.Name;
                var yy = p.GetValue(o);

                p.SetValue(this,yy, null);

            }
        }
        public List<t_V_EnerProjectTypeTree> Children { get; set; }
    }



    /// 用电量
    public partial class t_V_EnerPower
    {
        public decimal UsePower { get; set; }
        public decimal NeedPower { get; set; }
        public DateTime RecordTime{get;set;}
        public int PID { get; set; }
        public int CID { get; set; }
        public string ener_use_type { get; set; }
    }
}
