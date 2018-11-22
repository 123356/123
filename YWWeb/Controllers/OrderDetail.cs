using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace S5001Web.Controllers
{
    class OrderDetail
    {
        public string addr;
        public string all;
        public string check_content;
        public string check_info;
        public string check_man;
        public string order_id;

        public string company;
        public string connect_man;
        public string count;
        public string finish_time;
        public string first_arrived;
        public string lv;

        public string name;
        public string order_name;
        public string print_time;
        public string received_time;
        public string send_time;
        public string handle_result;
        public string tel;
        public string title;
        private t_PM_Order order;
        private t_CM_PDRInfo t_CM_PDRInfo;
        private t_CM_Unit t_CM_Unit;
        private t_CM_UserInfo user;
        public List<t_cm_files> listFiles;
        public OrderDetail(t_PM_Order order, t_CM_PDRInfo t_CM_PDRInfo, t_CM_Unit t_CM_Unit, t_CM_UserInfo user, List<t_cm_files> listFiles)
        {
            // TODO: Complete member initialization
            addr=t_CM_PDRInfo.Position;
            all=t_CM_PDRInfo.CapTotal.ToString();
            check_content=order.OrderContent;
            check_info=order.CheckInfo;
            check_man=order.UserName;
            order_id=order.OrderID.ToString();

            company = t_CM_PDRInfo.CompanyName;
            connect_man = t_CM_Unit.LinkMan;
            tel = t_CM_Unit.LinkMobile;
            count=t_CM_PDRInfo.Transformers.ToString();
            finish_time=order.CheckDate.ToString();   
            first_arrived=order.FistDate.ToString();
            lv=t_CM_PDRInfo.Vlevel;

            name = order.PName;
            order_name=order.OrderName;
            print_time=DateTime.Now.ToString();
            received_time=order.AcceptedDate.ToString();
            send_time=order.CreateDate.ToString();
            handle_result = order.IsQualified == 1 ? "已完成作业" : "未完成作业";        
            title=order.OrderType+"报告";     
            this.listFiles = listFiles;                                                 
        }
    }
}
