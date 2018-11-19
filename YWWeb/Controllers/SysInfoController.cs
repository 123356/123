using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
using System.Data.Objects;
using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using S5001Web.PubClass;
using Newtonsoft;

namespace S5001Web.Controllers
{
    public class SysInfoController : Controller
    {
        //系统管理
        // GET: /SysInfo/

        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult ChangePassword()
        {
            return View();
        }

        [Login]
        public ActionResult ModuleList()
        {
            return View();
        }
        [Login]
        public ActionResult ModuleEdit()
        {
            return View();
        }
        [Login]
        public ActionResult ButtonList()
        {
            return View();
        }
        [Login]
        public ActionResult HistoryTimeData()
        {
            return View();
        }
        [Login]
        public ActionResult AlarmList()
        {
            return View();
        }
        //阀值报警设置界面
        [Login]
        public ActionResult AlarmSetEdit()
        {
            return View();
        }
        //相间报警设置界面
        [Login]
        public ActionResult AlternateSet()
        {
            return View();
        }
        //相间报警编辑界面
        [Login]
        public ActionResult AlternateSetEdit()
        {
            return View();
        }
        //进出线温差报警设置界面
        [Login]
        public ActionResult IODiffSet()
        {
            return View();
        }
        //进出线温差报警编辑界面
        [Login]
        public ActionResult IODiffSetEdit()
        {
            return View();
        }
        [Login]
        public ActionResult WarmList()
        {
            return View();
        }
        [Login]
        public ActionResult WarmSetEdit()
        {
            return View();
        }
        [Login]
        public ActionResult UnitList()
        {
            return View();
        }
        [Login]
        public ActionResult PowerPlant()
        {
            return View();
        }
        [Login]
        public ActionResult Industry()
        {
            return View();
        }
        [Login]
        public ActionResult ModuleData()
        {
            List<t_CM_Module> list = bll.t_CM_Module.Where(c => c.ParentID == 0).OrderBy(c => c.SN).ToList();
            string strJson = Common.GetModuleTree(list);
            return Content(strJson);
        }
        [Login]
        public ActionResult ModuleComboData()
        {
            List<t_CM_Module> list = bll.t_CM_Module.Where(c => c.ParentID == 0).OrderBy(c => c.SN).ToList();
            string strJson = Common.GetModuleComboTree(list);
            return Content(strJson);
        }
        //配电房列表
        [Login]
        public ActionResult PDRComboData()
        {
            List<t_CM_PDRInfo> list = bll.t_CM_PDRInfo.Where(c => c.UseState == 0 && (c.ParentID == 0 || c.ParentID == null) && c.PID > 0).ToList();
            string strJson = Common.GetPDRComboTree(list);
            return Content(strJson);
        }
        [Login]
        public ActionResult UnitComboData()
        {
            List<t_CM_Unit> list = new List<t_CM_Unit>();
            if (CurrentUser.RoleID == 1)
            {
                string strsql = "select * from  t_CM_Unit order by UnitID desc";
                list = bll.ExecuteStoreQuery<t_CM_Unit>(strsql).ToList();
            }
            else
            {
                if (Convert.ToBoolean(CurrentUser.IsAdmin))
                {
                    string unlist = "";
                    var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                    foreach (var item in Ulist)
                    {
                        if (!string.IsNullOrEmpty(item.UNITList))
                            unlist += item.UNITList + ",";
                    }
                    if (!string.IsNullOrEmpty(unlist))
                        unlist = unlist.Substring(0, unlist.Length - 1);

                    if (unlist == "")
                        return Content("");

                    string strsql = "select * from  t_CM_Unit where UnitID IN (" + unlist + ") order by UnitID desc";
                    list = bll.ExecuteStoreQuery<t_CM_Unit>(strsql).ToList();

                }
                else
                {
                    if (CurrentUser.UNITList == "")
                        return Content("");

                    string strsql = "select * from  t_CM_Unit where UnitID IN (" + CurrentUser.UNITList + ") order by UnitID desc";
                    list = bll.ExecuteStoreQuery<t_CM_Unit>(strsql).ToList();
                }
            }
            var result = from r in list
                         select new
                         {
                             UnitID = r.UnitID,
                             UnitName = r.UnitName
                         };
            return Json(result);
        }
        public ActionResult TesetWord(int orderid)
        {
            Exportdoc.ExportWordFromOrder(orderid);
            return Content("success!");
        }
        //获取所有操作功能列表
        [Login]
        public ActionResult AllButtonList()
        {
            StringBuilder strlist = new StringBuilder();
            List<t_CM_Button> list = bll.t_CM_Button.ToList();
            foreach (t_CM_Button button in list)
            {
                strlist.Append(string.Concat(new string[]
                    {
                        "<div id=",
                        button.ButtonID.ToString(),
                        " onclick='selectedButton(this)' title='",
                        button.ButtonName,
                        "' class=\"shortcuticons\"><img src=\"/Content/Images/Icon16/",
                        button.ButtonIcon,
                        "\" alt=\"\" /><br />",
                        button.ButtonName,
                        "</div>"
                    }));
            }
            string strJson = JsonConvert.SerializeObject(strlist.ToString());
            return Content(strJson);
        }
        //获取当前模块的操作功能列表
        [Login]
        public ActionResult SelButtonList(int ModuleID)
        {
            StringBuilder strlist = new StringBuilder();
            List<t_CM_Module> list = bll.t_CM_Module.Where(m => m.ParentID == ModuleID && m.Target == "OnClick").ToList();
            foreach (t_CM_Module module in list)
            {
                strlist.Append(string.Concat(new string[]
                    {
                        "<div onclick='selectedButton(this)' ondblclick=\"removeButton('",
                        module.ModuleID.ToString(),
                        "','"+ModuleID+"')\" title='",
                        module.ModuleName,
                        "' class=\"shortcuticons\"><img src=\"/Content/Images/Icon16/",
                        module.Icon,
                        "\" alt=\"\" /><br />",
                        module.ModuleName,
                        "</div>"
                    }));
            }
            string strJson = JsonConvert.SerializeObject(strlist.ToString());
            return Content(strJson);
        }
        //添加模块操作功能
        [Login]
        public ActionResult AddButton(int ParentID, int ButtonID)
        {
            t_CM_Module module = new t_CM_Module();
            string result = "OK";
            try
            {
                t_CM_Button button = bll.t_CM_Button.Where(b => b.ButtonID == ButtonID).First();
                if (button != null)
                {
                    module.Icon = button.ButtonIcon;
                    module.Location = button.ButtonCode;
                    module.ModuleName = button.ButtonName;
                    module.ParentID = ParentID;
                    module.SN = 2;
                    module.ModuleType = 3;
                    module.Target = "Onclick";
                    bll.t_CM_Module.AddObject(module);
                    bll.SaveChanges();
                }
                else
                    result = "模块不存在，操作失败！";
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content("OK");
        }
        //用户模块功能权限列表
        [Login]
        public ActionResult UserButton()
        {
            return View();
        }
        [Login]
        public ActionResult UserButtonList(string CurrUrl)
        {
            t_CM_UserInfo user = loginbll.CurrentUser;
            int UserID = 0;
            if (user != null)
                UserID = user.UserID;
            StringBuilder sb_Button = new StringBuilder();
            //获取模块
            List<t_CM_Module> thislist = bll.t_CM_Module.Where(m => m.Location == CurrUrl && m.ParentID > 0).ToList();
            if (thislist.Count > 0)
            {
                int parentid = thislist[0].ModuleID;
                //获取用户权限功能列表
                //获取用户角色列表
                List<t_CM_UserRoles> listrole = bll.t_CM_UserRoles.Where(u => u.UserID == UserID).ToList();
                //获取角色权限列表
                List<int> listm = new List<int>();
                string strlist = ",";
                foreach (t_CM_UserRoles userrole in listrole)
                {
                    List<t_CM_RoleRight> listright = bll.t_CM_RoleRight.Where(r => r.RoleID == userrole.RoleID).ToList();
                    int moduleid = 0;
                    foreach (t_CM_RoleRight right in listright)
                    {
                        moduleid = (int)right.ModuleID;
                        if (!strlist.Contains("," + moduleid + ","))
                        {
                            strlist += moduleid + ",";
                            listm.Add(moduleid);
                        }
                    }
                }
                //获取模块功能列表
                //List<t_CM_Module> list = bll.t_CM_Module.Where(m => m.ParentID == parentid && m.ModuleType == 3 && listm.Any(a => a == m.ModuleID)).ToList();
                var query = from module in bll.t_CM_Module where listm.Contains((int)module.ModuleID) && module.ParentID == parentid && module.ModuleType == 3 select module;
                List<t_CM_Module> list = query.ToList();
                if (list.Count > 0)
                {
                    foreach (t_CM_Module module in list)
                    {
                        sb_Button.Append(string.Concat(new string[]
                        {
                            "<button title=\"",
                            module.ModuleName,
                            "\" onclick=\"",
                            module.Location,
                            ";\" class=\"page_table_but\">"
                        }));
                        sb_Button.Append("<img src=\"/Content/images/Icon16/" + module.Icon + "\"/>");
                        sb_Button.Append(module.ModuleName);
                        sb_Button.Append("</button>");
                    }
                }
                else
                {
                    //sb_Button.Append("<a class=\"button green\">");
                    //sb_Button.Append("无操作按钮");
                    //sb_Button.Append("</a>");
                }
            }
            else
            {
                //sb_Button.Append("<a class=\"button green\">");
                //sb_Button.Append("无操作按钮");
                //sb_Button.Append("</a>");
            }
            string strJson = JsonConvert.SerializeObject(sb_Button.ToString());
            return Content(strJson);
        }
        //删除
        [Login]
        public ActionResult DeleteModule(int ModuleID)
        {
            string result = "OK";
            try
            {
                t_CM_Module module = bll.t_CM_Module.Where(m => m.ModuleID == ModuleID).First();
                bll.t_CM_Module.DeleteObject(module);
                List<t_CM_Module> moduleList = bll.t_CM_Module.Where(m => m.ParentID == ModuleID).ToList();
                if (moduleList.Count > 0)
                {
                    foreach (t_CM_Module m in moduleList)
                    {
                        bll.t_CM_Module.DeleteObject(m);
                    }
                }
                bll.SaveChanges();
                //log
                Common.InsertLog("系统模块", CurrentUser.UserName, "删除系统模块[" + module.ModuleName + "_" + module.ModuleID + "]");
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
        [Login]
        public ActionResult SaveModule(t_CM_Module module)
        {
            List<t_CM_Module> list = bll.t_CM_Module.ToList();
            string result = "OK";
            try
            {
                if (module.ParentID == 0)
                    module.ModuleType = 1;
                else
                    module.ModuleType = 2;
                //新增
                if (module.ModuleID < 1)
                {
                    list = list.Where(s => s.ModuleName == module.ModuleName && s.ParentID == module.ParentID).ToList();

                    if (list.Count > 0)
                    {
                        result = "此模块已经存在，请重新输入！";
                    }
                    else
                    {
                        if (module.ParentID == null)
                            module.ParentID = 0;
                        bll.t_CM_Module.AddObject(module);
                        int i = bll.SaveChanges();
                        //log
                        Common.InsertLog("系统模块", CurrentUser.UserName, "新增系统模块[" + module.ModuleName + "_" + module.ModuleID + "]");
                    }
                }
                else//修改
                {
                    list = list.Where(s => s.ModuleName == module.ModuleName && s.ModuleID != module.ModuleID && s.ParentID == module.ParentID).ToList();
                    if (list.Count > 0)
                    {
                        result = "此模块已经存在，请重新输入！";
                    }
                    else
                    {
                        t_CM_Module obj = bll.t_CM_Module.Where(m => m.ModuleID == module.ModuleID).First();
                        obj.Icon = module.Icon;
                        obj.Location = module.Location;
                        obj.ModuleName = module.ModuleName;
                        obj.ParentID = module.ParentID;
                        obj.SN = module.SN;
                        obj.ModuleType = module.ModuleType;
                        obj.Target = module.Target;
                        bll.ObjectStateManager.ChangeObjectState(obj, EntityState.Modified);
                        bll.SaveChanges();
                        //log
                        Common.InsertLog("系统模块", CurrentUser.UserName, "修改系统模块[" + module.ModuleName + "_" + module.ModuleID + "]");
                    }
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return Content(result);
        }
        [Login]
        public ActionResult LoadModule(int moduleid)
        {
            string strJson = "";
            List<t_CM_Module> list = bll.t_CM_Module.Where(c => c.ModuleID == moduleid).ToList();
            if (list.Count > 0)
            {
                t_CM_Module module = list[0];
                strJson = JsonConvert.SerializeObject(module);
            }
            return Content(strJson);
        }
        [Login]
        public ActionResult IconList()
        {
            return View();
        }
        /// <summary>
        /// 生成图标文件
        /// </summary>
        /// <param name="iconSize">图标尺寸，可选16,32等</param>
        /// <returns></returns>
        public ActionResult CreateIconList(int iconSize = 16)
        {
            string result = "";
            int PageIndex = 1;
            int PageSize;
            StringBuilder strImg = new StringBuilder();
            DirectoryInfo dir;
            if (iconSize == 32)
            {
                PageSize = 100;
                dir = new DirectoryInfo(base.Server.MapPath("/Content/Images/menu/"));
            }
            else
            {
                PageSize = 200;
                dir = new DirectoryInfo(base.Server.MapPath("/Content/Images/menu/"));
            }
            int rowCount = 0;
            int rowbegin = (PageIndex - 1) * PageSize;
            int rowend = PageIndex * PageSize;
            FileSystemInfo[] fileSystemInfos = dir.GetFileSystemInfos();
            for (int i = 0; i < fileSystemInfos.Length; i++)
            {
                FileInfo fsi = (FileInfo)fileSystemInfos[i];
                if (rowCount >= rowbegin && rowCount < rowend)
                {
                    strImg.Append("<div class=\"divicons1\" title='" + fsi.Name + "'>");
                    strImg.Append(string.Concat(new string[]
                    {
                        "<img src=\"/Content/Images/menu",
						//"Icon"+iconSize,
						"/",
                        fsi.Name,
                        "\" />"
                    }));
                    strImg.Append("</div>");
                }
                rowCount++;
            }
            result = JsonConvert.SerializeObject(strImg.ToString());
            return Content(result);
        }
        /// <summary>
        /// 生成系统Logo文件
        /// </summary>
        /// <param name="iconSize">图标尺寸487*71</param>
        /// <returns></returns>
        public ActionResult UserLogList()
        {
            string result = "";
            int PageIndex = 1;
            int PageSize;
            StringBuilder strImg = new StringBuilder();
            DirectoryInfo dir;

            PageSize = 10;
            dir = new DirectoryInfo(base.Server.MapPath("/Content/Images/logo/"));

            int rowCount = 0;
            int rowbegin = (PageIndex - 1) * PageSize;
            int rowend = PageIndex * PageSize;
            FileSystemInfo[] fileSystemInfos = dir.GetFileSystemInfos();
            //strImg.Append("<div class=\"closepic\"><a href=\"javascript:;\" class=\"table_btn1 btn_style radius5\" data-options=\"iconCls:'icon-cancel'\" onclick=\"$('#editWin').window('close');\">关闭</a></div>");
            for (int i = 0; i < fileSystemInfos.Length; i++)
            {
                FileInfo fsi = (FileInfo)fileSystemInfos[i];
                if (rowCount >= rowbegin && rowCount < rowend)
                {
                    strImg.Append("<div class=\"divicons\" title='" + fsi.Name + "'>");
                    strImg.Append(string.Concat(new string[]
                    {
                        "<img src=\"/Content/Images/logo/",
                        fsi.Name,
                        "\" />"
                    }));
                    strImg.Append("</div>");
                }
                rowCount++;
            }
            result = JsonConvert.SerializeObject(strImg.ToString());
            return Content(result);
        }

        #region 系统日志
        [Login]
        public ActionResult LogList()
        {
            return View();
        }
        [Login]
        public ActionResult LogInfo(string username, string contents, string datestart, string dateend, int rows, int page)
        {
            string query = "UserName like '%" + username + "%' and Contents like '%" + contents + "%'";
            if (datestart != null && !datestart.Equals(""))
            {
                query = query + " and LogDate>='" + datestart + "'";
            }
            if (dateend != null && !dateend.Equals(""))
            {
                query = query + " and LogDate<='" + dateend + "'";
            }
            //string tablename = "t_CM_Log";
            //var rowcounts = bll.P_DataCount(tablename, query).ToList();
            //int rowcount = rowcounts[0].Value;

            string strsql = "select * from t_CM_Log where " + query + " order by LogDate desc";
            List<t_CM_Log> list = bll.ExecuteStoreQuery<t_CM_Log>(strsql).ToList();
            //List<t_CM_Log> list = bll.P_LogList(tablename, "*", "LogID", rows, page, true, query).ToList();

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        #endregion


        #region 报警查询、历史数据查询
        [Login]
        public ActionResult AlarmSearch()
        {
            return View();
        }
        [Login]
        public ActionResult HistoryData()
        {
            return View();
        }
        [Login]
        public ActionResult HistoryGraphs()
        {
            return View();
        }
        //获取设备测点列表
        [Login]
        public ActionResult HisPointsInfo(int pid = 0, int did = 0, string cname = "", string typename = "温度")
        {
            try
            {
                if (pid == 0)
                {
                    pid = Convert.ToInt32(HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                    //pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                }
                //List<t_AlarmTable_en> list = bll.ExecuteStoreQuery<t_AlarmTable_en>("select * from t_AlarmTable_en where AlarmState in (select max(AlarmState) from t_AlarmTable_en where AlarmState != 0 group by AlarmArea)").ToList();
                string query = " where pid=" + pid + " and DID=" + did + " and (TagName like '%" + cname + "%' or Position like '%" + cname + "%') and TypeName='" + typename + "'";
                if (did == 0)
                    query = " where pid=" + pid + " and (TagName like '%" + cname + "%' or Position like '%" + cname + "%') and TypeName='" + typename + "'";
                List<V_PointsInfo> list = bll.ExecuteStoreQuery<V_PointsInfo>("select * from V_PointsInfo " + query + " order by DataTypeID").ToList();
                StringBuilder sbpoint = new StringBuilder();
                string TypeName = "", thisName = "";
                bool isSame = false;
                int count = 0;
                sbpoint.Append("<table width=\"96%\" style='color:#fff;font-size:9pt;' cellpadding=\"\" cellspacing=\"\" border=\"0\">");
                foreach (V_PointsInfo points in list)
                {
                    thisName = points.TypeName;
                    if (TypeName.Equals(thisName))
                        isSame = true;
                    else
                        isSame = false;
                    if (!isSame)
                    {
                        if (count > 0)
                            sbpoint.Append("</td></tr>");
                        sbpoint.Append("<tr><td style='width:100px;text-align:left;'>" + points.TypeName + ":</td><td style='width:auto;text-align:left;'>");

                    }
                    sbpoint.Append(string.Concat(new object[]
                {
                    "<input id='ckb",
                        points.TagID+"' ",
                        " style='vertical-align: middle;margin-bottom:2px;' type=\"checkbox\" value=\"",
                      points.TagID+"|"+points.Position+"|"+points.Units,
                        "\" name=\"checkbox\" />"}));
                    sbpoint.Append(points.Position + "&nbsp;&nbsp;&nbsp;&nbsp;");
                    TypeName = thisName;
                    count++;
                }
                sbpoint.Append("</td></tr></table>");
                string result = sbpoint.ToString();
                string strJson = JsonConvert.SerializeObject(result);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //历史曲线图
        [Login]
        public ActionResult HisGraphs(int pid = 0, string tagid = "", string startdate = "", string enddate = "")
        {
            try
            {
                if (pid == 0)
                {
                    //pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                    pid = Convert.ToInt32(HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                }
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                DateTime DateStart = DateTime.Now.AddYears(-5);
                DateTime DateEnd = DateTime.Now;
                string query = " 1=1";
                if (!startdate.Equals(""))
                {
                    DateStart = Convert.ToDateTime(startdate);
                    query = query + " and 记录时间>='" + startdate + "'";
                }
                if (!enddate.Equals(""))
                {
                    DateEnd = Convert.ToDateTime(enddate).AddDays(1);
                    query = query + " and 记录时间<='" + DateEnd + "'";
                }
                tagid = tagid.TrimEnd(',');
                string[] idlist = tagid.Split(',');
                string strTime = "[", strValue = "[", strempty = "[";
                string result = "";
                int count = 0;
                string strwhere = "";
                foreach (string id in idlist)
                {
                    //拼接查询结果
                    if (!strValue.Equals("["))
                        strValue = strValue + "|[";
                    strwhere = query + " and [测量值]<>0 and 测点编号=" + id;
                    List<配电房_00001_历史数据表> list = bll.P_HisData(tablename, "*", "记录时间", 2000, 0, true, strwhere).ToList();
                    list = list.OrderBy(l => l.记录时间).ToList();
                    foreach (配电房_00001_历史数据表 hisdata in list)
                    {
                        if (count == 0)
                        {
                            strTime += "'" + hisdata.记录时间 + "',";
                            strempty += "0,";
                        }
                        strValue += hisdata.测量值 + ",";
                    }
                    if (count == 0)
                    {
                        strTime = strTime.TrimEnd(',') + "]";
                        strempty = strempty.TrimEnd(',') + "]";
                    }
                    strValue = strValue.TrimEnd(',') + "]";
                    count++;
                }
                result = strTime + "|" + strValue;
                if (count == 1)
                    result = result + "|" + strempty + "|" + strempty;
                else if (count == 2)
                    result = result + "|" + strempty;
                return Content(result);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //获取历史数据查询条件
        string GetHisQuery(int pid, string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "温度")
        {
            DateTime DateStart = DateTime.Now.AddYears(-5);
            DateTime DateEnd = DateTime.Now;
            string query = " 1=1";
            if (!dname.Equals("==全部=="))
                query = query + " and 设备名称 like '%" + dname + "%'";
            query = query + " and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%') and 数据类型='" + typename + "'";
            if (!startdate.Equals(""))
            {
                DateStart = Convert.ToDateTime(startdate);
                query = query + " and 记录时间>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                DateEnd = Convert.ToDateTime(enddate).AddDays(1);
                query = query + " and 记录时间<='" + DateEnd + "'";
            }
            return query;
        }

        string[] mExportHeader = { "设备编码", "设备名称", "记录时间", "测点编号", "测点名称", "测点位置", "监测位置", "测量值", "报警限值", "报警状态" };
        readonly int MAX_HISEXPORT = 3;

        //导出配电房数据列表到csv
        bool ExportCSV(string strFile, List<配电房_00001_历史数据表> list)
        {
            try
            {
                using (System.IO.StreamWriter file = new System.IO.StreamWriter(strFile))
                {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < mExportHeader.Length; i++)
                    {
                        sb.Append(mExportHeader[i]);
                        if (mExportHeader.Length - 1 > i)
                        {
                            sb.Append(",");
                        }
                    }
                    file.WriteLine(sb.ToString());
                    foreach (配电房_00001_历史数据表 his in list)
                    {
                        sb = new StringBuilder();
                        sb.Append(his.设备编码);
                        sb.Append(",");
                        sb.Append(his.设备名称);
                        sb.Append(",");
                        sb.Append(his.记录时间);
                        sb.Append(",");
                        sb.Append(his.测点编号);
                        sb.Append(",");
                        sb.Append(his.测点名称);
                        sb.Append(",");
                        sb.Append(his.测点位置);
                        sb.Append(",");
                        sb.Append(his.监测位置);
                        sb.Append(",");
                        sb.Append(his.测量值);
                        sb.Append(",");
                        sb.Append(his.报警限值);
                        sb.Append(",");
                        sb.Append(his.报警状态);
                        file.WriteLine(sb.ToString());
                    }
                }
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        //导出历史数据查询
        public string ExportHisData(int pid, string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "温度")
        {
            try
            {
                DateTime tStart = Convert.ToDateTime(startdate);
                DateTime tEnd = Convert.ToDateTime(enddate);
                string strQuery = GetHisQuery(pid, dname, cname, startdate, enddate, typename);
                //string strPath = Server.MapPath("~/Download/");
                //string strExport = "历史数据导出_" + DateTime.Now.ToString("yyyy-MM-dd HH_mm_ss") + ".csv";
                //string strFullExport = strPath + strExport;
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string strFullSql = String.Format("select * from {0} where {1}", tablename, strQuery);
                //List<配电房_00001_历史数据表> list = bll.ExecuteStoreQuery<配电房_00001_历史数据表>(strFullSql).ToList();
                //ExportCSV(strFullExport, list);
                DataSet ds = SQLtoDataSet.GetReportSummary(strFullSql);
                ExportExcel.doExport2003(ds, "~/DownLoad/historydata.xls");
                return "/DownLoad/historydata.xls";
            }
            catch (Exception ex)
            {
                return "Fail:" + ex.Message;
            }
            return "Fail";
        }

        //获取时刻测点数据查询条件
        //注:从 from开始，select字段由调用者控制
        string GetHistTimeCond(int pid, string dname = "", string cname = "", string seldatetime = "", string typename = "")
        {
            DateTime dtNow = DateTime.Now;
            string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
            string query = " 1=1";
            if (!dname.Equals("") && !dname.Equals("==全部=="))
                query = query + " and 设备名称 like '%" + dname + "%'";
            if (!cname.Equals("") && !cname.Equals("==全部=="))
                query = query + " and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%')";
            if (!typename.Equals("") && !typename.Equals("==全部=="))
                query = query + "and 数据类型='" + typename + "'";

            if (!seldatetime.Equals(""))
            {
                dtNow = Convert.ToDateTime(seldatetime);
            }
            query = query + " and 记录时间<='" + dtNow + "' and 记录时间>'" + dtNow.AddHours(-1) + "'";

            string sql = "from "
+ "("
+ " select row_number() over(partition by 测点编号 order by 记录时间 desc) as rownum "
+ ", *"
+ " from " + tablename + " where " + query
+ ") as T "
+ "where T.rownum = 1";
            return sql;
        }

        //导出时刻测点
        public string ExportHisTimeData1(int pid, string dname = "", string cname = "", string seldatetime = "", string typename = "")
        {
            string strQuery = GetHistTimeCond(pid, dname, cname, seldatetime, typename);
            string strConn = System.Configuration.ConfigurationManager.ConnectionStrings["S5000DB"].ToString();
            try
            {
                string strPath = Server.MapPath("~/Download/");
                string strExport = "历史数据导出_" + DateTime.Now.ToString("yyyy-MM-dd HH_mm_ss") + ".csv";
                string strFullExport = strPath + strExport;
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string strFullSql = String.Format("select * {1}", tablename, strQuery);
                List<配电房_00001_历史数据表> list = bll.ExecuteStoreQuery<配电房_00001_历史数据表>(strFullSql).ToList();
                ExportCSV(strFullExport, list);
                return strExport;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "";
        }

        //历史数据查询
        [Login]
        public ActionResult HisData(int rows, int page, int pid = 0, string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "温度")
        {
            try
            {
                if (pid == 0)
                {
                    pid = Convert.ToInt32(HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                    // pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                }
                string tablename = "配电房_" + pid.ToString("00000") + "_历史数据表";
                string query = GetHisQuery(pid, dname, cname, startdate, enddate, typename);
                var rowcounts = bll.P_HisDataCount(tablename, query).ToList();
                int rowcount = rowcounts[0].Value;
                List<配电房_00001_历史数据表> list = bll.P_HisData(tablename, "*", "记录时间", rows, page, true, query).ToList();

                //list = list.OrderByDescending(a => a.记录时间).OrderByDescending(a => a.记录时间).ToList();
                string strJson = Common.List2Json(list, rowcount);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //获取时刻测点数据
        public ActionResult HisTimeData(int rows, int page, int pid = 0, string dname = "", string cname = "", string seldatetime = "", string typename = "")
        {
            try
            {
                if (pid == 0)
                {
                    //pid = Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                    pid = Convert.ToInt32(HomeController.GetPID(CurrentUser.UNITList).Split(',')[0]);
                }

                string sql = "select * " + GetHistTimeCond(pid, dname, cname, seldatetime, typename);
                List<配电房_00001_历史数据表> list = bll.ExecuteStoreQuery<配电房_00001_历史数据表>(sql).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //报警数据查询
        [Login]
        public ActionResult AlarmDate(int rows, int page, int pid = 0, string startdate = "", string enddate = "", string typename = "")
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                if (!startdate.Equals(""))
                {
                    startdate = startdate.Replace('-', '/');
                }
                if (!enddate.Equals(""))
                {
                    enddate = enddate.Replace('-', '/');
                }
                else
                    enddate = DateTime.Now.ToString("yyyy/MM/dd");
                typename = typename.Replace("==全部==", "");

                string strquery = "select * from t_AlarmTable_en where AlarmDate>='" + startdate + "' and AlarmDate<='" + enddate + "'";
                if (!typename.Equals(""))
                    strquery = strquery + " and AlarmCate='" + typename + "'";
                if (pid > 0)
                    strquery = strquery + " and pid=" + pid;
                else
                    strquery = strquery + " and pid in (" + pdrlist + ")";
                //var query = from list in bll.t_AlarmTable_en where list.AlarmArea.Contains(pname) && list.AlarmCate.Contains(typename) && string.Compare(list.AlarmDate, startdate) >= 0 && string.Compare(list.AlarmDate, enddate) <= 0 select list;
                //List<string> sPDRNameOkList = getPDRNameOkList();//权限过滤 

                List<t_AlarmTable_en> list = bll.ExecuteStoreQuery<t_AlarmTable_en>(strquery).ToList();// bll.t_AlarmTable_en.Where(a => sPDRNameOkList.Contains(a.AlarmArea) && a.AlarmArea.Contains(pname) && a.AlarmCate.Contains(typename) && string.Compare(a.AlarmDate, startdate) >= 0 && string.Compare(a.AlarmDate, enddate) <= 0).ToList();
                //List<t_AlarmTable_en> alarmlist = query.ToList();
                list = list.OrderByDescending(a => a.AlarmDate).ThenByDescending(a => a.AlarmTime).ToList();
                string strJson = Common.List2Json(list, rows, page);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }

        //报警数据导出
        public ActionResult ExportAlarmData(int pid = 0, string startdate = "", string enddate = "", string typename = "")
        {
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string query = " where 1=1 ";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
                query = query + " and pid in (" + pdrlist + ")";
            if (!typename.Equals("") && !typename.Equals("==全部=="))
                query = query + " and AlarmCate='" + typename + "'";
            if (!startdate.Equals(""))
            {
                startdate = startdate.Replace('-', '/');
                query = query + " and AlarmDate>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                enddate = enddate.Replace('-', '/');
                query = query + " and AlarmDate<='" + enddate + "'";
            }
            string strsql = "select AlarmArea 监测设备,AlarmAddress 监测位置,AlarmDate +' '+ AlarmTime 报警时间,ALarmType 报警级别,AlarmValue 报警值,AlarmMaxValue 限值,AlarmCate 报警类型,AlarmConfirm 确认 from t_AlarmTable_en " + query;
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/alarmdata.xls");
            return Content("/DownLoad/alarmdata.xls");
        }
        //时间点测点数据导出
        public ActionResult ExportHisTimeData(int pid = 0, string dname = "", string cname = "", string seldatetime = "", string typename = "")
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                if (pid == 0)
                {
                    pid = Convert.ToInt32(pdrlist.Split(',')[0]);
                }
                string strsql = "select 记录时间, 配电房编号, 测点编号, 测点名称, 测量值, 安装地点, 数据类型, 测点位置, 监测位置, 设备名称, 设备编码, 单位名称, 报警状态, 报警限值 " + GetHistTimeCond(pid, dname, cname, seldatetime, typename);
                DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
                ExportExcel.doExport2003(ds, "~/DownLoad/timepoint.xls");
                return Content("/DownLoad/timepoint.xls");
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        #endregion
        //视频监控
        [Login]
        public ActionResult VideoInfo()
        {
            return View();
        }

        //  by zzz add 2015年11月3日16:43:31
        #region 报警状态查询
        /// <summary>
        /// 配电房报警状态实体
        /// </summary>
        public class PAlarmState
        {
            public int typeid { set; get; }
            public int state { set; get; }
            public string name { set; get; }
            public int pid { set; get; }
        }
        /// <summary>
        ///  配电房报警状态查询 
        /// </summary>
        [Login]
        public ActionResult getStationAlarm()
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //2017.7.12 针对雷山变多站数据合并的情况，修正地图页面报警状态显示
                string strsql = "select name,state,typeid,pid from ("
                    + "select row_number() over(partition by Name order by t.AlarmState desc) as rownums,Name name,t.AlarmState state,TypeID typeid,pid from ("
                    + "select row_number() over(partition by a.pid order by a.AlarmState desc) as rownum, a.pid, "
                    + "case  when parentid=0 then name  when parentid IS NULL  then name else (select Name from t_CM_PDRInfo where PID=p.ParentID) end Name"
                    + ",a.AlarmState,TypeID from t_AlarmTable_en a join t_CM_PDRInfo p on a.PID=p.PID "
                    + "where a.pid in (" + pdrlist + ")  and a.AlarmState>0)"
                    + " as t where t.rownum = 1)" + " m where m.rownums=1";

                List<PAlarmState> list = bll.ExecuteStoreQuery<PAlarmState>(strsql).ToList();
                string strJson = Common.ToJson(list);
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        /// <summary>
        ///  获取目前的工单、报警、隐患等数目 
        /// </summary>
        [Login]
        public ActionResult getTipsState()
        {
            try
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<int> Alist = bll.ExecuteStoreQuery<int>("SELECT PID FROM t_AlarmTable_en where PID in (" + pdrlist + ") and  AlarmState > 0 group by PID").ToList();
                List<t_CM_BugInfo> Blist = bll.ExecuteStoreQuery<t_CM_BugInfo>("SELECT * FROM t_CM_BugInfo where PID in (" + pdrlist + ") and HandeSituation in ('日常巡检','应急抢修')").ToList();
                List<t_PM_Order> Olist = bll.ExecuteStoreQuery<t_PM_Order>("SELECT * FROM t_PM_Order where PID in (" + pdrlist + ") and OrderState = 0").ToList();

                string strJson = "{\"AlarmTip\":" + Alist.Count() + ",\"BugTip\":" + Blist.Count + ",\"EnerTip\":" + 0 + ",\"OrderTip\": " + Olist.Count + "}";
                return Content(strJson);
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("");
            }
        }
        //获取当前用户权限内配电房列表       
        public ActionResult CurrentUserPDRList()
        {
            try
            {
                StringBuilder sblist = new StringBuilder();
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                string strJson = "";
                if (pdrlist != null && !pdrlist.Equals(""))
                {
                    string strsql = "select Name name,0 state,TypeID typeid from t_CM_PDRInfo where IsLast=1 and pid in (" + pdrlist + ") and pid not in (select PID from t_AlarmTable_en where alarmstate>0)";
                    List<PAlarmState> list = bll.ExecuteStoreQuery<PAlarmState>(strsql).ToList();  //query.ToList();
                    strJson = Common.ToJson(list);
                }
                return Content(strJson);
            }
            catch (Exception ex)
            {
                return Content("");
            }
        }
        //获取配电房的报警信息
        public ActionResult getDAlarmState(int pid = 8)
        {
            string strJson = "null";
            if (pid > 0)
            {
                string strsql = "";

                strsql = "select ISNULL(DID,0) DID,T.AlarmState from ( select row_number() over(partition by did order by a.AlarmState desc) as rownum, DID,a.AlarmState from t_AlarmTable_en a "
+ " join t_CM_PDRInfo p on a.PID=p.PID where (p.parentid=" + pid + " or p.PID=" + pid + ") and a.AlarmState>0) as T WHERE T.rownum = 1";
                //+ " union "
                //+ "select DID,1 AlarmState  from V_DeviceInfoState_PDR1 where AlarmStatus!='正常' and PID=" + pid;             
                List<DAlarmInfo> list = bll.ExecuteStoreQuery<DAlarmInfo>(strsql).ToList();
                if (list.Count > 0)
                    strJson = Common.ToJson(list);
            }
            return Content(strJson);
        }
        //获取水侵、烟感的报警信息
        public string getAlarmFromRealTime(int pid)
        {
            string strsql = "select TagID from V_DeviceInfoState_PDR1 where PID=" + pid + " and DataTypeID=23 and AlarmStatus!='正常'";
            List<int> list = bll.ExecuteStoreQuery<int>(strsql).ToList();
            string strJson = "";
            if (list.Count > 0)
                strJson = Common.ToJson(list);
            return strJson;

        }
        //获取竖井的报警信息
        public ActionResult getShaftAlarmState(int pid = 104)
        {
            string strJson = "";
            if (pid > 0)
            {
                string strsql = "select DID,AlarmState,AlarmValue,AlarmAddress from "
+ "("
+ " select row_number() over(partition by did order by AlarmState desc) as rownum"
+ ", *"
+ " from t_AlarmTable_en where DID in(select DID from t_DM_DeviceInfo where PID=" + pid + " and DID >=422 and DID <= 437 or DID = 397) and AlarmState>0"
+ ") as T "
+ "where T.rownum = 1";
                List<DAlarmInfo> list = bll.ExecuteStoreQuery<DAlarmInfo>(strsql).ToList();
                if (list.Count > 0)
                    strJson = Common.ToJson(list);
            }
            return Content(strJson);
        }
        public class DAlarmInfo
        {
            public int DID { get; set; }
            public int AlarmState { get; set; }
            public double AlarmValue { get; set; }
            public string AlarmAddress { get; set; }
        }

        public ActionResult GetConTep()
        {
            bool reslut = false;
            try
            {
                using (pdermsWebEntities bll = new pdermsWebEntities())
                {
                    var list = bll.t_ES_ContractTemplet.Where(p => p.IsOk == 0).ToList();
                    foreach (var item in list)
                    {
                        if (item.StartTime <= DateTime.Now.AddDays(Convert.ToDouble(item.BeforDay)))
                        {
                            reslut = true;
                            break;
                        }
                    }
                }
            }
            catch (Exception e)
            {

            }
            return Json(reslut);
        }
        /// <summary>
        /// 取得权限配电房列表
        /// </summary>
        List<string> getPDRNameOkList()
        {
            try
            {
                List<string> sPDRNameOkList = new List<string>();
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                sPDRNameOkList.Clear();
                if (pdrlist != null && !pdrlist.Equals(""))
                {
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    var query = from module in bll.t_CM_PDRInfo where listid.Contains(module.PID) select module;
                    List<t_CM_PDRInfo> list = query.ToList();
                    foreach (t_CM_PDRInfo module in list)
                    {
                        sPDRNameOkList.Add(module.Name);
                    }
                }
                return sPDRNameOkList;

            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return null;
            }
        }

        string getUserPDRList()
        {
            try
            {
                string strresult = "";
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                if (pdrlist != null && !pdrlist.Equals(""))
                {
                    List<int> listid = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                    var query = from module in bll.t_CM_PDRInfo where listid.Contains(module.PID) select module;
                    List<t_CM_PDRInfo> list = query.ToList();
                    foreach (t_CM_PDRInfo module in list)
                    {
                        strresult = strresult + "'" + module.Name + "',";
                    }
                }
                if (!strresult.Equals(""))
                    strresult = strresult.TrimEnd(',');
                return strresult;

            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return null;
            }
        }


        /// <summary>
        /// 确认所有报警
        /// add by zzz 2016年1月4日11:26:52
        /// </summary>
        /// <returns></returns>
        public ActionResult DelAllPAlarm()
        {
            try
            {
                List<string> sPDRNameOkList = getPDRNameOkList();//权限过滤
                string sWhere = "";
                string sSql = "";
                foreach (string sPDRName in sPDRNameOkList)
                {
                    if (sWhere.Equals(""))
                        sWhere = " where AlarmState != 0 and (Company = '" + sPDRName + "'";
                    else
                        sWhere = sWhere + " or " + " Company = '" + sPDRName + "' ";

                }
                if (!sWhere.Equals(""))
                {
                    sWhere = sWhere + ")";

                    //循环插入每条记录对应的 确认 记录；
                    var query = from module in bll.t_AlarmTable_en where sPDRNameOkList.Contains(module.Company) && module.AlarmState != 0 select module;
                    List<t_AlarmTable_en> list = query.ToList();
                    foreach (t_AlarmTable_en module in list)
                    {
                        sSql = "update [t_AlarmTable_en] set AlarmConfirm='确认',UserName='" + CurrentUser.UserName + "',ConfirmDate='" + DateTime.Now + "' where ALarmID=" + module.AlarmID;
                        bll.ExecuteStoreCommand(sSql);
                    }

                    //
                    sSql = "update  t_AlarmTable_en set  AlarmState = 0 " + sWhere;
                    bll.ExecuteStoreCommand(sSql);

                    //sSql = "INSERT INTO [t_AlarmTable_en] (AlarmDate,AlarmTime,Company,AlarmConfirm,UserName)  VALUES (CONVERT(varchar(12) , getdate(), 111 ) ,CONVERT(varchar(12) , getdate(), 108 ),'确认','" + CurrentUser.UserName + "_" + CurrentUser.Company + "') ";
                    //bll.ExecuteStoreCommand(sSql);
                    return Content("报警已全部确认！");
                }
                else
                {
                    return Content("没有权限，报警未确认！");
                }
            }
            catch (Exception ex)
            {
                string error = ex.ToString();
                return Content("报警确认失败！");
            }
        }
        #endregion


        #region 报警值设置

        //获取温升速率报警设置列表
        public ActionResult WarmSetInfoData(int rows, int page, int pid = 0, int did = 0, int datatypeid = 0, string position = "")
        {
            string query = " 1=1";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pidlist = CurrentUser.PDRList;
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;
            if (datatypeid > 0)
                query = query + " and datatypeid=" + datatypeid;
            if (!position.Equals("") && position != null)
                query = query + " and Position like '%" + position + "%'";
            //string strsql = "select * from V_AlarmSetting where " + query;
            List<V_WarmSetting> list = bll.PROC_WarmSet("V_WarmSetting", "*", "pid", rows, page, true, query).ToList();
            var rowcounts = bll.P_HisDataCount("V_WarmSetting", query).ToList();
            int rowcount = rowcounts[0].Value;
            string strJson = Common.List2Json(list, rowcount);
            return Content(strJson);
        }
        //获取温升速率报警设置数据实体
        public ActionResult WarmSetModel(int tagid)
        {
            string strJson = "";
            List<V_WarmSetting> list = bll.V_WarmSetting.Where(a => a.TagID == tagid).ToList();
            if (list.Count > 0)
            {
                V_WarmSetting model = list.First();
                strJson = JsonConvert.SerializeObject(model);
            }
            return Content(strJson);
        }
        //温升速率报警设置
        public ActionResult SaveWarmSetModel(t_CM_WarmSet model)
        {
            int tagid = (int)model.TagID;
            double aival = Convert.ToDouble(model.IntersetVal);
            double awval = Convert.ToDouble(model.WarningVal);
            double aaval = Convert.ToDouble(model.AlarmVal);
            List<t_CM_WarmSet> list = bll.t_CM_WarmSet.Where(a => a.TagID == tagid).ToList();
            if (list.Count > 0)
            {
                t_CM_WarmSet alarmset = list.First();
                double bival = Convert.ToDouble(alarmset.IntersetVal);
                double bwval = Convert.ToDouble(alarmset.WarningVal);
                double baval = Convert.ToDouble(alarmset.AlarmVal);
                alarmset.WarningVal = model.WarningVal;
                alarmset.AlarmVal = model.AlarmVal;
                alarmset.IntersetVal = model.IntersetVal;
                alarmset.UpdateDate = DateTime.Now;
                alarmset.Updater = CurrentUser.UserName;
                alarmset.IsUpdate = 1;
                bll.ObjectStateManager.ChangeObjectState(alarmset, EntityState.Modified);
                bll.SaveChanges();
                Common.InsertLog("温升速率报警值设置", CurrentUser.UserName, "设置报警值:原值[" + bival + "," + bwval + "," + baval + "]修改后的值[" + aival + "," + awval + "," + aaval + "]");
            }
            else
            {
                model.UpdateDate = DateTime.Now;
                model.Updater = CurrentUser.UserName;
                model.IsUpdate = 1;
                bll.t_CM_WarmSet.AddObject(model);
                bll.SaveChanges();
                Common.InsertLog("温升速率报警值设置", CurrentUser.UserName, "新增报警值[" + aival + "," + awval + "," + aaval + "]");
            }
            return Content("1");
        }

        //温升速率报警设置数据导出
        public ActionResult ExportWarmSet(int pid = 0, int did = 0, int datatypeid = 0, string position = "")
        {

            string query = " where 1=1 ";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pidlist = CurrentUser.PDRList;
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;
            if (datatypeid > 0)
                query = query + " and datatypeid=" + datatypeid;
            if (!position.Equals(""))
                query = query + " and Position like '%" + datatypeid + "%'";

            string strsql = "select TagID 编号,PName 变电站名称,DeviceName 设备名称,DataTypeName 测点类型,Position 位置,AlarmVal 报警值 ,WarningVal 预警值,IntersetVal 关注值 from V_WarmSetting " + query;
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/warmset.xls");
            return Content("/DownLoad/warmset.xls");
        }



        //获取阀值报警设置列表
        public ActionResult AlarmSetInfoData(int rows, int page, int pid = 0, int did = 0, int datatypeid = 0, string position = "")
        {
            string query = " 1=1";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                //string pidlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;
            if (datatypeid > 0)
                query = query + " and datatypeid=" + datatypeid;
            if (!position.Equals("") && position != null)
                query = query + " and Position like '%" + position + "%'";
            //string strsql = "select * from V_AlarmSetting where " + query;
            List<V_AlarmSetting> list = bll.PROC_AlarmSet("V_AlarmSetting", "*", "pid", rows, page, true, query).ToList();
            var rowcounts = bll.P_HisDataCount("V_AlarmSetting", query).ToList();
            int rowcount = rowcounts[0].Value;
            string strJson = Common.List2Json(list, rowcount);
            return Content(strJson);
        }
        //获取阀值报警设置数据实体
        public ActionResult AlarmSetModel(int tagid)
        {
            string strJson = "";
            List<V_AlarmSetting> list = bll.V_AlarmSetting.Where(a => a.TagID == tagid).ToList();
            if (list.Count > 0)
            {
                V_AlarmSetting model = list.First();
                strJson = JsonConvert.SerializeObject(model);
            }
            return Content(strJson);
        }
        //保存阀值报警设置
        public ActionResult SaveAlarmSetModel(t_CM_AlarmSet model)
        {
            int tagid = (int)model.TagID;
            double aival = Convert.ToDouble(model.IntersetVal);
            double awval = Convert.ToDouble(model.WarningVal);
            double aaval = Convert.ToDouble(model.AlarmVal);
            List<t_CM_AlarmSet> list = bll.t_CM_AlarmSet.Where(a => a.TagID == tagid).ToList();
            if (list.Count > 0)
            {
                t_CM_AlarmSet alarmset = list.First();
                double bival = Convert.ToDouble(alarmset.IntersetVal);
                double bwval = Convert.ToDouble(alarmset.WarningVal);
                double baval = Convert.ToDouble(alarmset.AlarmVal);
                alarmset.WarningVal = model.WarningVal;
                alarmset.AlarmVal = model.AlarmVal;
                alarmset.IntersetVal = model.IntersetVal;
                alarmset.UpdateDate = DateTime.Now;
                alarmset.Updater = CurrentUser.UserName;
                alarmset.IsUpdate = 1;
                bll.ObjectStateManager.ChangeObjectState(alarmset, EntityState.Modified);
                bll.SaveChanges();
                Common.InsertLog("报警值设置", CurrentUser.UserName, "设置报警阀值:原值[" + bival + "," + bwval + "," + baval + "]修改后的值[" + aival + "," + awval + "," + aaval + "]");
            }
            else
            {
                model.UpdateDate = DateTime.Now;
                model.Updater = CurrentUser.UserName;
                model.IsUpdate = 1;
                bll.t_CM_AlarmSet.AddObject(model);
                bll.SaveChanges();
                Common.InsertLog("报警值设置", CurrentUser.UserName, "新增报警阀值[" + aival + "," + awval + "," + aaval + "]");
            }
            return Content("1");
        }

        //阀值报警设置数据导出
        public ActionResult ExportAlarmSet(int pid = 0, int did = 0, int datatypeid = 0, string position = "")
        {

            string query = " where 1=1 ";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                //string pidlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;
            if (datatypeid > 0)
                query = query + " and datatypeid=" + datatypeid;
            if (!position.Equals(""))
                query = query + " and Position like '%" + datatypeid + "%'";

            string strsql = "select TagID 编号,PName 变电站名称,DeviceName 设备名称,DataTypeName 测点类型,Position 位置,AlarmVal 报警值 ,WarningVal 预警值,IntersetVal 关注值 from V_AlarmSetting " + query;
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/alarmset.xls");
            return Content("/DownLoad/alarmset.xls");
        }

        //获取相间报警设置数据实体
        public ActionResult AlternateSetModel(int asid)
        {
            string strJson = "";
            List<t_CM_AlternateSet> list = bll.t_CM_AlternateSet.Where(a => a.AlternateID == asid).ToList();
            if (list.Count > 0)
            {
                t_CM_AlternateSet model = list.First();
                strJson = JsonConvert.SerializeObject(model);
            }
            return Content(strJson);
        }
        //保存相间报警设置
        public ActionResult SaveAlternateSetModel(t_CM_AlternateSet model)
        {
            int asid = (int)model.AlternateID;
            double aival = Convert.ToDouble(model.IntersetVal);
            double awval = Convert.ToDouble(model.WarningVal);
            double aaval = Convert.ToDouble(model.AlarmVal);
            List<t_CM_AlternateSet> list = bll.t_CM_AlternateSet.Where(a => a.AlternateID == asid).ToList();
            if (list.Count > 0)
            {
                t_CM_AlternateSet alarmset = list.First();
                double bival = Convert.ToDouble(alarmset.IntersetVal);
                double bwval = Convert.ToDouble(alarmset.WarningVal);
                double baval = Convert.ToDouble(alarmset.AlarmVal);
                alarmset.TagID = model.TagID;
                alarmset.WarningVal = model.WarningVal;
                alarmset.AlarmVal = model.AlarmVal;
                alarmset.IntersetVal = model.IntersetVal;
                alarmset.UpdateDate = DateTime.Now;
                alarmset.Updater = CurrentUser.UserName;
                bll.ObjectStateManager.ChangeObjectState(alarmset, EntityState.Modified);
                bll.SaveChanges();
                Common.InsertLog("报警值设置", CurrentUser.UserName, "设置相间报警:原值[" + bival + "," + bwval + "," + baval + "]修改后的值[" + aival + "," + awval + "," + aaval + "]");
            }
            return Content("1");
        }
        //相间报警设置数据导出
        public ActionResult ExportAlternateSet(int pid = 0, int did = 0)
        {

            string query = " where 1=1 ";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                //string pidlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;

            string strsql = "select AlternateID 编号,PName 变电站名称,DName 设备名称,Position 测点位置,MPID 监测位置,IntersetVal 关注值,WarningVal 预警值,AlarmVal 报警值,TagID 环境温度编号, TagID_A A相测点编号, TagID_B B相测点编号, TagID_C C相测点编号 from t_CM_AlternateSet " + query;
            DataSet ds = SQLtoDataSet.GetReportSummary(strsql);
            ExportExcel.doExport2003(ds, "~/DownLoad/AlternateSet.xls");
            return Content("/DownLoad/AlternateSet.xls");
        }
        //获取相间报警设置列表
        public ActionResult AlternateSetInfoData(int rows, int page, int pid = 0, int did = 0)
        {
            string query = " 1=1";
            if (pid > 0)
                query = query + " and pid=" + pid;
            else
            {
                //string pidlist = CurrentUser.PDRList;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                query = query + " and pid in (" + pdrlist + ")";
            }
            if (did > 0)
                query = query + " and did=" + did;
            string strsql = "select * from t_CM_AlternateSet where " + query;
            //List<V_AlarmSetting> list = bll.PROC_AlarmSet("V_AlarmSetting", "*", "pid", rows, page, true, query).ToList();
            List<t_CM_AlternateSet> list = bll.ExecuteStoreQuery<t_CM_AlternateSet>(strsql).ToList();
            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        //遍历配电房，设置值(相间)
        public ActionResult TraversalPDR(int pid = 0)
        {
            if (pid == 0)
            {
                List<t_CM_PDRInfo> plist = bll.t_CM_PDRInfo.ToList();
                foreach (t_CM_PDRInfo pdrinfo in plist)
                {
                    ResetAlternate(pdrinfo.PID);
                }
            }
            else
                ResetAlternate(pid);
            return Content("success!");
        }
        //重置相间温度值
        private void ResetAlternate(int pid = 1)
        {
            string strsql = "SELECT p.TagID, d.PID, d.PName, p.DID, d.DeviceName, p.Position,P.MPID,D.DTID FROM t_CM_PointsInfo AS p JOIN t_DM_DeviceInfo AS d ON p.DID = d.DID WHERE P.DataTypeID=1 and mpid>0 ";
            if (pid > 0)
                strsql = strsql + " and p.pid=" + pid;
            //去掉重复项，只获取三相数据
            strsql = strsql + " and (Position like '%a%' or Position like '%b%' or Position like '%c%') and TagID not in (select TagID_A from t_CM_AlternateSet) and TagID not in (select TagID_B from t_CM_AlternateSet) and TagID not in (select TagID_C from t_CM_AlternateSet) order by DID,Position";
            int pcount = 0;//计算器，计算ABC三相数据
            double AlarmVal = 85, WarningVal = 75, IntersetVal = 65;
            List<BasicAlternate> list = bll.ExecuteStoreQuery<BasicAlternate>(strsql).ToList();
            string bPosition = "", cPosition = "";
            int eid = 0, bdid = 0, cdid = 0;//室内环境tagid
            strsql = "select top 1 TagID from t_CM_PointsInfo where  DataTypeID=12 and DID in (select DID from t_DM_DeviceInfo where PID=" + pid + ")";
            List<int> eids = bll.ExecuteStoreQuery<int>(strsql).ToList();
            if (eids.Count > 0)
                eid = eids[0];
            if (eid > 0)//如果没有环境温度的值。取消执行
            {
                t_CM_AlternateSet model = new t_CM_AlternateSet();
                foreach (BasicAlternate alternate in list)
                {
                    if (hasABC(alternate.Position))
                    {
                        cPosition = getPositionName(alternate.Position);
                        cdid = alternate.DID;
                        if (cPosition.Equals(bPosition) && cdid == bdid)
                        {
                            if (pcount % 3 == 1)
                                model.TagID_B = alternate.TagID;
                            else if (pcount % 3 == 2)
                            {
                                model.TagID_C = alternate.TagID;
                                if (pcount == list.Count - 1)
                                {
                                    bll.t_CM_AlternateSet.AddObject(model);
                                    bll.SaveChanges();
                                    Common.InsertLog("相间报警设置", "系统管理员", "设置相间报警值[" + cPosition + "(" + model.DName + ")]");
                                }
                            }
                        }
                        else
                        {
                            if (pcount > 0 && pcount % 3 == 0)
                            {
                                bll.t_CM_AlternateSet.AddObject(model);
                                bll.SaveChanges();
                                Common.InsertLog("相间报警设置", "系统管理员", "设置相间报警值[" + cPosition + "(" + model.DName + ")]");
                            }
                            model = new t_CM_AlternateSet();
                            model.AlarmVal = AlarmVal;
                            model.DID = alternate.DID;
                            model.DName = alternate.DeviceName;
                            model.DTID = alternate.DTID;
                            model.IntersetVal = IntersetVal;
                            model.MPID = alternate.MPID;
                            model.PID = alternate.PID;
                            model.PName = alternate.PName;
                            model.Position = cPosition;
                            model.UpdateDate = DateTime.Now;
                            model.Updater = "系统管理员";
                            model.WarningVal = WarningVal;
                            model.TagID = eid;
                            model.TagID_A = alternate.TagID;
                        }
                        bPosition = cPosition;
                        bdid = cdid;
                        pcount++;
                    }
                }
            }
        }
        //是否存在三相测点
        private bool hasABC(string position)
        {
            if (position.ToLower().Contains("a") || position.ToLower().Contains("b") || position.ToLower().Contains("c"))
                return true;
            else
                return false;
        }
        //获取测点位置
        private string getPositionName(string position)
        {
            string result = position;
            if (position.ToLower().Contains("a"))
                result = position.ToLower().Split('a')[0];
            else if (position.ToLower().Contains("b"))
                result = position.ToLower().Split('b')[0];
            else if (position.ToLower().Contains("c"))
                result = position.ToLower().Split('c')[0];
            return result.ToUpper();
        }
        public class BasicAlternate
        {
            public int TagID { get; set; }
            public int PID { get; set; }
            public string PName { get; set; }
            public int DID { get; set; }
            public string DeviceName { get; set; }
            public string Position { get; set; }
            public int MPID { get; set; }
            public int DTID { get; set; }

        }
        #endregion


        #region 单位管理

        //获取单位信息
        [Login]
        public ActionResult UnitListData(int rows, int page, int type, string unitname = "", string linkman = "")
        {
            List<t_CM_Unit> list = new List<t_CM_Unit>();
            if (CurrentUser.RoleID == 1)
                list = bll.t_CM_Unit.Where(p => p.Type == type).ToList();
            else
            {
                string str = "";
                if (Convert.ToBoolean(CurrentUser.IsAdmin))
                {
                    var Ulist = bll.t_CM_UserInfo.Where(p => p.UID == CurrentUser.UID).ToList();
                    foreach (var item in Ulist)
                    {
                        if (!string.IsNullOrEmpty(item.UNITList))
                            str += item.UNITList + ",";
                    }
                    if (!string.IsNullOrEmpty(str))
                        str = str.Substring(0, str.Length - 1);

                }
                else
                {
                    str = CurrentUser.UNITList;
                }
                if (string.IsNullOrEmpty(str))
                {
                    return Content("");
                }
                List<int> resultlist = new List<string>(str.Split(',')).ConvertAll(i => int.Parse(i));
                var query = from model in bll.t_CM_Unit where model.UnitName.Contains(unitname) && model.LinkMan.Contains(linkman) && resultlist.Contains(model.UnitID) && model.Type == type select model;
                list = query.ToList();
            }
            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        //保存单位信息
        [Login]
        public ActionResult SaveUnit(t_CM_Unit info)
        {
            string result = "OK";
            try
            {
                List<t_CM_Unit> list = bll.t_CM_Unit.Where(p => p.UnitName == info.UnitName && p.UnitID != info.UnitID).ToList();
                if (list.Count > 0)
                    result = "此单位已存在，请重新录入！ ";
                else
                {
                    if (info.UnitID > 0)
                    {
                        t_CM_Unit Unit = bll.t_CM_Unit.Where(r => r.UnitID == info.UnitID).First();
                        Unit.UnitName = info.UnitName;
                        Unit.UnitLogo = info.UnitLogo;
                        Unit.UnitProvince = info.UnitProvince;
                        Unit.UnitCity = info.UnitCity;
                        Unit.LinkAddress = info.LinkAddress;
                        Unit.LinkMan = info.LinkMan;
                        Unit.LinkMobile = info.LinkMobile;
                        Unit.LinkPhone = info.LinkPhone;
                        Unit.Email = info.Email;
                        Unit.IndustryID = info.IndustryID;
                        Unit.EleCalWay = info.EleCalWay;
                        Unit.GovEleLevel = info.GovEleLevel;
                        Unit.DeviationMode = info.DeviationMode;
                        Unit.InstalledCapacity = info.InstalledCapacity;
                        Unit.InstalledCapacitys = info.InstalledCapacitys;
                        Unit.Loss = info.Loss;
                        Unit.LossAdd = info.LossAdd;
                        Unit.CSMMan = info.CSMMan;
                        Unit.CSMPhone = info.CSMPhone;
                        //Unit.SpareBase = info.SpareBase;
                        Unit.Coordination = info.Coordination;
                        Unit.PDRList = info.PDRList;
                        Unit.companyName = info.companyName;
                        Unit.Nature = info.Nature;
                        Unit.ProjectType = info.ProjectType;
                        Unit.LastYearPower = info.LastYearPower;
                        bll.ObjectStateManager.ChangeObjectState(Unit, EntityState.Modified);
                        bll.SaveChanges();
                        Common.InsertLog("单位管理", CurrentUser.UserName, "编辑单位信息[" + Unit.UnitName + "]");
                        result = "OKedit";
                    }
                    else
                    {

                        bll.t_CM_Unit.AddObject(info);

                        bll.SaveChanges();
                        t_CM_UserInfo user = bll.t_CM_UserInfo.Where(p => p.UserID == CurrentUser.UserID).FirstOrDefault();
                        if (user != null)
                        {
                            if (!string.IsNullOrEmpty(user.UNITList))
                            {
                                user.UNITList = user.UNITList + "," + info.UnitID;
                            }
                            else
                            {
                                user.UNITList = info.UnitID.ToString();
                            }
                            bll.ObjectStateManager.ChangeObjectState(user, EntityState.Modified);
                            bll.SaveChanges();
                        }
                        Session["Huerinfo"] = user;

                        Common.InsertLog("单位管理", CurrentUser.UserName, "新增单位信息[" + info.UnitName + "]");
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
        //删除单位信息
        [Login]
        public ActionResult DeleteUnit(string uid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(uid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_Unit> list = bll.t_CM_Unit.Where(m => resultlist.Any(a => a == m.UnitID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_Unit.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("单位管理", CurrentUser.UserName, "删除单位信息[" + uid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }


        [Login]
        public ActionResult UnitTypeComboxData()
        {
            string sql = "SELECT * FROM t_CM_UnitProjectType";
            List<t_CM_UnitProjectType> list = bll.ExecuteStoreQuery<t_CM_UnitProjectType>(sql).ToList();
            return Json(list);
        }

        public ActionResult Upload(HttpPostedFileBase fileData, string folder, int uid, string ctype = "image")
        {
            if (fileData != null)
            {
                try
                {
                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "/Content/images/logo/";
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

                    return Content(url + saveName);
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

        #region 温度差值报警

        //获取单位信息
        [Login]
        public ActionResult IODiffListData(int rows, int page, string unitname = "", string linkman = "")
        {
            //string pdrlist = CurrentUser.PDRList;
            string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
            string SQL = "select * from t_CM_IODiffSet ";
            List<t_CM_IODiffSet> list = bll.ExecuteStoreQuery<t_CM_IODiffSet>(SQL).ToList();
            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        //找到匹配的出线测温点
        public string FindOtherPoint(int TagID)
        {
            string result = "null";
            List<t_CM_PointsInfo> plist = bll.t_CM_PointsInfo.Where(o => o.TagID == TagID).ToList();
            if (plist.Count > 0)
            {
                t_CM_PointsInfo po = plist[0];
                int DID = po.DID;
                int ABCID = po.ABCID.Value;
                int DataTypeID = po.DataTypeID.Value;
                int MPID = po.MPID.Value;
                List<t_CM_PointsInfo> oplist = bll.t_CM_PointsInfo.Where(o => o.DID == DID && o.PIOID == 0 && o.ABCID == ABCID && o.DataTypeID == DataTypeID && o.MPID == MPID && o.TagID != TagID).ToList();
                if (oplist.Count > 0)
                {
                    result = "{\"TagID\": " + oplist[0].TagID + ",\"TagName\":\"" + oplist[0].Remarks + "\"}";
                }
            }
            return result;
        }
        //获取相间报警设置数据实体
        public ActionResult IODiffSetModel(int asid)
        {
            string strJson = "";
            List<t_CM_IODiffSet> list = bll.t_CM_IODiffSet.Where(a => a.AlternateID == asid).ToList();
            if (list.Count > 0)
            {
                t_CM_IODiffSet model = list.First();
                strJson = JsonConvert.SerializeObject(model);
            }
            return Content(strJson);
        }
        //保存配置信息
        [Login]
        public ActionResult SaveAlarmConfig(t_CM_IODiffSet info)
        {
            string result = "KO";
            try
            {
                if (info.AlternateID > 0)
                {
                    List<V_DeviceDetail> dlist = bll.V_DeviceDetail.Where(o => o.DID == info.DID).ToList();
                    t_CM_IODiffSet Unit = bll.t_CM_IODiffSet.Where(r => r.AlternateID == info.AlternateID).First();
                    Unit.PID = info.PID;
                    Unit.PName = dlist[0].PName;
                    Unit.DID = info.DID;
                    Unit.DName = dlist[0].DeviceName;
                    Unit.CID = info.CID;
                    Unit.CName = info.CName;
                    Unit.MPID = info.MPID;
                    Unit.TagID_I = info.TagID_I;
                    Unit.TagID_O = info.TagID_O;
                    Unit.Position = info.Position;
                    Unit.AlarmVal = info.AlarmVal;
                    Unit.WarningVal = info.WarningVal;
                    Unit.IntersetVal = info.IntersetVal;
                    Unit.IsUpdate = 1;
                    Unit.UpdateDate = DateTime.Now;
                    Unit.Updater = CurrentUser.UserName;
                    bll.ObjectStateManager.ChangeObjectState(Unit, EntityState.Modified);
                    bll.SaveChanges();
                    Common.InsertLog("报警管理", CurrentUser.UserName, "编辑进出线温差报警配置[" + info.AlternateID + "]");
                    result = "OK";
                }
                else
                {
                    List<V_DeviceDetail> dlist = bll.V_DeviceDetail.Where(o => o.DID == info.DID).ToList();
                    info.PName = dlist[0].PName;
                    info.DName = dlist[0].DeviceName;
                    info.IsUpdate = 0;
                    info.UpdateDate = DateTime.Now;
                    info.Updater = CurrentUser.UserName;
                    bll.t_CM_IODiffSet.AddObject(info);
                    bll.SaveChanges();
                    Common.InsertLog("报警管理", CurrentUser.UserName, "新增进出线温差报警配置[" + info.AlternateID + "]");
                    result = "OK";
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString();
                result = "出错了！";
            }
            return Content(result);
        }
        //删除单位信息
        [Login]
        public ActionResult DeleteAlarmConfig(string uid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(uid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_CM_IODiffSet> list = bll.t_CM_IODiffSet.Where(m => resultlist.Any(a => a == m.AlternateID)).ToList();
                list.ForEach(i =>
                {
                    bll.t_CM_IODiffSet.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("报警管理", CurrentUser.UserName, "删除进出线温差报警配置[" + uid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        #endregion

#region  一次图编辑工具
        public ActionResult OneGraphEdit()
        {
            return View();
        }
#endregion
    }
}