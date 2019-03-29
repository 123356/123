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
    public class ElecPriceDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static ElecPriceDAL _DataDal;
        static readonly object _loker = new object();
        public static ElecPriceDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new ElecPriceDAL();
                    }
                }
            }
            return _DataDal;
        }
        public IList<t_ES_ElecPrice_W> GetElecPriceList(int page,int rows)
        {
            IList<t_ES_ElecPrice_W> data = new List<t_ES_ElecPrice_W>();
            try
            {
                data = _dbFactory.elecPrice.GetElecPriceList(page, rows);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public t_ES_ElecPrice_W GetElecPriceByID(int id)
        {
            t_ES_ElecPrice_W data = new t_ES_ElecPrice_W();
            try
            {
                data = _dbFactory.elecPrice.GetElecPriceByID(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public int Add(t_ES_ElecPrice model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elecPrice.Add(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int Update(t_ES_ElecPrice model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elecPrice.Update(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int Delete(string id)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elecPrice.Delete(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
    }
}
