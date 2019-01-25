using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using DAO.MSSql;

namespace DAO
{
    public class HisDataDBContext:DBContextBase,IHisData
    {
        public HisDataDBContext()
            : base(ConnectBuild.GetConnect(typeof(HisDataDBContext).Name))
        {
        }
      
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<HisDataDBContext>(null);
            modelBuilder.Entity<t_SM_HisData>()
              .HasKey(t => new { t.RecTime, t.TagID });
            base.OnModelCreating(modelBuilder);
        }

        public IList<t_SM_HisData> GetHisData(int pid, string TagIDs, string DateStart, string DateEnd)
        {
            string tablename = "t_SM_HisData_" + pid.ToString("00000");
            string query = "select * from  " + tablename + " where RecTime>='" + DateStart + "' and RecTime<='" + DateEnd + "' and TagID in (" + TagIDs.TrimEnd(',') + ")";
            
            return base.SQLQuery<t_SM_HisData>(query);
        }

        public long GetHisDataCount(int pid = 0, string tagIDS = "", string startdate = "", string enddate = "", string typename = "", string dname = "", string cname = "")
        {
            string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
            string condition = GetHisQuery(pid, "", tagIDS, cname, startdate, enddate, typename);
            string query = "select count(*) as IValue from " + tablename + " where " + condition;
            return base.SQLQuery<IntegerValue>(query).FirstOrDefault().IValue;
        }
        //获取历史数据查询条件
        string GetHisQuery(int pid, string dname = "", string tagIDs = "", string cname = "", string startdate = "", string enddate = "", string typename = "")
        {
            string DateStart = DateTime.Now.AddYears(-5).ToString("yyyy-MM-dd");
            string DateEnd = DateTime.Now.ToString("yyyy-MM-dd"); ;
            string query = " 1=1";
            if (pid > 0)
                query = query + " and PID=" + pid;

            if (!dname.Equals("==全部==") && !dname.Equals(""))
                query = query + " and DID=" + dname;// " and 设备名称 = '" + dname + "'";
            //query = query + " and 测点位置<>'备用01' and (测点名称 like '%" + cname + "%' or 测点位置 like '%" + cname + "%')";
            if (!tagIDs.Equals(""))
                query = query + " and TagID in (" + tagIDs + ")";
            if (!typename.Equals(""))
                query = query + " and DataTypeID=" + typename;//" and 数据类型='" + typename + "'";
            if (!startdate.Equals(""))
            {
                DateStart = Convert.ToDateTime(startdate).ToString("yyyy-MM-dd 00:00:00");
                query = query + " and RecTime>='" + startdate + "'";
            }
            if (!enddate.Equals(""))
            {
                DateEnd = Convert.ToDateTime(enddate).ToString("yyyy-MM-dd 23:59:59");
                query = query + " and RecTime<='" + DateEnd + "'";
            }
            return query;
        }
        public IList<t_SM_HisData> GetHisDataPage(int rows, int page, int pid = 0, string startdate = "", string enddate = "", string tagIDS = "", string dname = "", string cname = "", string typename = "", string sort = "记录时间", string order = "asc")
        {
            string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
            string condition = GetHisQuery(pid, "", tagIDS, cname, startdate, enddate, typename);
            string query = "select top " + rows + " * from (select  ROW_NUMBER () OVER (ORDER BY RecTime desc) RowNumber ,* from " + tablename
                            + " where " + condition + ") A"
                            + " where A.RowNumber>(" + page + "-1)*" + rows + " order by RowNumber";
            return SQLQuery<t_SM_HisData>(query);
        }

        public DbSet<t_SM_HisData> Datas { get; set; }
    }
}
