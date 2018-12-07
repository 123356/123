using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using YWWeb.PubClass;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.IO.Compression;
using System.Text.RegularExpressions;

namespace YWWeb.Controllers
{
    public class PerationMaintenanceController : Controller
    {
        //
        // GET: /PerationMaintenance/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();

        public ActionResult Index()//运维
        {
            return View();
        }
        public ActionResult EquipmentLedger()//运维-台账-设备台账
        {
            return View();
        }
        public ActionResult StandingFile()//运维-台账-站室档案
        {
            return View();
        }
        public ActionResult HazardMan()//运维-台账-隐患管理
        {
            return View();
        }
        public ActionResult AnnualTask()//运维-工单-年度任务
        {
            return View();
        }
        public ActionResult StaffManage()//运维-档案-人员管理
        {
            return View();
        }
        public ActionResult PersonnelMag()//运维-人员管理
        {
            return View();
        }
        public ActionResult ContractMag()//运维-合同管理
        {
            return View();
        }
        public ActionResult CtrContMag()//运维-运维内容；
        {
            return View();
        }
        public ActionResult SparepartsMag()//运维-备件管理
        {
            return View();
        }
        public ActionResult Supplier()//运维-供应商
        {
            return View();
        }
        public ActionResult HazardManDetail()//运维-隐患详情
        {
            return View();
        }

        #region 人员管理-发送短信

