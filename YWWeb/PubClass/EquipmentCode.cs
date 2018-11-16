using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Reflection;

namespace S5001Web.PubClass
{
    public class EquipmentCode
    {
        /// <summary>
        /// 获取设备编码
        /// </summary>
        /// <param name="codetype">设备类型 1是站 2是设备 3是传感器</param>
        public static long GetEquipmentCode(int codetype)
        {
            //最大范围值
            long maxtemp = 0;
            if (codetype == 1)
                maxtemp = 2000000000;
            else if (codetype == 2)
                maxtemp = 3000000000;
            else if (codetype == 3)
                maxtemp = 9000000000;

            long code = 0;
            pdermsWebEntities bll = new pdermsWebEntities();
            List<t_Sys_EquipmentCode> list = bll.t_Sys_EquipmentCode.Where(d => d.EquipmentCode < maxtemp).ToList();

            if (list.Count > 0)
            {
                // 最大设备编码加上1
                string equipmentcode = list.Max(m => m.EquipmentCode).ToString();
                long ecode = Convert.ToInt64(equipmentcode.Substring(1, 9)) + 1;
                code = Convert.ToInt64(codetype.ToString() + ecode.ToString("000000000"));
            }
            return code;
        }
    }
}