using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDAO;
using DAO;
using IDAO.Models;

namespace DAL
{
    public class DeviceTypeDAL
    {

        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static DeviceTypeDAL _DataDal;
        public static DeviceTypeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                _DataDal = new DeviceTypeDAL();
            }

            return _DataDal;
        }


        //实时数据项包含的类型
        public IList<t_CM_DeviceTypeComBox> GetRealTimeComboxData(int pid, int DID = -1)
        {
            #region 方案1 根据实时表的数据提取设备
            //            select  DTID,Name  from t_CM_DeviceType where DTID in 
            //(select distinct DTID from t_DM_DeviceInfo where PID=1 and DID in
            //(
            //select distinct DID from t_CM_PointsInfo where PID=1 and TagID in 
            //(
            //select TagID from t_SM_RealTimeData_00001
            //)
            //) 
            //)
            #endregion
            IList<t_CM_DeviceTypeComBox> data = new List<t_CM_DeviceTypeComBox>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            try
            {
                //方案二  从录入的设备中直接提取

                //string query = "select  DTID,Name  from t_CM_DeviceType where DTID in (select distinct DTID from t_DM_DeviceInfo where PID=" + pid;
                //if (DID>0)
                //{
                //    query += " and DID=" + DID;
                //}
                //query += " )";
                //using (IDeviceType _hisDataDao = new DeviceTypeDBContext())
                //{
                //    data = (_hisDataDao as IDAOBase).SQLQuery<t_CM_DeviceTypeComBox>(query);
                //}
                data = _dbFactory.deviceType.GetRealTimeComboxData(pid, DID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

    }
}