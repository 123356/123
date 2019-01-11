using DAO;
using IDAO;
using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class EnTypeConfigDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static EnTypeConfigDAL _DataDal;
        static readonly object _loker = new object();
        public static EnTypeConfigDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new EnTypeConfigDAL();
                }
            }

            return _DataDal;
        }




        public int AddConfig(t_EE_enTypeConfig model)
        {
            try
            {
                return _dbFactory.typeconfig.AddConfig(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int DeleteConfig(int id)
        {
            try
            {
                return _dbFactory.typeconfig.DeleteConfig(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public IList<t_EE_enTypeConfig> GetenConig(int uid,string depid="0")
        {
            try
            {
                return _dbFactory.typeconfig.GetenConig(uid,depid);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
