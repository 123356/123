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
    public class EnerUserProjectDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EnerUserProjectDAL _DataDal;
        static readonly object _loker = new object();
        public static EnerUserProjectDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnerUserProjectDAL();
                }
            }
            return _DataDal;
        }
        /// <summary>
        /// 获取树
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="itemType"></param>
        /// <returns></returns>
        public IList<t_EE_EnerUserProject> GetOrganizationTree(int unitID, int itemType)
        {
            IList<t_EE_EnerUserProject> data = new List<t_EE_EnerUserProject>();
            try
            {
                data = _dbFactory.enerUserProject.GetOrganizationTree(unitID, itemType);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}