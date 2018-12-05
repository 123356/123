using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.PubClass;
using System.Text;
using System.IO;
using YWWeb;

namespace YWWeb.Controllers
{
    public class EmergencyRepairController : Controller
    {
        //
        // GET: /EmergencyPlan/
        pdermsWebEntities bll = new pdermsWebEntities();

        LoginAttribute loginbll = new LoginAttribute();

        FileManageController fm = new FileManageController();

        public ActionResult OrderRepair()//应急抢修-抢修工单
        {
            return View();
        }
        public ActionResult OrderRepairEdit()//应急抢修-抢修工单
        {
            return View();
        }
        public ActionResult EmergencyPlan()//应急抢修-应急预案
        {
            return View();
        }
        public ActionResult EmergencyRepairReport()//应急抢修-应急抢修报告
        {
            return View();
        }
        public ActionResult UploadPage()//资源上传页面
        {
            return View();
        }

        #region "应急抢修报告"
        /// <summary>
        /// 获取应急抢修报告信息
        /// </summary>
        /// <param name="rows">行数</param>
        /// <param name="page">页数</param>
        /// <param name="pid">配电房编号</param>
        /// <returns></returns>
        public ActionResult GetEmergencyRepairReportFileInfo(int rows, int page, int pid = 0)
        {
            string strJson = string.Empty;
            string strsql = string.Empty;
            if (pid != 0)
            {
               strsql = "select f.* from t_cm_files f, t_PM_Order p where f.Fk_ID = p.OrderID and  p.OrderType = '应急抢修' and f.FileType = 'doc'  and f.Modules='order' and p.PID =" + pid;
            }
            else
            {
                strsql = "select f.* from t_cm_files f, t_PM_Order p where f.Fk_ID = p.OrderID and  p.OrderType = '应急抢修' and  f.FileType = 'doc' and f.Modules='order'";
            }
            List<t_cm_files> Blist = bll.ExecuteStoreQuery<t_cm_files>(strsql).OrderByDescending(o => o.CommitTime).ToList();
            strJson = Common.List2Json(Blist, rows, page);
            return Content(strJson);
        }
        //查询所有报告
        public ActionResult GetEmergencyRepairReportFileInfo2(int rows, int page, string filetype, string reportdate, int pid = 0)
        {
            string strJson = string.Empty;
            string strsql = string.Empty;
            strsql = "select f.* from t_cm_files f, t_PM_Order p where f.Fk_ID = p.OrderID and  p.OrderType = '" + filetype + "' and  f.FileType = 'doc'";
            if (pid != 0)
            {
                strsql += " and p.PID =" + pid;
            }
            if (reportdate != "")
            {
                DateTime sd = Convert.ToDateTime(reportdate);
                DateTime ed = sd.AddDays(1);
                strsql += " and f.CommitTime >= '" + sd + "' and f.CommitTime <= '" + ed + "'";
            }
            List<t_cm_files> Blist = bll.ExecuteStoreQuery<t_cm_files>(strsql).OrderByDescending(o => o.CommitTime).ToList();
            strJson = Common.List2Json(Blist, rows, page);
            return Content(strJson);
        }
        /// <summary>
        ///  删除应急抢修报告
        /// </summary>
        /// <param name="idList"></param>
        /// <returns></returns>
        public ActionResult DeleteEmergencyRepairReportInfo(string ids)
        {
            string result = "success";
            try
            {
                string orderid = string.Empty;
                string[] fileArry = ids.Split(',');
                if (fileArry.Length > 0)
                {
                    for (int i = 0; i < fileArry.Length; i++)
                    {
                        orderid = fileArry[i];
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
                    }
                }
                Common.InsertLog("应急抢修", CurrentUser.UserName, "删除应急抢修报告信息[" + orderid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        #endregion

        #region "应急预案"
        /// <summary>
        /// 获取用户信息
        /// </summary>
        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
        /// <summary>
        ///  获取应急预案列表名称
        /// </summary>
        /// <param name="pid">配电房编号id</param>
        /// <param name="showall">是否展示全部：1表示展示全部，0表示不用添加展示全部</param>
        /// <returns></returns>
        public ActionResult EmergencyPlanInfo(int pid, int showall)
        {
            try
            {
                string strsql = "select EPID, Name, PID, Remarks  from t_PM_EmergencyPlan";
                if (pid > 0)
                {
                    strsql = strsql + " where pid=" + pid;
                }
                strsql = strsql + "  order by EPID";
                List<t_PM_EmergencyPlan> list = bll.ExecuteStoreQuery<t_PM_EmergencyPlan>(strsql).ToList();
                string strJson = Common.ComboboxToJson(list);
                if (showall == 1)
                {
                    strJson = AddShowAll(list.Count, strJson, "EPID", "Name");
                }
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
                //return Content("[{\"EPID\":\"0\",\"Name\":\"==全部==\"}]");
            }
        }
        /// <summary>
        /// 获取应急预案文件信息
        /// </summary>
        /// <param name="pid">配电房编号</param>
        /// <param name="epid">预案编号</param>
        /// <returns></returns>
        public ActionResult GetEmergencyPlanFileInfo(int pid, int epid)
        {
            try
            {
                string strsql = string.Empty;
                if (epid != 0 && pid != 0)
                {
                    strsql = string.Format("select P.ID, P.EPID, P.Name, F.FileSize, F.CommitTime  from t_PM_EmergencyPlan P, t_cm_files  F  where P.EPID = F.FK_ID and  F.Modules = '{0}' and P.PID = {1} and P.EPID = {2}", "EmergencyPlan", pid, epid);
                }
                else if (epid == 0 && pid != 0)
                {
                    strsql = string.Format("select  P.ID, P.EPID, P.Name, F.FileSize, F.CommitTime  from t_PM_EmergencyPlan P, t_cm_files  F  where P.EPID = F.FK_ID and  F.Modules = '{0}' and P.PID = {1}", "EmergencyPlan", pid);
                }
                else
                {
                    strsql = string.Empty;
                }
                string strJson = string.Empty;
                if (!string.IsNullOrEmpty(strsql))
                {
                    List<EmergencyPlanFileInfo> list = bll.ExecuteStoreQuery<EmergencyPlanFileInfo>(strsql).ToList();
                    strJson = Common.ComboboxToJson(list);
                }
                else
                {
                    strJson = string.Empty;
                }
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        /// <summary>
        /// 声明一个对象用于记录应急预案里面的信息
        /// </summary>
        public class EmergencyPlanFileInfo
        {
            public int EPID { get; set; }
            public string Name { get; set; }
            public string FileSize { get; set; }
            public DateTime commitTime { get; set; }
        }
        /// <summary>
        /// 向应急预案表中添加记录。
        /// </summary>
        /// <param name="EmergencyPlan">应急预案记录</param>
        /// <returns>true：表示保存成功，false：表示保存失败</returns>
        private bool AddEmergencyPlanInfo(t_PM_EmergencyPlan EmergencyPlan)
        {
            bool flag = false;
            try
            {
                bll.t_PM_EmergencyPlan.AddObject(EmergencyPlan);
                bll.SaveChanges();
                flag = true;
            }
            catch (Exception ex)
            {               
                flag = false;
            }
            return flag;
        }
        /// <summary>
        /// 向系统资料表中添加记录
        /// </summary>
        /// <param name="filesInfo">记录信息</param>
        /// <returns>true：表示保存成功，false：表示保存失败</returns>
        private bool AddFilesInfo(t_cm_files  filesInfo)
        {
            bool flag = false;
            try
            {
                bll.t_cm_files.AddObject(filesInfo);
                bll.SaveChanges();
                flag = true;
            }
            catch (Exception ex)
            {
                flag = false;
            }
            return flag;
        }
        /// <summary>
        ///  添加显示全部
        /// </summary>
        /// <param name="rowcount">行数</param>
        /// <param name="strJson">Json字符串</param>
        /// <param name="dkey">编号</param>
        /// <param name="dvalue">名称</param>
        /// <returns></returns>
        private string AddShowAll(int rowcount, string strJson, string dkey, string dvalue)
        {
            if (rowcount > 0)
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"},");
            else
                strJson = strJson.Replace("[", "[{\"" + dkey + "\":\"0\",\"" + dvalue + "\":\"==全部==\"}");
            return strJson;
        }

        #region "文件的上传处理"
        /// <summary>
        /// 删除已经上传的文件
        /// </summary>
        /// <param name="id"></param>
        public ActionResult DeleteFile2(string filename, string ctype, int pid)
        {
            string strJson = "success";
            try
            {
                int epid = 0;
                //记录预案编号              
                string filePath = Server.MapPath("~/UploadFiles/EmergencyPlan/");
                DirectoryUtil.DeleteFile(filePath + filename);

                //删除文件到t_PM_EmergencyPlan表和t_cm_files表中。
                List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.FileName.Contains(filename) && d.FileType == ctype && d.Modules == "EmergencyPlan")).ToList();
                if (Filelist.Count > 0)
                {
                    t_cm_files files_Temp = Filelist[0];
                    epid = int.Parse(files_Temp.Fk_ID.ToString().Trim());
                    string mappth = System.AppDomain.CurrentDomain.BaseDirectory;
                    string fileName = "";
                    fileName = mappth + files_Temp.FilePath.Replace("~", "").Replace("/", "\\");//删除对应路径的文件
                    DirectoryUtil.DeleteFile(fileName);
                    bll.t_cm_files.DeleteObject(files_Temp);
                    bll.SaveChanges();
                }     

                List<t_PM_EmergencyPlan> list = bll.t_PM_EmergencyPlan.Where(d => (d.EPID == epid  && d.PID == pid)).ToList();
                if (list.Count > 0)
                {
                    t_PM_EmergencyPlan EmergencyPlan = list[0];
                    bll.t_PM_EmergencyPlan.DeleteObject(EmergencyPlan);
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
        /// 上传文件
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="folder"></param>
        /// <param name="pid">配电室编号</param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public ActionResult Upload2(HttpPostedFileBase fileData, string folder, int uid,  int pid, string ctype = "image")
        {
            if (fileData != null)
            {
                try
                {
                    //所属编号
                    int fk_id = 0;
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
                    string url = "~/UploadFiles/EmergencyPlan/";
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

                    //上传文件到t_PM_EmergencyPlan表和t_cm_files表
                    //保存到t_PM_EmergencyPlan表
                    t_PM_EmergencyPlan obj_EmergencyPlan = new t_PM_EmergencyPlan();
                    obj_EmergencyPlan.Name = fileName;
                    obj_EmergencyPlan.PID = pid;
                    bll.t_PM_EmergencyPlan.AddObject(obj_EmergencyPlan);
                    bll.SaveChanges();
                    
                    //获取pk_id
                    fk_id = GetCurEPID(fileName);
                    //获取上传人
                    CommitUser = GetUserByUid(uid);
                    //资料类型（图片，视频,文档）
                    FileType = ctype;
                    //来源(web,app)
                    FSource = "web";
                    //所属模块
                    Modules = "EmergencyPlan";
                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = CommitUser;
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
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
        /// 上传文件
        /// </summary>
        /// <param name="fileData"></param>
        /// <param name="folder"></param>
        /// <param name="pid">配电室编号</param>
        /// <param name="ctype"></param>
        /// <returns></returns>
        public ActionResult Upload(HttpPostedFileBase fileData, string folder,int uid, string ctype = "file",int pid = 0)
        {
            if (fileData != null)
            {
                try
                {
                    //所属编号
                    int fk_id = 0;
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
                    string url = "~/UploadFiles/EmergencyPlan/";
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

                    //上传文件到t_PM_EmergencyPlan表和t_cm_files表
                    //保存到t_PM_EmergencyPlan表
                    t_PM_EmergencyPlan obj_EmergencyPlan = new t_PM_EmergencyPlan();
                    obj_EmergencyPlan.Name = fileName;
                    obj_EmergencyPlan.PID = pid;
                    bll.t_PM_EmergencyPlan.AddObject(obj_EmergencyPlan);
                    bll.SaveChanges();

                    //获取pk_id
                    fk_id = GetCurEPID(fileName);
                    //获取上传人
                    CommitUser = GetUserByUid(uid);
                    //资料类型（图片，视频,文档）
                    FileType = ctype;
                    //来源(web,app)
                    FSource = "web";
                    //所属模块
                    Modules = "EmergencyPlan";
                    //保存到资料库t_cm_files表
                    t_cm_files obj = new t_cm_files();
                    obj.CommitTime = DateTime.Now;
                    obj.CommitUser = GetUserByUid(uid);
                    obj.FileName = fileName;
                    obj.FilePath = url + saveName;
                    obj.FileExtension = fileExtension;
                    obj.FileSize = fSize;
                    obj.FileType = FileType;
                    obj.Fk_ID = fk_id;
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
        /// 获取预案编号
        /// </summary>
        /// <returns></returns>
        private int GetCurEPID(string fileName)
        {
            int epid_temp = 0;
            string strsql = string.Empty;
            strsql = string.Format("select TOP 1  P.EPID,  P.PID, P.Name, P.Remarks  from t_PM_EmergencyPlan P where P.Name = '{0}'  order by P.EPID desc ", fileName);   
            if (!string.IsNullOrEmpty(strsql))
            {
                List<t_PM_EmergencyPlan> list = bll.ExecuteStoreQuery<t_PM_EmergencyPlan>(strsql).ToList();
                if (list.Count > 0)
                {
                    t_PM_EmergencyPlan EmergencyPlan = list[0];
                    epid_temp = EmergencyPlan.EPID;
                }
            }
            else
            { 
            }
            return epid_temp;
        }
        /// <summary>
        /// 依据uid获取使用者名称
        /// </summary>
        /// <param name="uid">用户编号</param>
        /// <returns></returns>
        private string GetUserByUid(int uid)
        {
            string UserName = string.Empty;
            string strsql = string.Empty;
            strsql = string.Format("select * from t_CM_UserInfo where UserID = {0}",uid);
            if (!string.IsNullOrEmpty(strsql))
            {
                List<t_CM_UserInfo> list = bll.ExecuteStoreQuery<t_CM_UserInfo>(strsql).ToList();
                if (list.Count > 0)
                {
                    t_CM_UserInfo UserInfo = list[0];
                    UserName = UserInfo.UserName;
                }
            }
            else
            {
            }
            return UserName;
        }
        /// <summary>
        /// 读文件字节流
        /// </summary>
        /// <param name="fileData"></param>
        /// <returns></returns>
        private byte[] ReadFileBytes(HttpPostedFileBase fileData)
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
        /// <summary>
        /// 信息查询
        /// </summary>
        /// <param name="epid">预案编号</param>
        /// <param name="pid">配电室编号</param>
        /// <returns></returns>
        public ActionResult OnSearch(int epid, int pid)
        {
            try
            {
                string strJson = string.Empty;
                StringBuilder sbSearchInfo = new StringBuilder();
                sbSearchInfo.Append(" <ul> ");
                if (epid == 0 && pid == 0)
                {
                    //编号都为空
                }
                else if (epid == 0 && pid != 0)
                {
                    //按照配电房编号进行查询
                    //t_PM_EmergencyPlan表
                    List<t_PM_EmergencyPlan> list = bll.t_PM_EmergencyPlan.Where(d => (d.PID == pid)).ToList();
                    if (list.Count > 0)
                    {
                        for (int i = 0; i < list.Count; i++)
                        {
                            t_PM_EmergencyPlan EmergencyPlan = list[i];
                            //t_cm_files表中。
                            List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.Fk_ID == EmergencyPlan.EPID && d.Modules == "EmergencyPlan")).ToList();
                            if (Filelist.Count > 0)
                            {
                                //获取当前预案上传文件的详细信息
                                t_cm_files files_Temp = Filelist[0];
                                sbSearchInfo.Append("  <li>  ");
                                sbSearchInfo.Append("  <div> ");
                                sbSearchInfo.Append("  <img src=\"../content/images/wordicon.png\" /> ");
                                sbSearchInfo.Append("  <span>");
                                sbSearchInfo.Append("  <h3>");
                                string fileSaveName = string.Empty;
                                string[] fileNameArry_Temp = files_Temp.FileName.Split('.');
                                if (fileNameArry_Temp.Length > 0)
                                {
                                    fileSaveName = fileNameArry_Temp[0];
                                }
                                else
                                { }
                                sbSearchInfo.Append(fileSaveName);
                                sbSearchInfo.Append("  </h3>");
                                sbSearchInfo.Append("  <p>");
                                DateTime dateTime_Temp = new DateTime();
                                dateTime_Temp = DateTime.Parse(files_Temp.CommitTime.ToString().Trim());
                                sbSearchInfo.Append("  上传：");
                                sbSearchInfo.Append(dateTime_Temp.ToString("yyyy-MM-dd HH:mm:ss"));
                                sbSearchInfo.Append("  </p>");
                                sbSearchInfo.Append("  <p>");
                                sbSearchInfo.Append("  大小：");
                                sbSearchInfo.Append(files_Temp.FileSize);
                                sbSearchInfo.Append("  </p>");
                                sbSearchInfo.Append("  </span>");
                                sbSearchInfo.Append("  </div>  ");
                                sbSearchInfo.Append("  <div class=\"standfile_btn\">");
                                sbSearchInfo.Append("  <button");
                                sbSearchInfo.Append("  title=\"下 载\" onclick=\"DoDownload('");
                                string[] fileDirArry_Temp = files_Temp.FilePath.Split('/');
                                string newFileDir = string.Empty;
                                if (fileDirArry_Temp.Length > 0)
                                {
                                    for (int j = 1; j < fileDirArry_Temp.Length; j++)
                                    {
                                        newFileDir = newFileDir + "/" + fileDirArry_Temp[j].Trim();
                                    }
                                }
                                else
                                { }
                                sbSearchInfo.Append(newFileDir);
                                sbSearchInfo.Append("')\"");
                                sbSearchInfo.Append("  class=\"page_table_but3 radius5\"><img src=\"../content/images/download.png\" />下载</button>");
                                sbSearchInfo.Append("  <button");
                                sbSearchInfo.Append("  title=\"删 除\" onclick=\"DoDelete(");
                                sbSearchInfo.Append(files_Temp.Fk_ID.ToString());
                                sbSearchInfo.Append(")\"");
                                sbSearchInfo.Append("  class=\"page_table_but3 radius5\"><img src=\"../content/images/delete_new.png\" />删除</button>");

                                sbSearchInfo.Append("  </div>");
                                sbSearchInfo.Append("  </li>  ");
                            }
                        }
                    }
                }
                else if (epid != 0)
                {
                    //按照预案编号进行查询,直接进入t_cm_file表中查询
                    List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.Fk_ID == epid && d.Modules == "EmergencyPlan")).ToList();
                    if (Filelist.Count > 0)
                    {
                        //获取当前预案上传文件的详细信息
                        t_cm_files files_Temp = Filelist[0];
                        sbSearchInfo.Append("  <li>  ");
                        sbSearchInfo.Append("  <div> ");
                        sbSearchInfo.Append("  <img src=\"../content/images/wordicon.png\" /> ");
                        sbSearchInfo.Append("  <span>");
                        sbSearchInfo.Append("  <h3>");
                        string fileSaveName = string.Empty;
                        string[] fileNameArry_Temp = files_Temp.FileName.Split('.');
                        if (fileNameArry_Temp.Length > 0)
                        {
                            fileSaveName = fileNameArry_Temp[0];
                        }
                        else
                        { }
                        sbSearchInfo.Append(fileSaveName);
                        sbSearchInfo.Append("  </h3>");
                        sbSearchInfo.Append("  <p>");
                        DateTime dateTime_Temp = new DateTime();
                        dateTime_Temp = DateTime.Parse(files_Temp.CommitTime.ToString().Trim());
                        sbSearchInfo.Append("  上传：");
                        sbSearchInfo.Append(dateTime_Temp.ToString("yyyy-MM-dd HH:mm:ss"));
                        sbSearchInfo.Append("  </p>");
                        sbSearchInfo.Append("  <p>");
                        sbSearchInfo.Append("  大小：");
                        sbSearchInfo.Append(files_Temp.FileSize);
                        sbSearchInfo.Append("  </p>");
                        sbSearchInfo.Append("  </span>");
                        sbSearchInfo.Append("  </div>  ");
                        sbSearchInfo.Append("  <div class=\"standfile_btn\">");
                        sbSearchInfo.Append("  <button");
                        sbSearchInfo.Append("  title=\"下 载\" onclick=\"DoDownload('");
                        string[] fileDirArry_Temp = files_Temp.FilePath.Split('/');
                        string newFileDir = string.Empty;
                        if (fileDirArry_Temp.Length > 0)
                        {
                            for (int j = 1; j < fileDirArry_Temp.Length; j++)
                            {
                                newFileDir = newFileDir + "/" + fileDirArry_Temp[j].Trim();
                            }
                        }
                        else
                        { }
                        sbSearchInfo.Append(newFileDir);
                        sbSearchInfo.Append("')\"");
                        sbSearchInfo.Append("  class=\"page_table_but3 radius5\"><img src=\"../content/images/download.png\" />下载</button>");
                        sbSearchInfo.Append("  <button");
                        sbSearchInfo.Append("  title=\"删 除\" onclick=\"DoDelete(");
                        sbSearchInfo.Append(files_Temp.Fk_ID.ToString());
                        sbSearchInfo.Append(")\"");
                        sbSearchInfo.Append("  class=\"page_table_but3 radius5\"><img src=\"../content/images/delete_new.png\" />删除</button>");
                        sbSearchInfo.Append("  </div>");
                        sbSearchInfo.Append("  </li>  ");
                    }
                }
                else
                {
                    //为空
                }
                sbSearchInfo.Append(" <ul> ");
                strJson = sbSearchInfo.ToString();
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
         /// <summary>
         /// 获取资料列表
         /// </summary>
         /// <param name="rows">行数</param>
         /// <param name="page">页编号</param>
         /// <param name="pid">配电室编号</param>
         /// <param name="epid">预案编号</param>
         /// <returns></returns>
        public ActionResult FileListData(int rows, int page, int pid, int epid = 0)
        {
            string strsql = string.Empty; 
            if (pid > 0 && epid > 0)
            {
                strsql = "select * from t_cm_files  where Modules='EmergencyPlan'  and Fk_ID= " +epid; 
            }
            else if (pid > 0 && epid == 0)
            {
                strsql = "select f.* from t_cm_files f, t_PM_EmergencyPlan p where f.Fk_ID = p.EPID and f.Modules='EmergencyPlan' and p.PID =" + pid;
            }
            else
            {
                strsql = "select * from t_cm_files  where Modules='EmergencyPlan' ";
            }
            List<t_cm_files> Blist = bll.ExecuteStoreQuery<t_cm_files>(strsql).OrderByDescending(o => o.CommitTime).ToList();
            string strJson = Common.List2Json(Blist, rows, page);
            return Content(strJson);
        }
        /// <summary>
        /// 删除文件列表
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult DeleteFileListInfo(string id)
        {
            string result = "success";
            try
            {
                string[] fileArry = id.Split(',');
                if (fileArry.Length > 0)
                {
                    for (int i = 0; i < fileArry.Length; i++)
                    {
                        result = DeleteInfo(int.Parse(fileArry[i].Trim()));
                    }
                }     
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        /// <summary>
        /// 删除信息
        /// </summary>
        /// <param name="epid"></param>
        /// <returns></returns>
       private string DeleteInfo(int epid)
        {
            string strJson = "success";
            try
            {
                string fileSaveName = string.Empty;
                //从t_cm_files表中获取文件名称，并删除表中记录
                List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.Fk_ID == epid && d.Modules == "EmergencyPlan")).ToList();
                if (Filelist.Count > 0)
                {
                    t_cm_files files_Temp = Filelist[0];
                    string filePath_Temp = files_Temp.FilePath;
                    string[] fileArry = filePath_Temp.Split('/');
                    if (fileArry.Length > 0)
                    {
                        fileSaveName = fileArry[fileArry.Length - 1];
                    }
                    else
                    { }
                    //删除文件
                    string filePath = Server.MapPath("~/UploadFiles/EmergencyPlan/");
                    DirectoryUtil.DeleteFile(filePath + fileSaveName);
                    //删除记录
                    bll.t_cm_files.DeleteObject(files_Temp);
                    bll.SaveChanges();
                    Common.InsertLog("应急预案管理", CurrentUser.UserName, "删除应急预案[" + epid + "]");//log
                }
                //在t_PM_EmergencyPlan表中删除记录。
                List<t_PM_EmergencyPlan> list = bll.t_PM_EmergencyPlan.Where(d => (d.EPID == epid)).ToList();
                if (list.Count > 0)
                {
                    t_PM_EmergencyPlan EmergencyPlan = list[0];
                    bll.t_PM_EmergencyPlan.DeleteObject(EmergencyPlan);
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return  strJson;
        }
        /// <summary>
        /// 删除信息
        /// </summary>
        /// <param name="epid"></param>
        /// <returns></returns>
        public ActionResult OnDelete(int epid)
        {
            string strJson = "success";
            try
            {
                string fileSaveName = string.Empty;
                //从t_cm_files表中获取文件名称，并删除表中记录
                List<t_cm_files> Filelist = bll.t_cm_files.Where(d => (d.Fk_ID == epid && d.Modules == "EmergencyPlan")).ToList();
                if (Filelist.Count > 0)
                {
                    t_cm_files files_Temp = Filelist[0];
                    string filePath_Temp = files_Temp.FilePath;
                    string[] fileArry = filePath_Temp.Split('/');
                    if (fileArry.Length> 0)
                    {
                       fileSaveName = fileArry[fileArry.Length - 1];
                    }
                    else
                    {}
                    //删除文件
                    string filePath = Server.MapPath("~/UploadFiles/EmergencyPlan/");
                    DirectoryUtil.DeleteFile(filePath + fileSaveName);
                    //删除记录
                    bll.t_cm_files.DeleteObject(files_Temp);
                    bll.SaveChanges();
                    Common.InsertLog("应急预案管理", CurrentUser.UserName, "删除应急预案[" + epid + "]");//log
                }               
                //在t_PM_EmergencyPlan表中删除记录。
                List<t_PM_EmergencyPlan> list = bll.t_PM_EmergencyPlan.Where(d => (d.EPID == epid)).ToList();
                if (list.Count > 0)
                {
                    t_PM_EmergencyPlan EmergencyPlan = list[0];
                    bll.t_PM_EmergencyPlan.DeleteObject(EmergencyPlan);
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
        /// 判断当前文件是否存在
        /// </summary>
        /// <param name="fk_id"></param>
        /// <returns></returns>
        public ActionResult IsExistFilePath(string  filePathName)
        {
            string strJson = "success";
            try
            {
                string filePath = string.Empty;
                string[] fileArry = filePathName.Split('/');
                if (fileArry.Length > 0)
                {
                    filePath = fileArry[fileArry.Length - 1];
                }
                //判断文件是否存在
                string filePath_temp = Server.MapPath("~/UploadFiles/EmergencyPlan/");
                if (Directory.Exists(filePath_temp))
                {
                    if (System.IO.File.Exists(filePath_temp + filePath))
                    {
                        strJson = "success";
                    }
                    else
                    {
                        strJson = "failure";
                    }
                }
                else
                {
                    strJson = "failure";
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return Content(strJson);
        }
        #endregion

       
    }
}
