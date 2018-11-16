using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using S5001Web.PubClass;

namespace S5001Web.Controllers
{
    public class DataProcessController : Controller
    {
        //
        // GET: /DataProcess/

        pdermsWebEntities bll = new pdermsWebEntities();
        public ActionResult Index()
        {
            return View();
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
            string strsql = "SELECT p.TagID, d.PID, d.PName, p.DID, d.DeviceName, p.Position,P.MPID,D.DTID,ABCID FROM t_CM_PointsInfo AS p JOIN t_DM_DeviceInfo AS d ON p.DID = d.DID WHERE P.DataTypeID=1 and mpid>0 ";
            if (pid > 0)
                strsql = strsql + " and pid=" + pid;
            //去掉重复项，只获取三相数据
            strsql = strsql + " and  ABCID>0 and TagID not in (select TagID_A from t_CM_AlternateSet) and TagID not in (select TagID_B from t_CM_AlternateSet) and TagID not in (select TagID_C from t_CM_AlternateSet) order by DID,Position,ABCID";
            int pcount = 0;//计算器，计算ABC三相数据
            double AlarmVal = 85, WarningVal = 75, IntersetVal = 65;
            List<BasicAlternate> list = bll.ExecuteStoreQuery<BasicAlternate>(strsql).ToList();
            string bPosition = "", cPosition = "";
            int eid = 0, bdid = 0, cdid = 0;//室内环境tagid
            strsql = "select top 1 TagID from t_CM_PointsInfo where  DataTypeID in (12,24) and DID in (select DID from t_DM_DeviceInfo where PID=" + pid + ")";
            List<int> eids = bll.ExecuteStoreQuery<int>(strsql).ToList();
            if (eids.Count > 0)
                eid = eids[0];
            if (eid > 0)//如果没有环境温度的值。取消执行
            {
                t_CM_AlternateSet model = new t_CM_AlternateSet();
                foreach (BasicAlternate alternate in list)
                {
                    if (alternate.ABCID > 0)
                    {
                        cPosition = alternate.Position;
                        cdid = alternate.DID;
                        if (cPosition.Equals(bPosition) && cdid == bdid)
                        {
                            if (alternate.ABCID == 2)
                                model.TagID_B = alternate.TagID;
                            else if (alternate.ABCID == 3)
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
        public int ABCID { get; set; }
    }
}
