using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class AlarmBean
    {
        public t_AlarmTable_en t_AlarmTable_en;
        public string AlarmValue;
        public AlarmBean(t_AlarmTable_en t_AlarmTable_en)
        {
            // TODO: Complete member initialization
            this.t_AlarmTable_en = t_AlarmTable_en;

            if (t_AlarmTable_en.AlarmCate == "开关量")
            {
                if (t_AlarmTable_en.AlarmArea == "水浸")
                {
                    AlarmValue = t_AlarmTable_en.AlarmValue == 0 ? "正常" : "浸水";
                }else{
                    AlarmValue = t_AlarmTable_en.AlarmValue == 0 ? "分闸" : "合闸";
                }
            }
            else
            {
                AlarmValue = t_AlarmTable_en.AlarmValue + "";
            }
        }
    }
}
