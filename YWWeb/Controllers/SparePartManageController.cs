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

namespace S5001Web.Controllers
{
    /// <summary>
    /// 备件管理
    /// </summary>
    public class SparePartManageController : Controller
    {
        pdermsWebEntities bll = new pdermsWebEntities();

        LoginAttribute loginbll = new LoginAttribute();

        /// <summary>
        /// 当前用户
        /// </summary>
        private t_CM_UserInfo CurrentUser
        {
            get
            {
                return loginbll.CurrentUser;
            }
        }

        /// <summary>
        /// 备件列表
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult SparePartList()
        {
            return View();
        }

        /// <summary>
        /// 备件编辑
        /// </summary>
        /// <returns></returns>
        [Login]
        public ActionResult SparePartEdits()
        {
            return View();
        }


        /// <summary>
        /// 获取备件列表
        /// </summary>
        /// <param name="rows"></param>
        /// <param name="page"></param>
        /// <param name="SparePartName"></param>
        /// <param name="pid"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SparePartInfoData(int rows, int page, string SparePartName = "", int pid = 0)
        {
            List<t_CM_SparePartInfo> list = null;
            if (pid == 0)
            {
                string pdrlist = HomeController.GetPID(CurrentUser.UNITList);
                //string pdrlist = CurrentUser.PDRList;
                List<int> resultlist = new List<string>(pdrlist.Split(',')).ConvertAll(i => int.Parse(i));

                string strsql = "select *  from t_CM_SparePartInfo where 1=1 ";
                if (!SparePartName.Equals(""))
                {
                    strsql += string.Format(" and SparePartName like '%{0}%'", SparePartName);
                }


                strsql += " order by SparePartID ";

                list = bll.ExecuteStoreQuery<t_CM_SparePartInfo>(strsql).ToList();
            }

            string strJson = Common.List2Json(list, rows, page);
            return Content(strJson);
        }

        /// <summary>
        /// 备件详细信息
        /// </summary>
        /// <param name="did"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SparePartInfoDetail(int sparepartid)
        {
            string strJson = "";
            List<t_CM_SparePartInfo> list = bll.t_CM_SparePartInfo.Where(d => d.SparePartID == sparepartid).ToList();
            if (list.Count > 0)
            {
                t_CM_SparePartInfo info = list[0];
                strJson = JsonConvert.SerializeObject(info);
            }
            return Content(strJson);
        }

        /// <summary>
        /// 保存备件信息
        /// </summary>
        /// <param name="supplier"></param>
        /// <returns></returns>
        [Login]
        public ActionResult SaveSparePartInfo(t_CM_SparePartInfo sparepart)
        {
            string result = "0";

            try
            {
                List<t_CM_SparePartInfo> list = bll.t_CM_SparePartInfo.Where(d => (d.SparePartCode == sparepart.SparePartCode || d.SparePartName == sparepart.SparePartName) && d.SparePartID != sparepart.SparePartID).ToList();
                if (list.Count > 0)
                {
                    result = "此备件名称或编码已存在，请重新录入！";
                }
                else
                {
                    //编辑
                    if (sparepart.SparePartID > 0)
                    {
                        t_CM_SparePartInfo info = bll.t_CM_SparePartInfo.Where(d => d.SparePartID == sparepart.SparePartID).First();
                        info.SparePartID = sparepart.SparePartID;
                        info.SparePartCode = sparepart.SparePartCode;
                        info.SparePartName = sparepart.SparePartName;
                        info.StockCount = sparepart.StockCount;
                        info.SupplierID = sparepart.SupplierID;
                        info.EadoCode = sparepart.EadoCode;
                        info.UseState = sparepart.UseState;
                        if (sparepart.Remarks != null)
                        {
                            info.Remarks = sparepart.Remarks.Replace("\n", "<br>");
                        }
                        else
                        {
                            info.Remarks = sparepart.Remarks;
                        }

                        bll.ObjectStateManager.ChangeObjectState(info, EntityState.Modified);
                        bll.SaveChanges();
                        result = "ok1";
                        Common.InsertLog("备件管理", CurrentUser.UserName, "编辑备件信息[" + info.SparePartName + "(" + info.SparePartCode + ")_" + info.SparePartID + "]");
                    }
                    else
                    {
                        //新增
                        if (sparepart.Remarks != null)
                        {
                            sparepart.Remarks = sparepart.Remarks.Replace("\n", "<br>");
                        }
                        else
                        {
                            sparepart.Remarks = sparepart.Remarks;
                        }

                        bll.t_CM_SparePartInfo.AddObject(sparepart);
                        bll.SaveChanges();

                        result = "ok2";
                        Common.InsertLog("备件管理", CurrentUser.UserName, "新增备件信息[" + sparepart.SparePartName + "(" + sparepart.SparePartCode + ")]");
                    }
                }

                return Content(result);
            }
            catch (Exception ex)
            {
                return Content(ex.ToString());
            }
        }

        /// <summary>
        /// 删除备件信息
        /// </summary>
        /// <param name="did"></param>
        /// <returns></returns>
        [Login]
        public ActionResult DeleteSparePartInfo(string sparepartid)
        {
            string result = "OK";
            try
            {
                string strsql = "delete  from t_CM_SparePartInfo  where SparePartID in (" + sparepartid + ")";
                bll.ExecuteStoreCommand(strsql, null);
                Common.InsertLog("备件管理", CurrentUser.UserName, "删除备件信息[" + sparepartid + "]");
            }
            catch (Exception ex)
            {
                result = "删除失败！";
            }
            return Content(result);
        }

    }
}
