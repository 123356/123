using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class UnOrderDetail
    {
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
        public string RejectReason;

        public string rLongtitude;//经度
        public string rLatitude;//纬度
        public List<Template> list;
        public UnOrderDetail(t_PM_Order order, t_CM_PDRInfo t_CM_PDRInfo,string tel)
        {
            address=t_CM_PDRInfo.Position;
            name=t_CM_PDRInfo.CompanyName;
            release_time=order.CreateDate.ToString();
            title=order.OrderName;
            until_time=order.PlanDate.ToString();
            work_content=order.OrderContent;
            FistDate = order.FistDate.ToString();
            RejectReason=order.RejectReason;
            work_man=order.UserName;
            order_id=order.OrderID;
            status=(int)order.OrderState;
            this.tel=tel;
            string s = t_CM_PDRInfo.Coordination;
            string[] sArray = s.Split('|');
            try
            {
                rLongtitude = sArray[0];
                rLatitude = sArray[1];
            }catch(Exception e){

            }
        }
        public UnOrderDetail(t_PM_Order order, t_CM_PDRInfo t_CM_PDRInfo, string tel, List<Template> list)
        {
            address = t_CM_PDRInfo.Position;
            name = t_CM_PDRInfo.CompanyName;
            release_time = order.CreateDate.ToString();
            title = order.OrderName;
            until_time = order.PlanDate.ToString();
            work_content = order.OrderContent;
            FistDate = order.FistDate.ToString();
            RejectReason = order.RejectReason;
            work_man = order.UserName;
            order_id = order.OrderID;
            status = (int)order.OrderState;
            this.tel = tel;
            this.list = list;
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
