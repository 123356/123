using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.Text;
using System.IO;
using System.Net;

using YWWeb.Controllers;
using YWWeb.PubClass;


namespace YWWeb.Controllers
{
    public class OrderInfoController : UserControllerBaseEx
    {
        //
        // GET: /OrderInfo/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        FileManageController fm = new FileManageController();

        [Login]
        public ActionResult OrderList()
        {
            return View();
        }
        [Login]
        public ActionResult OrderEdit()
        {
            return View();
        }
        [Login]
        public ActionResult OrderEditByConstract()
        {
            return View();
        }
        [Login]
        public ActionResult OrderDetail()
        {
            return View();
        }
        [Login]
        public ActionResult OrderCheckInfo()
        {
            return View();
        }
        [Login]
        public ActionResult OrderImage()
        {
            return View();
        }
        #region APP 获取工单详情
        /// <summary>
        /// 获取工单详情
        /// </summary>
        /// <param name="OrderID">工单ID</param>
        /// <returns></returns>
        public ActionResult LoadOrderInfo(int OrderID)
        {
            string strJson = "error";
            string sessionid = "";
            if (Request.Cookies["sid"] != null)
            {
                sessionid = Request.Cookies["sid"].Value;
                if (Session[sessionid] != null)
                {
                    t_PM_Order order = bll.t_PM_Order.Where(o => o.OrderID == OrderID).First();
                    if (order != null)
                    {
                        strJson = Common.JsonDataInfo(order);

                        //修改工单状态，已领取
                        if (order.OrderState == 0)
                        {
                            order.OrderState = 1;
                            order.AcceptedDate = DateTime.Now;
                            bll.ObjectStateManager.ChangeObjectState(order, EntityState.Modified);
                            bll.SaveChanges();
                        }
                    }
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 获取工单列表
        /// </summary>
        /// <param name="UserName">用户名称</param>
        /// <param name="OrderState">工单状态 0 所有 1未完成 2已完成</param>
        /// <returns></returns>
        public ActionResult OrderInfoData(string UserName, int OrderState = -1)
        {
            string strJson = "error";
            string sessionid = "";
            if (Request.Cookies["sid"] != null)
            {
                sessionid = Request.Cookies["sid"].Value;
                if (Session[sessionid] != null)
                {
                    List<t_PM_Order> list = bll.t_PM_Order.Where(o => o.UserName == UserName).ToList();
                    if (OrderState > 0)
                    {
                        if (OrderState == 1)//未完成
                            list = list.Where(o => o.OrderState == OrderState || o.OrderState == 0).ToList();
                        else//2 已完成
                            list = list.Where(o => o.OrderState == OrderState).ToList();
                    }
                    list = list.OrderByDescending(o => o.OrderID).ToList();
                    strJson = Common.JsonDataList(list);
                }
            }
            return Content(strJson);
        }
        /// <summary>
        /// 保存工单信息
        /// </summary>
        /// <param name="order">工单详情</param>
        /// <returns></returns>
        public ActionResult SaveOrderInfo(t_PM_Order order)
        {
            string result = "成功";
            string sessionid = "";
            if (Request.Cookies["sid"] != null)//如果没有
            {
                sessionid = Request.Cookies["sid"].Value;
                if (Session[sessionid] != null)
                {
                    try
                    {
                        List<t_PM_Order> list = bll.t_PM_Order.Where(o => o.OrderID == order.OrderID).ToList();
                        if (list.Count > 0)
                        {
                            t_PM_Order orderinfo = list[0];
                            orderinfo.IsQualified = order.IsQualified;
                            orderinfo.CheckDate = DateTime.Now;
                            orderinfo.Rectification = order.Rectification;
                            orderinfo.CheckInfo = order.CheckInfo;
                            orderinfo.OrderState = 2;//1未处理，2处理完成
                            orderinfo.Latitude = order.Latitude;
                            orderinfo.Longtitude = order.Longtitude;
                            orderinfo.Currentplace = order.Currentplace;
                            bll.ObjectStateManager.ChangeObjectState(orderinfo, EntityState.Modified);
                            bll.SaveChanges();
                        }
                        else
                            result = "源工单不存在！";
                    }
                    catch (Exception ex)
                    {
                        result = ex.ToString();
                    }
                }
                else
                    result = "未登录";
            }
            else
                result = "未登录";
            return Content(result);
        }
        #endregion


        [Login]
        public ActionResult LoadOrder(int OrderID)
        {
            string strJson = "error";

            t_PM_Order order = bll.t_PM_Order.Where(o => o.OrderID == OrderID).First();
            if (order != null)
            {
                strJson = JsonConvert.SerializeObject(order);
            }
            return Content(strJson);
        }
        [Login]
        public ActionResult LoadOrderByCtrOrderId(int CtrOrderId)
        {
            string strJson = "error";

            string sql = "SELECT t_CM_CstrOrder.*,t_CM_ConstractInfo.*,t_CM_Constract.*,t_CM_UserInfo.* FROM t_CM_CstrOrder,t_CM_ConstractInfo,t_CM_Constract,t_CM_UserInfo WHERE t_CM_CstrOrder.id=" + CtrOrderId + " AND t_CM_ConstractInfo.id=t_CM_CstrOrder.CtrInfoId AND t_CM_Constract.id=t_CM_CstrOrder.CtrId AND t_CM_UserInfo.UserName=t_CM_Constract.person";

            List<CstrtOrderInfo> list = bll.ExecuteStoreQuery<CstrtOrderInfo>(sql).ToList();
            if (list != null && list.Count > 0)
            {
                strJson = JsonConvert.SerializeObject(list.First());
            }
            return Content(strJson);
        }
        [Login]
        public ActionResult OrderInfoList(int rows, int page, string ocontent = "", string uname = "", string otype = "0", int pid = 0, string sort = "OrderID", string order = "asc")
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string strsql = "select * from t_PM_Order where 1=1";
                string strquery = "";
                if (pid > 0)
                    strquery += " and pid=" + pid;
                else
                    strquery += " and pid in (" + pdrlist + ")";
                if (!ocontent.Equals(""))
                    strquery += " and OrderContent like '%" + ocontent + "%'";
                if (!uname.Equals(""))
                    strquery += " and UserName like '%" + uname + "%'";
                if (!otype.Equals("0"))
                    strquery += " and OrderType = '" + otype + "'";
                strsql = strsql + strquery + " order by " + sort + " " + order;

                List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(strsql).OrderByDescending(r => r.CreateDate).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        public ActionResult orderListJson(int pid = 0)
        {
            try
            {
                //string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string strsql = "select * from t_PM_Order where 1=1";
                string strquery = "";
                if (pid > 0)
                    strquery += " and pid=" + pid;
                else
                    strquery += " and pid in (" + pdrlist + ")";
                strsql = strsql + strquery;

                List<t_PM_Order> list = bll.ExecuteStoreQuery<t_PM_Order>(strsql).OrderByDescending(r => r.CreateDate).ToList();
                string strJson = JsonConvert.SerializeObject(list);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        public ActionResult orderCount(int pid = 0)
        {
            try
            {
                //string pdrlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                string strsql = "select * from t_PM_Order where 1=1";
                string strquery = "";
                if (pid > 0)
                    strquery += " and pid=" + pid;
                else
                    strquery += " and pid in (" + pdrlist + ")";
                strsql = strsql + strquery;
                strsql += " and OrderState=0";
                int count= bll.ExecuteStoreQuery<t_PM_Order>(strsql).Count();
                //string strJson = JsonConvert.SerializeObject(list);
                return Json(count,JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        private static object GetPropertyValue(object obj, string property)
        {
            System.Reflection.PropertyInfo propertyInfo = obj.GetType().GetProperty(property);
            return propertyInfo.GetValue(obj, null);
        }
        [Login]
        public ActionResult DeleteOrderInfo(string orderid)
        {
            string result = "OK";
            try
            {
                //删除文件
                List<t_cm_files> list = fm.FileList("order", orderid);
                string id = "", filepath = "";
                if (list.Count > 0)
                {
                    foreach (t_cm_files file in list)
                    {
                        id = id + file.ID + ",";
                        //删除文件
                        filepath = Server.MapPath(file.FilePath);
                        DirectoryUtil.DeleteFile(filepath);
                    }
                    id = id.TrimEnd(',');
                    //删除资料表信息
                    fm.DeleteFile(id);
                }
                //删除工单
                string strsql = "delete from t_PM_Order where OrderID in (" + orderid + ")";
                int docount = bll.ExecuteStoreCommand(strsql, null);
                Common.InsertLog("工单管理", CurrentUser.UserName, "删除工单信息[" + orderid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        //保存工单
        [ValidateInput(false)]
        [Login]
        public ActionResult SaveOrder(t_PM_Order order, FormCollection collection)
        {
            //string content = collection["OrderContent"].ToString();
            string result = "OK";
            try
            {
                if (order.OrderID > 0)
                {
                    t_PM_Order orderinfo = bll.t_PM_Order.Where(o => o.OrderID == order.OrderID).First();
                    orderinfo.OrderContent = Common.ReplaceEnter(order.OrderContent);
                    orderinfo.OrderNO = order.OrderNO;
                    orderinfo.PID = order.PID;
                    orderinfo.PlanDate = order.PlanDate;
                    orderinfo.PName = order.PName;
                    orderinfo.Priority = order.Priority;
                    orderinfo.Remarks = Common.ReplaceEnter(order.Remarks);
                    orderinfo.UserID = order.UserID;
                    orderinfo.OrderState = 0;
                    if (orderinfo.UserName != order.UserName)
                    {
                        UtilsSms.smsOrderCancel(orderinfo.UserName, orderinfo.OrderName, bll);
                    }
                    orderinfo.UserName = order.UserName;
                    orderinfo.BugID = order.BugID;
                    orderinfo.BugInfo = order.BugInfo;
                    orderinfo.OrderType = order.OrderType;
                    orderinfo.OrderName = order.OrderName;
                    orderinfo.DressCodeID = order.DressCodeID;
                    bll.ObjectStateManager.ChangeObjectState(orderinfo, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("工单管理", CurrentUser.UserName, "编辑工单信息[" + order.OrderNO + "]");//log
                }
                else
                {
                    order.OrderState = 0;//0待接收 1已受理 2已完成
                    order.IsQualified = -1;//-1 未检查 0不合格 1合格
                    order.CreateDate = DateTime.Now;
                    order.Creater = CurrentUser.UserName;
                    order.OrderContent = order.OrderContent.Replace("\n", "<br>");


                    int iOrderTypeId = 1;
                    if (order.OrderType.Equals("日常巡检")) iOrderTypeId = 3;
                    if (order.OrderType.Equals("检修试验")) iOrderTypeId = 2;
                    if (order.OrderType.Equals("应急抢修")) iOrderTypeId = 1;

                    order.OrderTypeId = iOrderTypeId;

                    bll.t_PM_Order.AddObject(order);
                    bll.SaveChanges();
                    Common.InsertLog("工单管理", CurrentUser.UserName, "新增工单信息[" + order.OrderNO + "]");//log
                }
                //发送短信；
                UtilsSms.smsOrderAdd(order.UserName, order.OrderName, bll);
                Console.WriteLine(result);
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }

        //保存带运维项的工单
        [ValidateInput(false)]
        [Login]
        public ActionResult SaveOrder_templateList(int CtrOrderId, t_PM_Order order, FormCollection collection)
        {
            //string content = collection["OrderContent"].ToString();
            string result = "OK";
            try
            {
                if (order.OrderID > 0)
                {
                    t_PM_Order orderinfo = bll.t_PM_Order.Where(o => o.OrderID == order.OrderID).First();
                    orderinfo.OrderContent = Common.ReplaceEnter(order.OrderContent);
                    orderinfo.OrderNO = order.OrderNO;
                    orderinfo.PID = order.PID;
                    orderinfo.PlanDate = order.PlanDate;
                    orderinfo.CtrPlanDate = order.CtrPlanDate;
                    orderinfo.PName = order.PName;
                    orderinfo.Priority = order.Priority;
                    orderinfo.Remarks = Common.ReplaceEnter(order.Remarks);
                    orderinfo.UserID = order.UserID;
                    orderinfo.OrderState = 0;
                    if (orderinfo.UserName != order.UserName)
                    {
                        UtilsSms.smsOrderCancel(orderinfo.UserName, orderinfo.OrderName, bll);
                    }
                    orderinfo.UserName = order.UserName;
                    orderinfo.BugID = order.BugID;
                    orderinfo.BugInfo = order.BugInfo;
                    orderinfo.OrderType = order.OrderType;
                    orderinfo.OrderName = order.OrderName;
                    orderinfo.DressCodeID = order.DressCodeID;
                    bll.ObjectStateManager.ChangeObjectState(orderinfo, EntityState.Modified);
                    bll.SaveChanges();
                    //发送短信；
                    UtilsSms.smsOrderAdd(order.UserName, order.OrderName, bll);
                    //
                    if (orderinfo.sTemplateIDs != order.sTemplateIDs || orderinfo.sTemplateCount != order.sTemplateCount)
                    {
                        //delete date
                        //删除工单
                        string strsql = "delete from t_PM_Order_Info where OrderID = " + order.OrderID;
                        int docount = bll.ExecuteStoreCommand(strsql, null);
                        //
                        if (!string.IsNullOrEmpty(order.sTemplateIDs) && !string.IsNullOrEmpty(order.sTemplateCount))
                        {
                            string[] sTemplateIDsArry = order.sTemplateIDs.Split(',');
                            string[] sTemplateCountArry = order.sTemplateCount.Split(',');
                            if (sTemplateIDsArry.Length > 0 && sTemplateIDsArry.Length == sTemplateCountArry.Length)
                            {
                                for (int i = 0; i < sTemplateIDsArry.Length; i++)
                                {
                                    //result = DeleteInfo(int.Parse(sTemplateIDsArry[i].Trim()));
                                    t_PM_Order_Info Order_Info = new t_PM_Order_Info();
                                    Order_Info.orderId = order.OrderID;
                                    Order_Info.templateId = int.Parse((sTemplateIDsArry[i]));
                                    Order_Info.deviceCount = int.Parse((sTemplateCountArry[i]));
                                    Order_Info.unCount = Order_Info.deviceCount;

                                    bll.t_PM_Order_Info.AddObject(Order_Info);
                                    bll.SaveChanges();
                                }
                            }
                        }
                    }

                    Common.InsertLog("工单管理", CurrentUser.UserName, "编辑工单信息[" + order.OrderNO + "]");//log
                }
                else
                {
                    order.OrderState = 0;//0待接收 1已受理 2已完成
                    order.IsQualified = -1;//-1 未检查 0不合格 1合格
                    order.CreateDate = DateTime.Now;
                    order.Creater = CurrentUser.UserName;
                    order.OrderContent = order.OrderContent.Replace("\n", "<br>");


                    int iOrderTypeId = 1;
                    if (order.OrderType.Equals("日常巡检")) iOrderTypeId = 3;
                    if (order.OrderType.Equals("检修试验")) iOrderTypeId = 2;
                    if (order.OrderType.Equals("应急抢修")) iOrderTypeId = 1;

                    order.OrderTypeId = iOrderTypeId;

                    bll.t_PM_Order.AddObject(order);
                    bll.SaveChanges();
                    if (CtrOrderId > 0)
                    {
                        t_PM_Order order2 = bll.t_PM_Order.ToList().Last();
                        updateCstrOrder(CtrOrderId, order2.OrderID);
                    }

                    if (!string.IsNullOrEmpty(order.sTemplateIDs) && !string.IsNullOrEmpty(order.sTemplateCount))
                    {
                        string[] sTemplateIDsArry = order.sTemplateIDs.Split(',');
                        string[] sTemplateCountArry = order.sTemplateCount.Split(',');
                        if (sTemplateIDsArry.Length > 0 && sTemplateIDsArry.Length == sTemplateCountArry.Length)
                        {
                            t_PM_Order orderNew = null;
                            List<t_PM_Order> list = bll.t_PM_Order.Where(o => o.OrderNO == order.OrderNO).ToList();
                            if (list.Count > 0)
                            {
                                orderNew = list[0];
                                if (orderNew == null)
                                {
                                    return Content("添加工单错误！");
                                }
                                for (int i = 0; i < sTemplateIDsArry.Length; i++)
                                {
                                    //result = DeleteInfo(int.Parse(sTemplateIDsArry[i].Trim()));
                                    t_PM_Order_Info Order_Info = new t_PM_Order_Info();
                                    Order_Info.orderId = orderNew.OrderID;
                                    Order_Info.templateId = int.Parse((sTemplateIDsArry[i]));
                                    Order_Info.deviceCount = int.Parse((sTemplateCountArry[i]));
                                    Order_Info.unCount = Order_Info.deviceCount;

                                    bll.t_PM_Order_Info.AddObject(Order_Info);
                                    bll.SaveChanges();
                                }
                            }
                        }
                    }

                    Common.InsertLog("工单管理", CurrentUser.UserName, "新增工单信息[" + order.OrderNO + "]");//log
                    //发送短信；
                    UtilsSms.smsOrderAdd(order.UserName, order.OrderName, bll);
                    Console.WriteLine(result);
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }

        private void updateCstrOrder(int CtrOrderId, int orderId)
        {
            if (CtrOrderId > 0)
            {
                string sql = "UPDATE t_CM_CstrOrder SET OrderId=" + orderId + " WHERE id=" + CtrOrderId;
                bll.ExecuteStoreCommand(sql);
            }
        }

        private string getPriority(int Priority)
        {
            string result = "一般";
            switch (Priority)
            {
                case 1:
                    result = "一般";
                    break;
                case 2:
                    result = "<b style='color:orange'> 高 </b>";
                    break;
                case 3:
                    result = "<b style='color:red'> 很高 </b>";
                    break;
            }
            return result;
        }
        private string isQualified(int? isok, string rect)
        {
            string result = "";
            if (isok != null)
            {
                if (isok == 0)
                {
                    result = "<td class=\"d_l_d\" colspan=\"5\" style=\"color: Red; font-weight: bold;\">作业未完成</td></tr>" +
                        "<tr><td class=\"d_l_t\">整改措施：</td><td class=\"d_l_d\" colspan=\"5\" style=\"color: Green;\">" +
                        rect + "</td></tr>";
                }
                else
                    result = "<td class=\"d_l_d\" colspan=\"5\" style=\"color: Green; font-weight: bold;\">作业已完成</td></tr>";
            }
            else
                result = "<td class=\"d_l_d\" colspan=\"5\"></td></tr>";
            return result;
        }
        //获取工单详情
        [Login]
        public ActionResult getOrderDetail(int orderid)
        {
            string strJson = "";
            try
            {
                StringBuilder sbOrder = new StringBuilder();
                List<t_PM_Order> list = bll.t_PM_Order.Where(o => o.OrderID == orderid).ToList();
                if (list.Count > 0)
                {
                    t_PM_Order order = list[0];
                    sbOrder.Append("<table cellpadding=\"\" cellspacing=\"\" border=\"0\" class=\"d_list\" style=\"font-size: 12px;\">");
                    sbOrder.Append("<tr><td class=\"d_l_t\"=>工单名称</td><td class=\"d_l_d\">");
                    sbOrder.Append(order.OrderName + "</td><td class=\"d_l_t\">站室</td><td class=\"d_l_d\">");
                    sbOrder.Append(order.PName + "</td><td class=\"d_l_t\" >优先级</td><td class=\"d_l_d\" >");
                    sbOrder.Append(getPriority((int)order.Priority));
                    sbOrder.Append("</td></tr>");
                    sbOrder.Append("<tr><td class=\"d_l_t\">关联隐患</td><td class=\"d_l_d\">" + order.BugInfo + "</td><td class=\"d_l_t\">工单类型</td><td class=\"d_l_d\">" + order.OrderType + "</td><td class=\"d_l_t\">派单人</td><td class=\"d_l_d\">" + order.Creater + "</td></tr>");
                    sbOrder.Append("<tr><td class=\"d_l_t\">派单时间</td><td class=\"d_l_d\">" + order.CreateDate + "</td><td class=\"d_l_t\">接收时间</td><td class=\"d_l_d\">" + order.AcceptedDate + "</td><td class=\"d_l_t\">到场时间</td><td class=\"d_l_d\">" + order.FistDate + "</td></tr>");

                    sbOrder.Append("<tr><td class=\"d_l_t\">检查人</td><td class=\"d_l_d\">");
                    sbOrder.Append(order.UserName);
                    sbOrder.Append("</td><td class=\"d_l_t\">执行日期</td><td class=\"d_l_d\">");
                    sbOrder.Append(order.PlanDate == null ? "" : Convert.ToDateTime(order.PlanDate).ToString("yyyy-MM-dd"));
                    sbOrder.Append(" </td><td class=\"d_l_t\">完成日期</td><td class=\"d_l_d\">");
                    sbOrder.Append(order.CheckDate == null ? "" : Convert.ToDateTime(order.CheckDate).ToString("yyyy-MM-dd"));
                    sbOrder.Append("</td></tr><tr><td class=\"d_l_t\">工单内容</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(order.OrderContent);
                    if (order.RejectReason != null && order.OrderState == 5)
                    {
                        sbOrder.Append("</td></tr><tr><td class=\"d_l_t\">工单状态</td><td class=\"d_l_d\" colspan=\"5\">");
                        sbOrder.Append("<b style='color:red;'>已被拒绝，请及时处理！" + "</b>" + " 拒绝理由：" + order.RejectReason);
                    }

                    sbOrder.Append("</td></tr><tr><td class=\"d_l_t\">进场申请</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append("申请图片：" + getOrderFile(orderid, "image", "Apply"));
                    sbOrder.Append("<br>申请说明：" + order.ApplyInfo);
                    sbOrder.Append("<br>申请时间：" + order.ApplyDate);

                    sbOrder.Append(order.OrderState != 2 ? "" : "<br><div style=\"height:10px\"></div><a href=\"#\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-cancel'\" onclick=\"ApplyEnter('" + orderid.ToString() + "');\">点击这里【批准进场】</a><br><div style=\"height:10px\"></div><a href=\"#\" class=\"easyui-linkbutton\" data-options=\"iconCls:'icon-cancel'\" onclick=\"rejectEnter('" + orderid.ToString() + "');\">点击这里【不准进场】</a><input id=\"reason\" style=\"width: 98%\" type=\"text\" placeholder=\"请输入拒绝原因\"><div id=\"ApplyEnterInfo\"></div><div id=\"rejectEnterInfo\"></div>");
                    sbOrder.Append("</td></tr><tr><td class=\"d_l_t\">完成情况</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(order.CheckInfo);
                    sbOrder.Append("</td></tr><tr><td class=\"d_l_t\">图像列表</td><td class=\"d_l_d\" colspan=\"5\">");
                    //图片列表
                    sbOrder.Append(getOrderFile(orderid, "image", "order"));
                    sbOrder.Append("</td></tr>");
                    //音频
                    sbOrder.Append("<tr><td class=\"d_l_t\">音频列表</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(getOrderFile(orderid, "voice", "order"));
                    sbOrder.Append("</td></tr>");
                    //视频
                    sbOrder.Append("<tr><td class=\"d_l_t\">视频列表</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(getOrderFile(orderid, "infrared", "order"));
                    sbOrder.Append("</td></tr>");
                    if (order.CheckDate != null)
                    {
                        sbOrder.Append("<tr><td class=\"d_l_t\">处理结果</td>");
                        sbOrder.Append(isQualified(order.IsQualified, order.Rectification));
                    }
                    sbOrder.Append("<tr><td class=\"d_l_t\">备注</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(order.Remarks + "</td></tr>");

                    sbOrder.Append("<tr><td class=\"d_l_t\">工单报告</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(getOrderFile(orderid, "doc", "order") + "</td></tr>");

                    sbOrder.Append("<tr><td class=\"d_l_t\">格式报告</td><td class=\"d_l_d\" colspan=\"5\">");
                    sbOrder.Append(getOrderFile(orderid, "doc", "report") + "</td></tr></table>");


                    strJson = sbOrder.ToString();
                }
            }
            catch (Exception ex)
            {
                strJson = "";
            }

            return Content(strJson);
        }

        public ActionResult ApplyEnter(int orderid)
        {
            string strJson = "<b style='color:red;'>已批准</b>";
            try
            {
                List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + orderid).ToList();
                if (sss != null && sss.Count > 0)
                {
                    if (sss.First().OrderState == 2)
                        bll.ExecuteStoreCommand("UPDATE t_PM_Order SET OrderState=3,PermitDate='" + DateTime.Now.ToString("yyyy-MM-dd HH:mm") + "' WHERE OrderID=" + orderid);
                    else if (sss.First().OrderState < 2)
                        strJson = "<b style='color:red;'>暂未申请</b>";
                    else if (sss.First().OrderState > 2)
                        strJson = "<b style='color:red;'>已批准</b>";
                }
            }
            catch (Exception ex)
            {
                strJson = "批准未成功，请联系管理员";
            }
            return Content(strJson);
        }

        public ActionResult rejectEnter(int orderid, string rejectReason)
        {
            string strJson = "<b style='color:red;'>未批准</b>";
            try
            {
                List<t_PM_Order> sss = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM [t_PM_Order] WHERE OrderID=" + orderid).ToList();
                if (sss != null && sss.Count > 0)
                {
                    if (sss.First().OrderState == 2)
                        bll.ExecuteStoreCommand("UPDATE t_PM_Order SET OrderState=-1,RejectReason='" + rejectReason + "' WHERE OrderID=" + orderid);
                    else if (sss.First().OrderState < 2)
                        strJson = "<b style='color:red;'>暂未申请</b>";
                    else if (sss.First().OrderState > 2)
                        strJson = "<b style='color:red;'>未通过批准</b>";
                }
            }
            catch (Exception ex)
            {
                strJson = "操作未成功，请联系管理员";
            }
            return Content(strJson);
        }

        //获取工单资料信息
        private string getOrderFile(int orderid, string filetype, string module = "order")
        {
            List<t_cm_files> list = bll.t_cm_files.Where(f => f.Modules == module && f.Fk_ID == orderid && f.FileType == filetype).ToList();
            StringBuilder sbphoto = new StringBuilder();
            if (list.Count > 0)
            {
                int count = 1;
                string name = Dns.GetHostName();
                string MyUrl = HttpContext.Request.UrlReferrer.Authority.ToString();
                list.ForEach(p =>
                {
                    //图片
                    if (filetype.Equals("image"))
                    {
                        sbphoto.Append(string.Concat(new object[]
                        {
                        "<a onclick=\"ShowImage('"+p.FilePath.Replace("~","")+"','"+p.ID+"','"+p.Fk_ID+"','"+module+"')\" href=\"#\">",
                        "<img src=\"" + p.FilePath.Replace("~","") + "\" width='30px' height='30px' alt=\"\" border='0'/>",
                        "</a>"
                        }));
                    }
                    //音频
                    else if (filetype.Equals("voice"))
                    {
                        sbphoto.Append("<audio src=\"" + p.FilePath.Replace("~", "") + "\" controls=\"controls\"></audio>");
                    }
                    //视频
                    else if (filetype.Equals("infrared"))
                    {
                        sbphoto.Append("<img src=\"../content/images/videoicon.png\" width=\"25px\" height=\"25px\" onclick = Full(\"" + p.FilePath.Replace("~", "") + "\")>");
                    }
                    //doc
                    else if (filetype.Equals("doc"))
                    {
                        if (count > 1)
                        {
                            sbphoto.Append("<br/>");
                        }
                        sbphoto.Append("<a href=\"" + p.FilePath.Replace("~", "") + "\" target=\"blank\">" + p.FileName + "......下载 </a>");
                    }
                    count++;
                });


                return sbphoto.ToString();
            }
            else
            {
                string strnothing = "暂无图片信息";
                if (filetype.Equals("image"))
                    strnothing = "暂无图片信息";
                else if (filetype.Equals("voice"))
                    strnothing = "暂无音频信息";
                else if (filetype.Equals("infrared"))
                    strnothing = "暂无视频信息";
                else if (filetype.Equals("doc"))
                    strnothing = "暂无报告信息";
                return strnothing;
            }
        }
        //获取工单图片列表
        [Login]
        public ActionResult GetOrderInfoImage(int id, int orderid, string module = "order")
        {
            List<t_cm_files> list = bll.t_cm_files.Where(p => p.ID != id && p.Modules == module && p.FileType == "image" && p.Fk_ID == orderid).ToList();
            string strjson = "";
            if (list.Count > 0)
            {
                foreach (t_cm_files model in list)
                {
                    strjson += "<li><img src=\"" + model.FilePath.Replace("~", "") + "\" alt=\"\" /></li>";
                }
            }
            return Content(strjson);
        }


        private string getFileIcon(string filename)
        {
            string fileExtension = "jpeg";
            if (!filename.Equals(""))
            {
                fileExtension = filename.Substring(filename.LastIndexOf(".") + 1);
            }
            fileExtension = fileExtension.Replace("jpg", "jpeg");
            return "<img src=\"/Content/Images/fileType/" + fileExtension + "_24.png\" />";
        }
        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}


        public class OrderSelTemplateCls
        {
            public int 项编号 { set; get; }
            public string 项名称 { set; get; }
            public int 项数量 { set; get; }
        }
        /// <summary>
        /// 得到工单详细报告项
        /// </summary>
        /// <param name="OrderID"></param>
        /// <returns></returns>
        public ActionResult getOrder_Info(int OrderID)
        {


            string strJson = "";
            try
            {

                string sql = "select distinct b.templateId as 项编号,b.templateName as 项名称,a.deviceCount as 项数量 from t_PM_Order_Info a,t_PM_Order_Template b where a.templateId = b.templateId and a.orderId = " + OrderID.ToString();
                List<OrderSelTemplateCls> list = bll.ExecuteStoreQuery<OrderSelTemplateCls>(sql).ToList();


                if (list != null)
                {
                    strJson = Common.ComboboxToJson(list);
                }

            }
            catch (Exception ex)
            {
                //strJson = ex.ToString();
            }
            return Content(strJson);
        }

        [Login]
        public JsonResult GetOrderListData(int PID = 0, int orderState = 1)
        {
            if (CurrentUser == null)
                return new JsonResult();

            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string strsql = "select top 6 * from t_PM_Order where 1=1";
            string strquery = "";
            if (PID > 0)
                strquery += " and pid=" + PID;
            else
            {
                if (!string.IsNullOrEmpty(pdrlist))
                    strquery += " and pid in (" + pdrlist + ")";
            }

            //orderState = 2 有工单申请进场+拒绝,需要提示，报警            
            strquery += " and (OrderState=2 or OrderState=5 or OrderState=0)";
            //if (orderState > 0)
            //    strquery += " and OrderState=" + orderState;

            //orderState = 2 申请工单情况

            strsql = strsql + strquery + "order by CreateDate desc";

            List<string> text = new List<string>();

            List<int> listInt = bll.ExecuteStoreQuery<int>("select count(*) from t_PM_Order where 1=1 " + strquery).ToList();
            if (listInt.Count > 0)
            {
                if (0 < listInt[0])
                    text.Add("<span class=\"am-badge am-badge-success am-round item-feed-badge\" id=\"orderNum\">" + listInt[0] + "</span>");

                List<t_PM_Order> Blist = bll.ExecuteStoreQuery<t_PM_Order>(strsql).ToList();
                //string strJson = Common.List2Json(Blist, rows, page);
                if (Blist.Count > 0)
                {

                    string val = string.Empty;
                    StringBuilder itemInf = new StringBuilder();

                    string inf = string.Empty;
                    string time = string.Empty;
                    TimeSpan ts = new TimeSpan();
                    string sOrderStateInfo = "";
                    foreach (var item in Blist)
                    {
                        itemInf.Clear();
                        inf = item.PName + "/" + item.OrderName + "/<br>到场时间：" + item.FistDate + "/<br>当前位置：" + item.Currentplace;

                        itemInf.Append("<li class=\"tpl-dropdown-menu-messages order-app-add\">");
                        itemInf.Append("<a href=\"/Orderinfo/OrderList\" target=\"main_frame\" class=\"tpl-dropdown-menu-messages-item am-cf\">");
                        itemInf.Append("<div class=\"menu-messages-ico\" style=\"width:auto;height:auto;\">");
                        //itemInf.Append("<img src=\"../Content/images/unknown_user.png\" alt=\"\">");
                        itemInf.Append(" <i class=\"am-icon-circle-o am-text-success\"></i>");
                        itemInf.Append("</div>");
                        itemInf.Append("<div class=\"menu-messages-time\" style=\"width:auto;margin-left:auto;\">");

                        if (item.OrderState == 0)
                            sOrderStateInfo = "工单未接收";
                        if (item.OrderState == 2)
                            sOrderStateInfo = "申请进场中";

                        if (item.FistDate == null)
                        {
                            time = "";
                        }
                        else
                        {
                            ts = DateTime.Now - (DateTime)item.FistDate;
                            if ((int)ts.TotalHours > 0)
                            {
                                time = (int)ts.TotalHours + "小时前";
                            }
                            else
                            {
                                time = (int)ts.TotalMinutes + "分钟前";
                            }
                        }


                        itemInf.Append(time);
                        itemInf.Append("</div>");
                        itemInf.Append("<div class=\"menu-messages-content\" style=\"margin-left:22px;margin-right:auto;\">");
                        itemInf.Append("<div class=\"menu-messages-content-title\">");
                        //itemInf.Append(" <i class=\"am-icon-circle-o am-text-success\"></i>");                                               

                        itemInf.Append("<span>" + sOrderStateInfo + "：" + item.UserName + "</span>");
                        itemInf.Append("</div>");
                        itemInf.Append("<div class=\"am-text-truncate\" style=\"overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:240px; \">" + inf + "</div>");
                        if (null == item.PlanDate)
                        {
                            time = "--:--";
                        }
                        else
                        {
                            time = ((DateTime)item.PlanDate).ToString("yyyy-MM-dd HH:mm");
                        }
                        itemInf.Append("<div class=\"menu-messages-content-time\">" + time + "</div>");
                        itemInf.Append("</div>");
                        itemInf.Append("</a>");
                        itemInf.Append("</li>");

                        val += itemInf;

                    }
                    text.Add(val);
                }
                Blist.Clear();
                Blist = null;
            }
            var result = new JsonResult();
            result.Data = text;
            result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            return result;
        }
    }
}
