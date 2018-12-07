using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using YWWeb.PubClass;
using YWWeb;

namespace YWWeb.Controllers
{
    public class FileManageController : UserControllerBaseEx
    {
        //
        // GET: /FileManage/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 获取文件列表
        /// </summary>
        /// <param name="modules">文件所属模块</param>
        /// <param name="idlist">主键ID</param>
        /// <returns></returns>
        public List<t_cm_files> FileList(string modules, string idlist)
        {
            string strsql = "select * from t_cm_files where Modules='" + modules + "'  and  Fk_ID in ( "+idlist+" )";
            List<t_cm_files> list = bll.ExecuteStoreQuery<t_cm_files>(strsql).ToList();
            return list;
        }
        //新增文件
        public ActionResult AddFile(t_cm_files file)
        {
            string strResult = "ok";
            try
            {
                file.CommitTime = DateTime.Now;
                file.CommitUser = CurrentUser.UserName;
                bll.t_cm_files.AddObject(file);

                int recount = bll.SaveChanges();
                //log
                Common.InsertLog("新增文件", CurrentUser.UserName, "新增资料，资料模块[" + file.Modules + "_" + file.ID + "]");
            }
            catch
            {
                strResult = "error";
            }
            return Content(strResult);
        }
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="id">文件主键列表</param>
        public void DeleteFile(string id)
        {
            string strsql = "delete from t_cm_files where ID in (" + id + ")";
            int docount = bll.ExecuteStoreCommand(strsql, null);
        }
        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
    }
}
