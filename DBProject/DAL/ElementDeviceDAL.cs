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
    public class ElementDeviceDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static ElementDeviceDAL _DataDal;
        static readonly object _loker = new object();
        public static ElementDeviceDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new ElementDeviceDAL();
                    }
                }
            }
            return _DataDal;
        }
        public IList<t_DM_ElementDevice> GetElementList(string name, int page, int rows)
        {
            IList<t_DM_ElementDevice> data = new List<t_DM_ElementDevice>();
            try
            {
                data = _dbFactory.elementDevice.GetElementList(name, page, rows);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public int Add(t_DM_ElementDevice model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elementDevice.Add(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int Update(t_DM_ElementDevice model)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elementDevice.Update(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public int Delete(int id)
        {
            int n = 0;
            try
            {
                n = _dbFactory.elementDevice.Delete(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return n;
        }
        public t_DM_ElementDevice GetModelByID(int id)
        {
            t_DM_ElementDevice model = new t_DM_ElementDevice();
            try
            {
                model = _dbFactory.elementDevice.GetModelByID(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return model;
        }
    }
}
