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
    public class VDeviceInfoState_PDR1DAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        IDBCacheFactory _dbCacheFactory = DBCacheFactoryManager.GetDBFactory();
  

        static VDeviceInfoState_PDR1DAL _DataDal;
        static readonly object _loker = new object();

        public static VDeviceInfoState_PDR1DAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                        _DataDal = new VDeviceInfoState_PDR1DAL();
                }
            }

            return _DataDal;
        }


        public IList<t_V_CIDTree> GetCidTree(string pdrlist)
        {
            IList<t_V_DeviceInfoState_PDR1> data = new List<t_V_DeviceInfoState_PDR1>();

            IList<t_V_CIDTree> tree = new List<t_V_CIDTree>();

            try
            {
                data = _dbFactory.deviceInfoState_PDR1.GetCidTree(pdrlist);
                for(var a= 0; a < data.Count(); a++)
                {

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return tree;
           
        }
    }
}