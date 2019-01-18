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
    public class PriceEneryDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();

        static PriceEneryDAL _DataDal;
        static readonly object _loker = new object();
        public static PriceEneryDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new PriceEneryDAL();
                }
            }
            return _DataDal;
        }

        public IList<t_EE_PriceEnery> GetPriceEneryBy(int uid=0,int colltypeid=0,int level=0)
        {
            try
            {
                return _dbFactory.priceEnery.GetPriceEneryBy(uid, colltypeid, level);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int InserPriceEnery(t_EE_PriceEnery model)
        {
            try
            {
                return _dbFactory.priceEnery.InserPriceEnery(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int UpdatePriceEnery(t_EE_PriceEnery model)
        {
            try
            {
                return _dbFactory.priceEnery.UpdatePriceEnery(model);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        public int DeletePriceEnery(int id)
        {
            try
            {
                return _dbFactory.priceEnery.DeletePriceEnery(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public t_EE_PriceEnery GetPriceEneryByID(int id)
        {
            try
            {
                return _dbFactory.priceEnery.GetPriceEneryByID(id);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

    }
}
