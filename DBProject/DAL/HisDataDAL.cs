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
    public class HisDataDAL
    {
        IDBFactory _dbFactory = DBFactoryManager.GetDBFactory();
        static HisDataDAL _DataDal;
        static readonly object _loker = new object();
        public static HisDataDAL getInstance(string json = null)
        {
            if (null == _DataDal)
            {
                lock (_loker)
                {
                    if (null == _DataDal)
                    {
                        _DataDal = new HisDataDAL();
                    }
                }
            }

            return _DataDal;
        }


        class rowCount
        {
            public int nTotal { set; get; }
        }

        public IList<t_SM_HisData> GetHisData(int pid,string TagIDs, string DateStart, string DateEnd)
        {
            IList<t_SM_HisData> data = new List<t_SM_HisData>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
           try
            {
                //string tablename = "t_SM_HisData_" + pid.ToString("00000");
                //string query = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID in (" + TagIDs.TrimEnd(',') + ")";
                //    using (IHisData _hisDataDao = new HisDataDBContext())
                //    {
                //        data = (_hisDataDao as IDAOBase).SQLQuery<t_SM_HisData>(query);
                //    }
                data = _dbFactory.hisData.GetHisData(pid, TagIDs, DateStart, DateEnd);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        public IList<t_SM_HisData> GetHisData(out int nTotal, int rows, int page, int pid = 0, string tagIDS = "", string dname = "", string cname = "", string startdate = "", string enddate = "", string typename = "", string sort = "记录时间", string order = "asc")
        {
            IList<t_SM_HisData> data = new List<t_SM_HisData>();// _hisDataDao.GetHisData(rows, page, DateTime.Now.AddDays(-3), DateTime.Now, pid);
            nTotal = 0;
            try
            {
                if (pid != 0)
                {
                    // Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                    //string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
                    //string condition = GetHisQuery(pid, "", tagIDS, cname, startdate, enddate, typename);
                    //string query = "select count(*) as nTotal from " + tablename + " where " + condition;
                    //using (IHisData _hisDataDao = new HisDataDBContext())
                    //{
                    //    var rowcounts = (_hisDataDao as IDAOBase).SQLQuery<rowCount>(query);//.P_HisDataCount(tablename, query).ToList();
                    //    if (rowcounts.Count() > 0)
                    //    { int rowcount = nTotal = rowcounts.FirstOrDefault().nTotal; }
                    //    //列表排序属性
                    //    bool ordertype = true;
                    //    if (order.Equals("asc"))
                    //        ordertype = false;
                    //    //List<t_V_HisData> list =  bll.P_HisData(tablename, "*", sort, rows, page, ordertype, query).ToList();
                    //    //strJson = Common.List2Json(list, rowcount);
                    //    query = "select top " + rows + " * from (select  ROW_NUMBER () OVER (ORDER BY RecTime desc) RowNumber ,* from " + tablename
                    //        + " where " + condition + ") A"
                    //        + " where A.RowNumber>(" + page + "-1)*" + rows + " order by RowNumber";
                    //    data = (_hisDataDao as IDAOBase).SQLQuery<t_SM_HisData>(query);
                    //}
                    nTotal = (int)_dbFactory.hisData.GetHisDataCount(pid, tagIDS, startdate, enddate, typename, dname, cname);
                    if(nTotal>0)
                    {
                        data = _dbFactory.hisData.GetHisDataPage(rows, page, pid, startdate, enddate, tagIDS, dname, cname, typename, sort, order);
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }

        ////获取历史数据查询条件
        //string GetHisQuery(int pid, string dname = "", string tagIDs = "", string cname = "", string startdate = "", string enddate = "", string typename = "")
        //{
        //    string DateStart = DateTime.Now.AddYears(-5).ToString("yyyy-MM-dd");
        //    string DateEnd = DateTime.Now.ToString("yyyy-MM-dd"); ;
        //    string query = " 1=1";
        //    if (pid > 0)
        //        query = query + " and PID=" + pid;

        //    if (!dname.Equals("==全部==") && !dname.Equals(""))
        //        query = query + " and DID=" + dname;// " and 设备名称 = '" + dname + "'";
        //    //query = query + " and 测点位置<>'备用01' and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%')";
        //    if (!tagIDs.Equals(""))
        //        query = query + " and TagID in (" + tagIDs + ")";
        //    if (!typename.Equals(""))
        //        query = query + " and DataTypeID=" + typename;//" and 数据类型='" + typename + "'";
        //    if (!startdate.Equals(""))
        //    {
        //        DateStart = Convert.ToDateTime(startdate).ToString("yyyy-MM-dd 00:00:00");
        //        query = query + " and RecTime>='" + startdate + "'";
        //    }
        //    if (!enddate.Equals(""))
        //    {
        //        DateEnd = Convert.ToDateTime(enddate).ToString("yyyy-MM-dd 23:59:59");
        //        query = query + " and RecTime<='" + DateEnd + "'";
        //    }
        //    return query;
        //}
    }
}