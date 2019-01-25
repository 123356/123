using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using System.Linq.Expressions;
using DAO.MSSql;

namespace DAO
{
    public class VHisDataDBContext:DBContextBase,IVHisData
    {
        public VHisDataDBContext()
            : base(ConnectBuild.GetConnect(typeof(VHisDataDBContext).Name))//("name=dbConnectString")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<VHisDataDBContext>(null);
            modelBuilder.Entity<t_V_HisData>()
              .HasKey(t => new { t.记录时间, t.设备编码 });


            base.OnModelCreating(modelBuilder);
        }
      

        public DbSet<t_V_HisData> Datas { get; set; }

        public IList<t_V_HisData> GetHisData(int rows, int page, string startdate, string enddate, int pid = 0, string tagIDS = "", string dname = "", string cname = "", string typename = "", string sort = "记录时间", string order = "asc")
        {

            string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
            string condition = GetHisQuery(pid, "", tagIDS, cname, startdate, enddate, typename);

            //列表排序属性
            bool ordertype = true;
            if (order.Equals("asc"))
                ordertype = false;
            //List<t_V_HisData> list =  bll.P_HisData(tablename, "*", sort, rows, page, ordertype, query).ToList();
            //strJson = Common.List2Json(list, rowcount);
            string query = "select top " + rows + " * from (select  ROW_NUMBER () OVER (ORDER BY RecTime desc) RowNumber ,* from " + tablename
                  + " where " + condition + ") A"
                  + " where A.RowNumber>(" + page + "-1)*" + rows + " order by RowNumber";
            return SQLQuery<t_V_HisData>(query);
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
        public IList<T> FindAllByPage<T, S>(Expression<Func<T, bool>> conditions, Expression<Func<T, S>> orderBy, int pageSize, int pageIndex) where T : class
        {
            var queryList = conditions == null ? this.Set<T>() : this.Set<T>().Where(conditions) as IQueryable<T>;

            return queryList.OrderByDescending(orderBy).ToList();
        }

        public int GetHisDataCount(string startdate, string enddate, int pid = 0, string tagIDS = "", string dname = "", string cname = "", string typename = "")
        {
            // Convert.ToInt32(CurrentUser.PDRList.Split(',')[0]);
            string tablename = "t_SM_HisData_" + pid.ToString("00000");// "配电房_" + pid.ToString("00000") + "_历史数据表";
            string condition = GetHisQuery(pid, "", tagIDS, cname, startdate, enddate, typename);
            string query = "select count(*) as nTotal from " + tablename + " where " + condition;

            return SQLQuery<IntegerValue>(query).FirstOrDefault().IValue;//.P_HisDataCount(tablename, query).ToList();
        }
    }
}
