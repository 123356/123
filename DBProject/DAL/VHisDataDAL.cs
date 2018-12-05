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
    public class VHisDataDAL
    {
        
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static VHisDataDAL _DataDal;
        public static VHisDataDAL getInstance(string json=null)
        {
            if (null == _DataDal)
            {
                _DataDal=new VHisDataDAL();
            }

            return _DataDal;
        }

        
        class rowCount
        {
            public int nTotal { set; get; }
        }
        public IList<t_V_HisData> GetHisData(out int nTotal,int rows, int page, int pid = 0,string tagIDS="", string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "", string sort = "记录时间", string order = "asc")
        {
            IList<t_V_HisData> data = new List<t_V_HisData>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            nTotal = 0;
            try
            {
                if (pid != 0)
                {
                    nTotal = _dbFactory.vHisData.GetHisDataCount(startdate, enddate, pid, tagIDS, dname, cname, typename);
                    if (nTotal > 0)
                    {
                        data = _dbFactory.vHisData.GetHisData(rows, page, startdate, enddate, pid, dname, cname, typename, sort, order);
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
      

    }
}
