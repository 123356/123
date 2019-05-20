using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_sys_setting_cfg
    {
        public int ID { get; set; }
        public int cfg_id { get; set; }
        public string cfg_info { get; set; }
        public DateTime cfg_modify_time { get; set; }
        public string remark { get; set; }
    }
}