        public ActionResult InsertMsg(string Mbno, string SendTime, string Msg)//运维-档案-人员管理-发送短信
        {
            string result = "";
            try
            {
                if (SendTime.Equals(""))
                    SendTime = DateTime.Now.ToString();
                if (!Mbno.Equals("") && !Msg.Equals(""))
                {
                    string[] Mlist = Mbno.Split(',');
                    if (Mlist.Length > 0)
                    {
                        for (int i = 0; i < Mlist.Length; i++)
                        {
                            UtilsSms.smsContent(Mlist[i], Msg);
                        }
                    }
                    result = "OK";
                }
                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        /// <summary>  
        /// 指定Post地址使用Get 方式获取全部字符串  
        /// </summary>  
        /// <param name="url">请求后台地址</param>  
        /// <param name="content">Post提交数据内容(utf-8编码的)</param>  
        /// <returns></returns>  
        public static string HttpPost(string url, string content)
        {
            string result = "";
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = "POST";
            req.ContentType = "application/x-www-form-urlencoded";

            #region 添加Post 参数
            byte[] data = Encoding.UTF8.GetBytes(content);
            req.ContentLength = data.Length;
            using (Stream reqStream = req.GetRequestStream())
            {
                reqStream.Write(data, 0, data.Length);
                reqStream.Close();
            }
            #endregion

            HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
            Stream stream = resp.GetResponseStream();
            //获取响应内容  
            using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
            {
                result = reader.ReadToEnd();
            }
            return result;
        }

        private static readonly string DefaultUserAgent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)";
        private static bool CheckValidationResult(object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors errors)
        {
            return true; //总是接受     
        }
        public static HttpWebResponse CreatePostHttpResponse(string url, IDictionary<string, string> parameters, Encoding charset)
        {
            HttpWebRequest request = null;
            //HTTPSQ请求  
            ServicePointManager.ServerCertificateValidationCallback = new RemoteCertificateValidationCallback(CheckValidationResult);
            request = WebRequest.Create(url) as HttpWebRequest;
            request.ProtocolVersion = HttpVersion.Version10;
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.UserAgent = DefaultUserAgent;
            //如果需要POST数据     
            if (!(parameters == null || parameters.Count == 0))
            {
                StringBuilder buffer = new StringBuilder();
                int i = 0;
                foreach (string key in parameters.Keys)
                {
                    if (i > 0)
                    {
                        buffer.AppendFormat("&{0}={1}", key, parameters[key]);
                    }
                    else
                    {
                        buffer.AppendFormat("{0}={1}", key, parameters[key]);
                    }
                    i++;
                }
                byte[] data = charset.GetBytes(buffer.ToString());
                using (Stream stream = request.GetRequestStream())
                {
                    stream.Write(data, 0, data.Length);
                }
            }
            return request.GetResponse() as HttpWebResponse;
        }
        #endregion

        #region 隐患管理

        //获取隐患信息
        [Login]
        public ActionResult BugListData(int rows, int page, int PID = 0, int DID = 0, string HandeSituation = "", string StartReportDate = "", string EndReportDate = "")
        {

            DateTime startdate = !string.IsNullOrWhiteSpace(StartReportDate) ? Convert.ToDateTime(StartReportDate) : DateTime.MinValue;
            DateTime enddate = !string.IsNullOrWhiteSpace(EndReportDate) ? Convert.ToDateTime(EndReportDate) : DateTime.MinValue;

            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string strsql = "select * from t_CM_BugInfo where 1=1";
            string strquery = "";
            if (PID > 0)
                strquery += " and pid=" + PID;
            else
                strquery += " and pid in (" + pdrlist + ")";
            if (DID > 0)
                strquery += " and did=" + DID;
            if (HandeSituation.Equals("2"))
                strquery += " and (HandeSituation like '%检修%' or HandeSituation like '%巡视%')";
            else if (!HandeSituation.Equals(""))
                strquery += " and HandeSituation like '%" + HandeSituation + "%'";
            if (!StartReportDate.Equals(""))
                strquery += " and ReportDate > '" + StartReportDate + "'";
            if (!EndReportDate.Equals(""))
                strquery += " and ReportDate < '" + EndReportDate + "'";
            strsql = strsql + strquery;

            List<t_CM_BugInfo> Blist = bll.ExecuteStoreQuery<t_CM_BugInfo>(strsql).OrderByDescending(o => o.ReportDate).ToList();
            string strJson = Common.List2Json(Blist, rows, page);

            return Content(strJson);
        }

        //获取隐患详情
        [Login]
        public ActionResult GetHazardManDetail(int BugID)
        {
            string strJson = "";
            List<t_CM_BugInfo> list = bll.t_CM_BugInfo.Where(d => d.BugID == BugID).ToList();
            if (list.Count > 0)
            {
                t_CM_BugInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }

        //获取检查信息
        [Login]
        public ActionResult GetFiles(int FK_ID = 0)
        {
            string strsql = "select  * from t_cm_files where Modules='bug' and Fk_ID = " + FK_ID + " order by CommitTime desc";
            List<t_cm_files> list = bll.ExecuteStoreQuery<t_cm_files>(strsql).ToList();

            List<t_PM_Order> listOrder = bll.t_PM_Order.Where(p => p.BugID == FK_ID).ToList();
            if (listOrder.Count > 0)
            {
                string orders = "";
                foreach (t_PM_Order item in listOrder)
                {
                    orders += "," + item.OrderID;
                }
                strsql = "select  * from t_cm_files where  (Modules='bug' and Fk_ID = " + FK_ID + ") or ( Modules='order' and Fk_ID in (" + orders.Substring(1, orders.Length - 1) + "))order by CommitTime desc";
                list = bll.ExecuteStoreQuery<t_cm_files>(strsql).ToList();
                foreach (t_cm_files li in list)
                {
                    if (li.Modules == "order")
                    {
                        List<t_PM_Order> Order = listOrder.Where(p => p.OrderID == li.Fk_ID).ToList();
                        if (Order.Count > 0)
                        {
                            li.Remark = Order[0].Rectification;
                        }
                    }
                    else
                    {
                        li.Remark = listOrder[0].Rectification;
                    }
                }
            }
            else
            {
                foreach (t_cm_files li in list)
                    li.Remark = "未生成工单";
            }
            string strJson = Common.List2Json(list);
            return Content(strJson);
        }
        //获取相关工单
        [Login]
        public string GetOrders(int Bid)
        {
            string strJson = "";
            List<t_PM_Order> list = bll.t_PM_Order.Where(p => p.BugID == Bid).OrderByDescending(l => l.CreateDate).ToList();
            foreach (t_PM_Order o in list)
            {
                strJson += "{\"id\":" + o.OrderID + ",\"text\":\"" + o.CreateDate + "\"},";
            }
            strJson = "[" + strJson.TrimEnd(',') + "]";
            return strJson;
        }
        //根据编号获取附件
        public string GetFile(int FKid, string FKtype)
        {
            string strJson = "";
            string MyUrl = HttpContext.Request.UrlReferrer.Authority.ToString();
            List<t_cm_files> list = bll.t_cm_files.Where(p => p.Fk_ID == FKid && p.Modules.Contains(FKtype)).ToList();
            foreach (t_cm_files f in list)
            {
                strJson += "{\"FileType\":\"" + f.FileType + "\",\"FilePath\":\"" + f.FilePath.Replace("~", "http://" + MyUrl) + "\"},";
            }
            strJson = "[" + strJson.TrimEnd(',') + "]";
            return strJson;
        }
        //保存隐患信息
        [Login]
        public ActionResult SaveBugInfo(t_CM_BugInfo info)
        {
            string result = "OK";
            try
            {
                List<t_CM_BugInfo> list = bll.t_CM_BugInfo.Where(p => p.BugLocation == info.BugLocation && p.BugID != info.BugID).ToList();
                if (list.Count > 0)
                    result = "此隐患已存在，请重新录入！ ";
                else
                {
                    if (info.BugID > 0)
                    {
                        t_CM_BugInfo Bug = bll.t_CM_BugInfo.Where(r => r.BugID == info.BugID).First();
                        //Bug.PID = info.PID;
                        //Bug.PName = info.PName;
                        //Bug.DID = info.DID;
                        //Bug.DeviceName = info.DeviceName;
                        //Bug.BugLevel = info.BugLevel;
                        //Bug.BugLocation = info.BugLocation;
                        //Bug.BugDesc = info.BugDesc;
                        //Bug.ReportWay = info.ReportWay;

                        Bug.HandeSituation = info.HandeSituation;
                        //if (string.IsNullOrEmpty(Bug.UserName))
                        Bug.UserName = CurrentUser.UserName;
                        //if (Bug.HandleDate == null) 
                        Bug.HandleDate = DateTime.Now;

                        bll.ObjectStateManager.ChangeObjectState(Bug, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("隐患管理", CurrentUser.UserName, "编辑隐患信息[" + Bug.BugLocation + "]");
                        result = "OKedit";
                    }
                    else
                    {
                        info.ReportDate = DateTime.Now;
                        info.HandeSituation = "未审核";
                        info.ReportUser = CurrentUser.UserName;
                        bll.t_CM_BugInfo.AddObject(info);
                        bll.SaveChanges();
                        Common.InsertLog("隐患管理", CurrentUser.UserName, "新增隐患信息[" + info.BugLocation + "]");
                        result = "OKadd";
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }
        //删除隐患信息
        [Login]
        public ActionResult DeleteBugInfo(string bid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(bid.Split(',')).ConvertAll(i => int.Parse(i));
                var query = from model in bll.t_CM_BugInfo where resultlist.Contains(model.BugID) select model;
                List<t_CM_BugInfo> list = query.ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_BugInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("隐患管理", CurrentUser.UserName, "删除隐患信息[" + bid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

        /// <summary>
        /// 获取隐患信息（for web）
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <param name="PID"></param>
        /// <param name="DID"></param>
        /// <param name="HandeSituation"></param>
        /// <param name="StartReportDate"></param>
        /// <param name="EndReportDate"></param>
        /// <returns></returns>
        [Login]
        public JsonResult GetBugListData(int PID = 0, int DID = 0, string HandeSituation = "", string StartReportDate = "", string EndReportDate = "")
        {
            if (CurrentUser == null)
                return new JsonResult();

            DateTime startdate = !string.IsNullOrWhiteSpace(StartReportDate) ? Convert.ToDateTime(StartReportDate) : DateTime.MinValue;
            DateTime enddate = !string.IsNullOrWhiteSpace(EndReportDate) ? Convert.ToDateTime(EndReportDate) : DateTime.MinValue;

            //string pdrlist = CurrentUser.PDRList;

            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);



            string strsql = "select * from t_CM_BugInfo where 1=1";
            string strquery = "";
            if (PID > 0)
                strquery += " and pid=" + PID;
            else
            {
                if (!string.IsNullOrEmpty(pdrlist))
                    strquery += " and pid in (" + pdrlist + ")";
            }
            if (DID > 0)
                strquery += " and did=" + DID;
            if (HandeSituation.Equals("2"))
                strquery += " and (HandeSituation like '%检修%' or HandeSituation like '%巡视%')";
            else if (!HandeSituation.Equals(""))
                strquery += " and HandeSituation like '%" + HandeSituation + "%'";
            if (!StartReportDate.Equals(""))
                strquery += " and ReportDate > '" + StartReportDate + "'";
            if (!EndReportDate.Equals(""))
                strquery += " and ReportDate < '" + EndReportDate + "'";
            strsql = strsql + strquery;

            List<t_CM_BugInfo> Blist = bll.ExecuteStoreQuery<t_CM_BugInfo>(strsql).OrderByDescending(o => o.ReportDate).ToList();
            //string strJson = Common.List2Json(Blist, rows, page);
            List<string> text = new List<string>();
            if (Blist.Count > 0)
            {
                text.Add("<span class=\"am-badge am-badge-warning am-round item-feed-badge\" id=\"bugNum\">" + Blist.Count + "</span>");
                string val = string.Empty;
                string itemInf = string.Empty;
                int nCount = 0;
                string inf = string.Empty;
                string time = string.Empty;
                TimeSpan ts = new TimeSpan();
                foreach (var item in Blist)
                {
                    inf = item.PName + "/" + item.DeviceName + "/" + item.BugLocation + "  有隐患上报";
                    ts = DateTime.Now - (DateTime)item.ReportDate;
                    time = (int)ts.TotalHours + "小时" + ts.Minutes.ToString() + "分钟前";
                    itemInf = " <li class=\"tpl-dropdown-menu-notifications bug-dropdown\">" +
                        "<a title=\"" + inf + "\" href=\"/PerationMaintenance/HazardMan\"  target=\"main_frame\"  class=\"tpl-dropdown-menu-notifications-item am-cf\">" +
                        "<div class=\"tpl-dropdown-menu-notifications-title\"   style=\"overflow:hidden;text-overflow:ellipsis;white-space: nowrap;width:256px; \">" +
                        "   <i class=\"am-icon-star\"></i>" +
                        "  <span> " + inf + "</span>" +
                        "</div>" +
                        "<div class=\"tpl-dropdown-menu-notifications-time\" style=\"width:auto;margin-left:auto;\">" +
                        time +
                        "</div>" +
                        "</a></li>";

                    val += itemInf;
                    if (++nCount > 5)
                        break;
                }
                text.Add(val);
            }
            Blist.Clear();
            Blist = null;
            var result = new JsonResult();
            result.Data = text;
            result.JsonRequestBehavior = JsonRequestBehavior.AllowGet;

            return result;
        }
        #endregion

        #region 站室档案
        [Login]
        public ActionResult FileListData(int rows, int page, int PID = 0)
        {
            //string pdrlist = CurrentUser.PDRList;

            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string strsql = "select * from t_cm_files  where Modules='PDR'";
            string strquery = "";
            if (PID > 0)
                strquery += " and Fk_ID=" + PID;
            else
                strquery += " and Fk_ID in (" + pdrlist + ")";
            strsql = strsql + strquery;

            List<t_cm_files> Blist = bll.ExecuteStoreQuery<t_cm_files>(strsql).OrderByDescending(o => o.CommitTime).ToList();
            string strJson = Common.List2Json(Blist, rows, page);

            return Content(strJson);
        }

        //删除站室档案
        [Login]
        public ActionResult DeleteFilePDRInfo(string id)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(id.Split(',')).ConvertAll(i => int.Parse(i));
                var query = from model in bll.t_cm_files where resultlist.Contains(model.ID) select model;
                List<t_cm_files> list = query.ToList();
                list.ForEach(i =>
                {
                    bll.t_cm_files.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("站室档案管理", CurrentUser.UserName, "删除站室档案[" + id + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

        #endregion

        #region  文件的上传处理

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="folder"></param>
        /// <param name="pid">配电室编号</param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public ActionResult Upload(HttpPostedFileBase fileData, string folder, string ctype = "file", int pid = 1)
        {
            if (fileData != null)
            {
                try
                {
                    //备注
                    string Remark = string.Empty;
                    //上传用户
                    string CommitUser = string.Empty;
                    //资料类型（图片，视频,文档）
                    string FileType = string.Empty;
                    //来源(web,app)
                    string FSource = string.Empty;
                    //所属模块
                    string Modules = string.Empty;

                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/PDR/";
                    string filePath = Server.MapPath(url);

                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";

                    //上传文件到t_cm_files表          

                    //资料类型（图片，视频,文档）
                    FileType = ctype;
                    //来源(web,app)
                    FSource = "web";
                    //所属模块
                    Modules = "PDR";
                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CurrentUser.UserName;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = pid;
                    obj.FSource = FSource;
                    obj.MaxTemp = 0;
                    obj.MinTemp = 0;
                    obj.Remark = Remark;
                    obj.Modules = Modules;
                    bll.t_cm_files.AddObject(obj);
                    bll.SaveChanges();
                    return Content(saveName);
                }
                catch (Exception ex)
                {
                    return Content(ex.ToString());
                }
            }
            else
            {
                return Content("false");
            }
        }
        /// <summary>
        /// 删除已经上传的文件
        /// </summary>
        /// <param name="id"></param>
        public ActionResult DeleteFile(string filename, string ctype, int pid)
        {
            string strJson = "success";
            try
            {
                int epid = 0;
                //记录预案编号              
                string filePath = Server.MapPath("~/UploadFiles/PDR/");
                DirectoryUtil.DeleteFile(filePath + filename);

                //删除文件t_cm_files表中。
                List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.FilePath.Contains(filename) && d.FileType == ctype && d.Modules == "PDR")).ToList();
                if (Filelist.Count > 0)
                {
                    t_cm_files files_Temp = Filelist[0];
                    epid = int.Parse(files_Temp.Fk_ID.ToString().Trim());
                    bll.t_cm_files.DeleteObject(files_Temp);
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return Content(strJson);
        }
        /// <summary>
        /// 读文件字节流
        /// </summary>
        /// <param name="fileData"></param>
        /// <returns></returns>
        public byte[] ReadFileBytes(HttpPostedFileBase fileData)
        {
            byte[] data;
            using (Stream inputStream = fileData.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                data = memoryStream.ToArray();
            }
            return data;
        }

        #endregion

        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
    }
}
