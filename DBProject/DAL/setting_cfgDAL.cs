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
    public class setting_cfgDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static readonly object _loker = new object();
        static setting_cfgDAL _DataDal;
        public static setting_cfgDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new setting_cfgDAL();
                }
            }

            return _DataDal;
        }

        public IList<t_sys_setting_cfg> getSettingtList(int type, out int total,int rows,int page)
        {
            try
            {
                return _dbFactory.setting_Cfg.getSettingtList(type, out total, rows, page);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int AddSetting(t_sys_setting_cfg model)
        {
            try
            {
                return _dbFactory.setting_Cfg.AddSetting(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int UpdateSetting(t_sys_setting_cfg model)
        {
            try
            {
                return _dbFactory.setting_Cfg.UpdateSetting(model);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public int DeteleSetting(int id)
        {
            try
            {
                return _dbFactory.setting_Cfg.DeteleSetting(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public t_sys_setting_cfg GetModelByID(int id)
        {
            try
            {
                return _dbFactory.setting_Cfg.GetModelByID(id);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public t_sys_setting_cfg GetModelByType(int type)
        {
            try
            {
                return _dbFactory.setting_Cfg.GetModelByType(type);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
