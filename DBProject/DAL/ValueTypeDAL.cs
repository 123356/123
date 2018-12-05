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
    public class ValueTypeDAL
    {

        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static ValueTypeDAL _DataDal;
        public static ValueTypeDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                _DataDal = new ValueTypeDAL();
            }

            return _DataDal;
        }


        class rowCount
        {
            public int nTotal { set; get; }
        }

        //实时数据项包含的类型
        public IList<t_CM_ValueTypeComBox> GetRealTimeComboxData(int pid, int DID=-1)
        {
            IList<t_CM_ValueTypeComBox> data = new List<t_CM_ValueTypeComBox>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
           try
            {
                //string tablename = "t_SM_HisData_" + pid.ToString("00000");
                //string query = "select * from  " + tablename + " where RecTime>='";
                //    using (IValueType _hisDataDao = new ValueTypeDBContext())
                //    {
                //        data = (_hisDataDao as IDAOBase).SQLQuery<t_CM_ValueTypeComBox>(query);
                //    }
                data = _dbFactory.valueType.GetRealTimeComboxData(pid, DID);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
       
    }
}