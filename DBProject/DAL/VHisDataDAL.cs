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
                    // Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
                    string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
                    string condition=GetHisQuery(pid,"", tagIDS,cname, startdate, enddate, typename);
                    string query = "select count(*) as nTotal from " + tablename + " where " + condition;
                    using(IVHisData _hisDataDao = new VHisDataDBContext())
                    {
                        var rowcounts = (_hisDataDao as IDAOBase).SQLQuery<rowCount>(query);//.P_HisDataCount(tablename, query).ToList();
                        if (rowcounts.Count() > 0)
                        { int rowcount = nTotal = rowcounts.FirstOrDefault().nTotal; }
                        //列表排序属性
                        bool ordertype = true;
                        if (order.Equals("asc"))
                            ordertype = false;
                        //List<t_V_HisData> list =  bll.P_HisData(tablename, "*", sort, rows, page, ordertype, query).ToList();
                        //strJson = Common.List2Json(list, rowcount);
                        query = "select top " + rows + " * from (select  ROW_NUMBER () OVER (ORDER BY RecTime desc) RowNumber ,* from " + tablename
                            + " where " + condition + ") A"
                            + " where A.RowNumber>(" + page + "-1)*" + rows + " order by RowNumber";
                        data = (_hisDataDao as IDAOBase).SQLQuery<t_V_HisData>(query);
                    }
                    
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return data;
        }
        //获取历史数据查询条件
        string GetHisQuery(int pid,string dname = "",string tagIDs="", string cname = "", string startdate = "", string enddate = "", string typename = "")
        {
            string DateStart = DateTime.Now.AddYears(-5).ToString("yyyy-MM-dd");
            string DateEnd = DateTime.Now.ToString("yyyy-MM-dd"); ;
            string query = " 1=1";
            if (pid > 0)
                query = query + " and PID=" + pid;

            if (!dname.Equals("==全部==")&&!dname.Equals(""))
                query = query + " and DID="+dname;// " and 设备名称 = '" + dname + "'";
            //query = query + " and 测点位置<>'备用01' and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%')";
            if (!tagIDs.Equals(""))
            query = query + " and TagID in ("+tagIDs+")";
            if (!typename.Equals(""))
                query = query + " and DataTypeID="+typename;//" and 数据类型='" + typename + "'";
            if (!startdate.Equals(""))
            {
                DateStart = Convert.ToDateTime(startdate).ToString("yyyy-MM-dd");
                query = query + " and RecTime>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                DateEnd = Convert.ToDateTime(enddate).AddDays(1).ToString("yyyy-MM-dd");
                query = query + " and RecTime<='" + DateEnd + "'";
            }
            return query;
        }

    }
}
