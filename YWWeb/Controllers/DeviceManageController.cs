using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
//using System.Data.Objects;
//using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using YWWeb.PubClass;

namespace YWWeb.Controllers
{
    public class DeviceManageController : Controller
    {
        //设备管理
        // GET: /DeviceManage/
        pdermsWebEntities bll = new pdermsWebEntities();
        LoginAttribute loginbll = new LoginAttribute();
        [Login]
        public ActionResult Index()
        {
            return View();
        }
        [Login]
        public ActionResult IndexRealTime()
        {
            return View();
        }
        [Login]
        public ActionResult Video()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceList()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceInfo()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceEdits()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceState()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceRealTimeGraph()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceHistoryGraph()
        {
            return View();
        }
        [Login]
        public ActionResult DeviceAccount()
        {
            return View();
        }
        [Login]
        public ActionResult ArchivesManage()
        {
            return View();
        }
        public ActionResult VideoTest()
        {
            return View();
        }

        //操作数据库门禁开关；
        public ActionResult changeDoorStatus(int doorId)
        {
            try
            {
                string strJson = "";
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                if (pdrlist == null)
                    return Content("");
                List<t_CM_Door> listDoors = bll.ExecuteStoreQuery<t_CM_Door>("SELECT * FROM t_CM_Door WHERE DoorId=" + doorId).ToList();
                if (listDoors != null && listDoors.Count > 0)
                {

                    int goToStatus=listDoors[0].DoorStatus==0?1:0;
                    bll.ExecuteStoreCommand("UPDATE t_CM_Door SET GoToStatus=" + goToStatus + " WHERE DoorId=" + doorId);
                    strJson = "{\"resultCode\": 0,\"doorId\": " + doorId + ",\"DoorStatus\": " + bll.ExecuteStoreQuery<t_CM_Door>("SELECT * FROM t_CM_Door WHERE DoorId=" + doorId).ToList()[0].DoorStatus + "}";
                } 
                return Content(strJson);
            }
            catch
            {
                return Content("{\"resultCode\": 1,\"doorId\": "+doorId+",\"DoorStatus\": 0}");
            }
        }
        public ActionResult getDoorsStatus()
        {
            try
            {
                string strJson = "";
                int statusNow = 0;
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                if (pdrlist == null)
                    return Content("");
                List<t_CM_Door> listDoors=  bll.t_CM_Door.ToList();
                strJson = "{\"resultCode\": 0,\"listDoors\": " + JsonConvert.SerializeObject(listDoors) + "}";
                return Content(strJson);
            }
            catch
            {
                return Content("{\"resultCode\": 1,\"listDoors\": []}");
            }
        }
        [Login]
        public ActionResult DeviceManage()
        {
            return View();
        }
        [Login]
        public ActionResult CircuitManage()
        {
            return View();
        }
        [Login]
        public ActionResult CircuitEdit()
        {
            return View();
        }
        [Login]
        public ActionResult ElectricMeterEdit()
        {
            return View();
        }
        # region 设备管理
        //获取设备列表
        [Login]
        public ActionResult DeviceInfoData(int rows, int page, string DeviceName = "", string MFactory = "", int pid = 0)
        {
            List<t_DM_DeviceInfo> list = null;
            if (pid == 0)
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));
                var query = from model in bll.t_DM_DeviceInfo where resultlist.Contains((int)model.PID) && model.DeviceName.Contains(DeviceName) && model.DTID != 8 orderby model.OrderBy select model;
                if (!MFactory.Equals(""))
                    query = from model in bll.t_DM_DeviceInfo where resultlist.Contains((int)model.PID) && model.DeviceName.Contains(DeviceName) && model.DTID != 8 && model.MFactory.Contains(MFactory) orderby model.OrderBy select model;
                list = query.ToList();
            }
            else
            {
                var query = from model in bll.t_DM_DeviceInfo where model.PID == pid && model.DeviceName.Contains(DeviceName) && model.DTID != 8 && model.MFactory.Contains(MFactory) orderby model.OrderBy select model;
                list = query.ToList();
            }

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }
        //加载附件文件信息《编辑设备时调用，可操作》
        [Login]
        public ActionResult LoadDeviceFile(int DID, string type)
        {
            List<t_DM_DevicesFiles> list = bll.t_DM_DevicesFiles.Where(d => d.fk_DID == DID && d.FileType == type).ToList();
            string result = "";
            if (list.Count > 0)
                result = LoadFileInfo(list, type);
            string strJson = JsonConvert.SerializeObject(result);
            return Content(strJson);
        }
        //加载附件文件信息
        private string LoadFileInfo(List<t_DM_DevicesFiles> list, string type)
        {
            StringBuilder sb = new StringBuilder();
            int count = 0;
            foreach (t_DM_DevicesFiles t in list)
            {
                sb.Append(string.Concat(new object[]
                {
                    "<div id=\""+type+"_"+count+"\" class=\"uploadify-queue-item\">",
                        "<div class=\"cancel\">",
                       "<a href=\"javascript:$('#" + type + "_upload').uploadify('cancel', '" + type + "_" + count + "');\" onclick=\"DeleteFile('"+getFileName(t.FilePath)+"','" + type + "');\">X</a>",
                        " </div>",
                        "<span class=\"fileName\">"+t.FileName+"("+t.FileSize+")</span>",
                        "<span class=\"data\"> - 完成</span>",
                        "<div class=\"uploadify-progress\">",
                        "<div class=\"uploadify-progress-bar\" style=\"width:100%;\">",
                        "<!-- Progress Bar -->",
                        "</div></div></div></div>"}));
                count++;
            }
            return sb.ToString();
        }
        //获取附件名称
        private string getFileName(string name)
        {
            string result = "";
            if (!name.Equals(""))
            {
                result = name.Substring(name.LastIndexOf('/') + 1);
            }
            return result;
        }
        //查看设备详情附件《查看设备信息时调用，不可操作》
        [Login]
        public ActionResult DeviceFileDetail(int did)
        {
            StringBuilder sb = new StringBuilder();
            int count = 1;
            List<t_DM_DevicesFiles> list = bll.t_DM_DevicesFiles.Where(d => d.fk_DID == did).ToList();

            foreach (t_DM_DevicesFiles t in list)
            {
                sb.Append(string.Concat(new object[]
                {
                    "<div> [附件"+count+"] ",
                       getFileIcon(t.FileName),
                       "<a onclick=\"ShowImage('"+t.FilePath.Replace("~","")+"','"+t.ID+"','"+t.fk_DID+"')\" href=\"#\"> "+t.FileName+"</a>",
                        " </div>"
                        }));
                count++;
            }
            string strJson = JsonConvert.SerializeObject(sb.ToString());
            return Content(strJson); ;
        }
        private string getFileIcon(string filename)
        {
            string fileExtension = "jpeg";
            if (!filename.Equals(""))
            {
                fileExtension = filename.Substring(filename.LastIndexOf(".") + 1);
            }
            return "<img src=\"/Content/Images/fileType/" + fileExtension + "_24.png\" />";
        }
        //保存设备信息
        [Login]
        public ActionResult SaveDeviceInfo(t_DM_DeviceInfo device)
        {
            string result = "0";
            List<t_DM_DeviceInfo> list = bll.t_DM_DeviceInfo.Where(d => d.DeviceCode == device.DeviceCode && d.DeviceName == device.DeviceName && d.DID != device.DID).ToList();
            try
            {
                if (device.DID > 0)
                {
                    t_DM_DeviceInfo info = bll.t_DM_DeviceInfo.Where(d => d.DID == device.DID).First();
                    info.BuildDate = device.BuildDate;
                    info.BuyTime = device.BuyTime;
                    info.Company = device.Company;
                    info.DeviceCode = device.DeviceCode;
                    info.DeviceModel = device.DeviceModel;
                    info.DeviceName = device.DeviceName;
                    info.DID = device.DID;
                    info.DSTID = device.DSTID;
                    info.DTID = device.DTID;
                    info.PID = device.PID;
                    info.PName = device.PName;
                    info.FactoryNumber = device.FactoryNumber;
                    info.InstallAddr = device.InstallAddr;
                    info.LastMtcDate = device.LastMtcDate;
                    info.MFactory = device.MFactory;
                    info.MLID = device.MLID;
                    if (device.Remarks != null)
                        info.Remarks = device.Remarks.Replace("\n", "<br>");
                    else
                        info.Remarks = device.Remarks;
                    info.UseDate = device.UseDate;
                    info.UseState = device.UseState;
                    info.B = device.B;
                    info.C = device.C;
                    info.E = device.E;
                    info.Z = device.Z;
                    bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                    bll.SaveChanges();
                    result = "ok";
                    Common.InsertLog("设备管理", CurrentUser.UserName, "编辑设备信息[" + info.DeviceName + "(" + info.DeviceCode + ")_" + info.DID + "]");
                }
                else
                {
                    if (list.Count > 0)
                        result = "此设备已存在，请重新录入！";
                    else
                    {
                        if (device.Remarks != null)
                            device.Remarks = device.Remarks.Replace("\n", "<br>");
                        else
                            device.Remarks = device.Remarks;

                        bll.t_DM_DeviceInfo.AddObject(device);
                        bll.SaveChanges();

                        //保存设备系统编号
                        t_DM_DeviceInfo info = bll.t_DM_DeviceInfo.Where(d => d.DeviceCode == device.DeviceCode && d.DeviceName == device.DeviceName).First();
                        info.EadoCode = "2" + info.DID.ToString("000000000");
                        bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                        bll.SaveChanges();

                        result = "ok";
                        Common.InsertLog("设备管理", CurrentUser.UserName, "编辑设备信息[" + device.DeviceName + "(" + device.DeviceCode + ")]");
                    }
                }

                # region 保存附件信息
                int curid = 99999 + CurrentUser.UserID;

                List<t_DM_DevicesFiles> listfile = bll.t_DM_DevicesFiles.Where(d => d.fk_DID == curid).ToList();
                listfile.ForEach(d =>
                {
                    t_DM_DevicesFiles obj = d;
                    obj.fk_DID = device.DID;
                    bll.ObjectStateManager.ChangeObjectState(obj, EntityState.Modified);
                });
                bll.SaveChanges();
                #endregion
                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        //删除设备信息
        [Login]
        public ActionResult DeleteDeviceInfo(string did)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(did.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_DM_DeviceInfo> list = bll.t_DM_DeviceInfo.Where(m => resultlist.Any(a => a == m.DID)).ToList();
                FileUploadController file = new FileUploadController();
                list.ForEach(i =>
                {
                    //删除设备时，删除对应的附件信息（数据表信息及屋里信息）                   
                    file.DeleteDFile(i.DID);
                    bll.t_DM_DeviceInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("设备管理", CurrentUser.UserName, "删除设备信息[" + did + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        //获取设备详情-编辑页面
        [Login]
        public ActionResult DeviceInfoDetail(int did)
        {
            string strJson = "";
            List<t_DM_DeviceInfo> list = bll.t_DM_DeviceInfo.Where(d => d.DID == did).ToList();
            if (list.Count > 0)
            {
                t_DM_DeviceInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //获取设备详情-详情页面
        [Login]
        public ActionResult DeviceDetail(int did)
        {
            string strJson = "";
            List<V_DeviceDetail> list = bll.V_DeviceDetail.Where(d => d.DID == did).ToList();
            if (list.Count > 0)
            {
                V_DeviceDetail info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //获取设备详情-详情页面的图片
        [Login]
        public ActionResult DeviceFiles(int did)
        {
            string strImg = "";
            List<t_DM_DevicesFiles> list = bll.t_DM_DevicesFiles.Where(d => d.fk_DID == did).ToList();
            if (list.Count > 0)
            {
                List<t_DM_DevicesFiles> Imglist = list.Where(d => d.FileType == "image").ToList();
                strImg += "<table>";
                if (Imglist.Count > 0)
                {
                    strImg += "<tr><td>图片：</td><td>";
                    foreach (t_DM_DevicesFiles DF in Imglist)
                    {
                        strImg += "<img id=\"img" + DF.ID + "\" class=\"DevImg\" src=\"" + DF.FilePath.TrimStart('~') + "\" onClick = \"ShowImage(" + DF.ID + "," + DF.fk_DID + ") \"/>";
                    }
                    strImg += "</td></tr>";
                }
                List<t_DM_DevicesFiles> filelist = list.Where(d => d.FileType == "file").ToList();
                if (filelist.Count > 0)
                {
                    strImg += "<tr><td>文档：</td><td>";
                    foreach (t_DM_DevicesFiles DF in filelist)
                    {
                        strImg += "<a id=\"file" + DF.ID + "\" class=\"DevImg\" href=\"" + DF.FilePath.TrimStart('~') + "\">" + DF.FileName + "<a/>";
                    }
                    strImg += "</td></tr>";
                }
                strImg += "</table>";
            }
            return Content(strImg);
        }
        //回路/电表列表
        [Login]
        public ActionResult CircuitData(int pid = 0, int did = 0)
        {
            List<t_DM_ElectricMeterInfo> list = new List<t_DM_ElectricMeterInfo>();
            List<t_DM_CircuitInfo> clist = new List<t_DM_CircuitInfo>();
            if (pid > 0 && did > 0)
            {
                list = bll.t_DM_ElectricMeterInfo.Where(c => c.DID == did).ToList();
                clist = bll.t_DM_CircuitInfo.Where(c => c.DID == did).ToList();
            }
            else if (pid > 0 && did == 0)
            {
                clist = bll.t_DM_CircuitInfo.Where(c => c.PID == pid).ToList();
                string sql = "SELECT * FROM t_DM_ElectricMeterInfo";
                if (clist.Count > 0)
                {
                    string dids = "";
                    foreach (t_DM_CircuitInfo c in clist)
                    {
                        dids += c.DID + ",";
                    }
                    sql = "SELECT * FROM t_DM_ElectricMeterInfo WHERE did in (" + dids.TrimEnd(',') + ")";
                    list = bll.ExecuteStoreQuery<t_DM_ElectricMeterInfo>(sql).ToList();
                }

            }
            string strJson = ComboTree.GetDCTTree(clist, list);
            return Content(strJson);
        }
        //获取回路信息
        [Login]
        public ActionResult CircuitInfoDetail(int cid)
        {
            string strJson = "";
            List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(d => d.CID == cid).ToList();
            if (list.Count > 0)
            {
                t_DM_CircuitInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        public ActionResult CircuitInfoDetailByPID(int pid)
        {
            string strJson = "";
            List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(d => d.PID == pid).ToList();
            if (list.Count > 0)
            {
                t_DM_CircuitInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }

        //获取电表信息
        [Login]
        public ActionResult ElectricMeterDetail(int eid)
        {
            string strJson = "";
            List<t_DM_ElectricMeterInfo> list = bll.t_DM_ElectricMeterInfo.Where(d => d.EID == eid).ToList();
            if (list.Count > 0)
            {
                t_DM_ElectricMeterInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }
        //保存回路信息
        [Login]
        public ActionResult SaveCircuitInfo(t_DM_CircuitInfo Circuit)
        {
            string result = "0";
            List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(d => d.CID == Circuit.CID && d.CName == Circuit.CName).ToList();
            try
            {
                if (Circuit.CID > 0)
                {
                    t_DM_CircuitInfo info = bll.t_DM_CircuitInfo.Where(d => d.CID == Circuit.CID).First();
                    info.CName = Circuit.CName;
                    info.DID = Circuit.DID;
                    info.PID = Circuit.PID;
                    info.TagIDs = Circuit.TagIDs;

                    bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                    bll.SaveChanges();
                    result = "ok";
                    Common.InsertLog("回路管理", CurrentUser.UserName, "编辑回路信息[" + Circuit.CName + "(" + Circuit.CID + ")]");
                }
                else
                {
                    if (list.Count > 0)
                        result = "此回路已存在，请重新录入！";
                    else
                    {
                        bll.t_DM_CircuitInfo.AddObject(Circuit);
                        bll.SaveChanges();
                        result = "ok";
                        Common.InsertLog("回路管理", CurrentUser.UserName, "编辑回路信息[" + Circuit.CName + "(" + Circuit.CID + ")]");
                    }
                }
                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        //保存电表信息
        [Login]
        public ActionResult SaveElectricMeterInfo(t_DM_ElectricMeterInfo Electric)
        {
            string result = "0";
            List<t_DM_ElectricMeterInfo> list = bll.t_DM_ElectricMeterInfo.Where(d => d.EID == Electric.EID && d.EName == Electric.EName).ToList();
            try
            {
                if (Electric.EID > 0)
                {
                    t_DM_ElectricMeterInfo info = bll.t_DM_ElectricMeterInfo.Where(d => d.EID == Electric.EID).First();
                    info.EName = Electric.EName;
                    info.DID = Electric.DID;
                    info.CID = Electric.CID;
                    info.IO = Electric.IO;
                    info.Etype = Electric.Etype;
                    info.TagIDs = Electric.TagIDs.TrimEnd(',');
                    bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                    UpDateCircuitTagIDs((int)Electric.CID);
                    bll.SaveChanges();
                    result = "ok";
                    Common.InsertLog("回路管理", CurrentUser.UserName, "编辑电表信息[" + Electric.EName + "(" + Electric.EID + ")]");
                }
                else
                {
                    if (list.Count > 0)
                        result = "此电表已存在，请重新录入！";
                    else
                    {
                        Electric.TagIDs = Electric.TagIDs.TrimEnd(',');
                        bll.t_DM_ElectricMeterInfo.AddObject(Electric);
                        UpDateCircuitTagIDs((int)Electric.CID);
                        bll.SaveChanges();
                        result = "ok";
                        Common.InsertLog("回路管理", CurrentUser.UserName, "编辑回路信息[" + Electric.EName + "(" + Electric.EID + ")]");
                    }
                }
                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }
        public string UpDateCircuitTagIDs(int cid)
        {

            //更新回路关联的电表信息
            List<t_DM_ElectricMeterInfo> emlist = bll.t_DM_ElectricMeterInfo.Where(d => d.CID == cid).ToList();
            string cT = "";
            foreach (t_DM_ElectricMeterInfo em in emlist)
            {
                cT += em.TagIDs + ",";
            }
            t_DM_CircuitInfo Cc = bll.t_DM_CircuitInfo.Where(d => d.CID == cid).First();
            Cc.TagIDs = cT.TrimEnd(',');
            bll.ObjectStateManager.ChangeObjectState(Cc, EntityState.Modified);
            bll.SaveChanges();
            return "ok";
        }
        //删除回路信息
        [Login]
        public ActionResult DeleteCircuitInfo(string cid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(cid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_DM_CircuitInfo> list = bll.t_DM_CircuitInfo.Where(m => resultlist.Any(a => a == m.CID)).ToList();
                list.ForEach(i =>
                {
                    List<t_DM_ElectricMeterInfo> Elist = bll.t_DM_ElectricMeterInfo.Where(m => resultlist.Any(a => a == m.CID)).ToList();
                    Elist.ForEach(j =>
                    {
                        bll.t_DM_ElectricMeterInfo.DeleteObject(j);
                    });
                    bll.t_DM_CircuitInfo.DeleteObject(i);
                });
                bll.SaveChanges();
                Common.InsertLog("回路管理", CurrentUser.UserName, "删除回路信息[" + cid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        //删除电表信息
        [Login]
        public ActionResult DeleteElectricMeterInfo(string eid)
        {
            string result = "OK";
            try
            {
                List<int> resultlist = new List<string>(eid.Split(',')).ConvertAll(i => int.Parse(i));
                List<t_DM_ElectricMeterInfo> Elist = bll.t_DM_ElectricMeterInfo.Where(m => resultlist.Any(a => a == m.EID)).ToList();
                Elist.ForEach(j =>
                  {
                      bll.t_DM_ElectricMeterInfo.DeleteObject(j);
                      bll.SaveChanges();
                      UpDateCircuitTagIDs((int)j.CID);
                  });

                Common.InsertLog("回路管理", CurrentUser.UserName, "删除电表信息[" + eid + "]");//log
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }
        #endregion
        private t_CM_UserInfo CurrentUser
        {
            get { return loginbll.CurrentUser; }
        }
    }
}
