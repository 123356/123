using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class UnOrderDetail3
    {
        public List<OrderInfo4> mInfos;
        public string address;
        public string name;
        public string release_time;


        public UnOrderDetail3(List<OrderInfo> infos, t_PM_Order order, t_CM_PDRInfo t_CM_PDRInfo, string tel)
        {
            mInfos = new List<OrderInfo4>();
            List<OrderInfo> element = null;
            string title = "";
            //
            string sTemplateBlock2Old = "", sTemplateBlock2New = "";

            for (int i = 0; i < infos.Count; i++)
            {
                if (title != infos[i].templateBlock)
                {
                    if (element != null && title != "")
                    {
                        OrderInfo4 map = new OrderInfo4(title, element);
                        mInfos.Add(map);
                    }
                    title = infos[i].templateBlock;
                    element = new List<OrderInfo>();
                }

                //

                sTemplateBlock2New = infos[i].templateBlock2 == null ? "" : infos[i].templateBlock2;
                    if (sTemplateBlock2New.Equals(sTemplateBlock2Old))
                    {
                        infos[i].templateBlock2 = "";
                    }
                    else
                    {
                        sTemplateBlock2Old = sTemplateBlock2New;
                    }
         
                //

                element.Add(infos[i]);
                if (i == infos.Count - 1)
                {
                    OrderInfo4 map = new OrderInfo4(title, element);
                    mInfos.Add(map);
                }
            }
        }

    }
}
