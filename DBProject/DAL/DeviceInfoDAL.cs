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
    public class DeviceInfoDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static DeviceInfoDAL _DataDal;
        static readonly object _loker = new object();
        public static DeviceInfoDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new DeviceInfoDAL();
                    }
                }
            }
            return _DataDal;
        }
        public IList<t_DM_DeviceInfo> GetDeviceCombox(string pids)
        {
            IList<t_DM_DeviceInfo> data = new List<t_DM_DeviceInfo>();
            try
            {
                data = _dbFactory.deviceInfo.GetDeviceCombox(pids);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
    }
}
