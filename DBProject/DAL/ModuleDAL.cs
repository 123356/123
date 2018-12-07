using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;
using DAL.Models;
using Newtonsoft.Json;
using IDAO.InterfaceCache;

namespace DAL
{
    public class ModuleDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
        static readonly string MenuKey = "user_left_menu";
        static readonly object _loker = new object();
        static ModuleDAL _DataDal;
        public static ModuleDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new ModuleDAL();
                        _DataDal.userQueryMenuInf = new QueryMenuInf(_DataDal.queryMenuInf);
                    }
                }
            }

            return _DataDal;
        }



        delegate string QueryMenuInf(int userID,DateTime ?lastTime);
        QueryMenuInf userQueryMenuInf;
        private string queryMenuInf(int userID, DateTime ?lastTime)
        {
            string retValue="unknown process.";
            if (null != lastTime && DateTime.Now.Subtract((DateTime)lastTime).TotalSeconds < 3)
            {
                return string.Empty;
            }
            MenuInfAdapter menuAdp = new MenuInfAdapter();

            List<MenuInf> listMenu = new List<MenuInf>();
            IList<t_CM_RoleRight> roleRight = RoleRightDAL.getInstance().GetRoles(userID);
            if (null == roleRight || roleRight.Count() < 1)
            {
                return JsonConvert.SerializeObject(listMenu);
            }
            string moduleIDS = string.Join(",", roleRight.Select(c => c.ModuleID));
            IList<t_CM_Module> data = new List<t_CM_Module>();// 
            try
            {
                //string query = "select * from  t_CM_Module  where ModuleID in(" + moduleIDS + ");";
                //using (IModule _hisDataDao = new ModuleDBContext())
                //{
                //    data = (_hisDataDao as IDAOBase).SQLQuery<t_CM_Module>(query);
                //}
                data = _dbFactory.module.GetModules(moduleIDS);
                var menu1 = from s in data where s.ParentID == 0 orderby s.SN select s;
                foreach (t_CM_Module model in menu1)
                {
                    MenuInf menu = new MenuInf();
                    listMenu.Add(menu);
                    menu.moduleParent = model;
                    int mid = (int)model.ModuleID;

                    List<t_CM_Module> list2 = (from s in data where s.ParentID == model.ModuleID orderby s.SN select s).ToList<t_CM_Module>();
                    //ViewData["list" + mid] = list2;
                    menu.childern = list2;
                    menu.disenableModule = (from s in roleRight where s.Disenable select s).ToList<t_CM_RoleRight>();
                    //隐藏链接
                    var right = from c in menu.disenableModule where c.ModuleID == model.ModuleID && c.Disenable select c;
                    if (right.Count() > 0)
                    {
                        model.Location = "#";
                    }
                    foreach (var m in menu.childern)
                    {
                        right = from c in menu.disenableModule where c.ModuleID == m.ModuleID && c.Disenable select c;
                        if (right.Count() > 0)
                        {
                            m.Location = "#";
                        }
                    }
                }
                retValue = JsonConvert.SerializeObject(listMenu);
                //redis.StringSet(key + "_" + DateTime.Now.ToString(), retValue);
                menuAdp.dateTime = DateTime.Now;
                menuAdp.menuInfJson = retValue;
                string key = "user_" + userID;
                IDBCache dbCache = _dbCacheFactory.DefautCache;
                dbCache.HashSet(MenuKey, key, menuAdp);
                data.Clear();
                data = null;
                roleRight.Clear();
                roleRight = null;
                menuAdp = null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return retValue;
        }
        //实时数据项包含的类型
        public string GetMenuInfoJson(int userID)
        {
            string key = "user_"+userID;
            IDBCache dbCache = _dbCacheFactory.DefautCache;
            try
            {

                MenuInfAdapter menuAdp = null;
                try
                {
                    if (dbCache.HashExists(MenuKey, key))
                        menuAdp = dbCache.HashGet<MenuInfAdapter>(MenuKey, key);
                }
                catch //(Exception)
                {

                   // throw;
                }
                if (null != menuAdp)
                {
                    userQueryMenuInf.BeginInvoke(userID, menuAdp.dateTime, null, null);
                    return menuAdp.menuInfJson;
                }
                else
                {
                    return userQueryMenuInf(userID, null);
                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
           
           
        }
       
    }
}