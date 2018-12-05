
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace YWWeb.Controllers
{
    class UnOrderDetail2
    {
        public List<OrderInfo3> mInfos=new List<OrderInfo3>();

        public string address;
        public string name;
        public string release_time;
        public string title;
        public string until_time;
        public string work_content;
        public string work_man;
        public int order_id;
        public int status;
        public string tel;
        public string FistDate;

        public string rLongtitude;//经度
        public string rLatitude;//纬度
        public UnOrderDetail2(List<OrderInfo> infos, t_PM_Order order, t_CM_PDRInfo t_CM_PDRInfo, string tel)
        {
            List<OrderInfo2> tempList = new List<OrderInfo2>();
            List<OrderInfo> element=null;

            string title = "";
            string templateName = "";
            int templateId = -1;
            for (int i = 0; i < infos.Count;i++ )
            {
                if (title != infos[i].templateBlock)
                {
                    if (element != null && title != "")
                    {
                        OrderInfo2 map = new OrderInfo2(templateId,title, element,templateName);
                        tempList.Add(map);
                    }
                    title = infos[i].templateBlock;
                    templateId = (int)infos[i].templateId;
                    templateName = infos[i].templateName;
                    element = new List<OrderInfo>();
                }
                element.Add(infos[i]);
                if (i == infos.Count - 1)
                {
                    OrderInfo2 map = new OrderInfo2(templateId, title, element, infos[i].templateName);
                    tempList.Add(map);
                }
            }
            templateName = "";
            templateId = -1;

            string sTemplateBlock2Old = "", sTemplateBlock2New = "";
            List<OrderInfo2> element2 = null;
            for (int i = 0; i < tempList.Count; i++)
            {
                if (templateId != tempList[i].templateId)
                {
                    if (element2 != null && title != "")
                    {
                        OrderInfo3 map = new OrderInfo3(templateId, templateName, element2);
                        mInfos.Add(map);
                    }
                    templateId = (int)tempList[i].templateId;
                    templateName = tempList[i].templateName;
                    element2 = new List<OrderInfo2>();
                }
                //
                for (int j = 0; j < tempList[i].element.Count; j++)
                {
                    sTemplateBlock2New = tempList[i].element[j].templateBlock2;
                    if (sTemplateBlock2New.Equals(sTemplateBlock2Old))
                    {
                        tempList[i].element[j].templateBlock2 = "";
                    }
                    else
                    {
                        sTemplateBlock2Old = sTemplateBlock2New;
                    }
                }
                
                
                //
                element2.Add(tempList[i]);
                if (i == tempList.Count - 1)
                {
                    OrderInfo3 map = new OrderInfo3(templateId, tempList[i].templateName, element2);
                    mInfos.Add(map);
                }
            }

            address = t_CM_PDRInfo.Position;
            name = t_CM_PDRInfo.CompanyName;
            release_time = order.CreateDate.ToString();
            title = order.OrderName;
            until_time = order.PlanDate.ToString();
            work_content = order.OrderContent;
            FistDate = order.FistDate.ToString();
            work_man = order.UserName;
            order_id = order.OrderID;
            status = (int)order.OrderState;
            this.tel = tel;
            string s = t_CM_PDRInfo.Coordination;
            string[] sArray = s.Split('|');
            try
            {
                rLongtitude = sArray[0];
                rLatitude = sArray[1];
            }
            catch (Exception e)
            {

            }
        }
    }
}
