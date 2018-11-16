using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;
using System.Linq.Expressions;

namespace DAO
{
    public class VHisDataDBContext:DBContextBase,IVHisData
    {
        public VHisDataDBContext()
            : base("name =YWConnectionStringHis")//("name=dbConnectString")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<VHisDataDBContext>(null);
            modelBuilder.Entity<t_V_HisData>()
              .HasKey(t => new { t.记录时间, t.设备编码 });


            base.OnModelCreating(modelBuilder);
        }
       public void Dispose()
        {
            base.Dispose();
        }

        public DbSet<t_V_HisData> Datas { get; set; }

        public IList<t_V_HisData> GetHisData(int rows, int page, DateTime startdate , DateTime enddate,int pid = 0, string dname = "", string cname = "", string typename = "", string sort = "记录时间", string order = "asc")
        {
            return this.Datas.Where(o => o.配电房编号 == pid && o.记录时间 <= enddate && o.记录时间 >= startdate).Take(rows).ToList();
        }
        public IList<T> FindAllByPage<T, S>(Expression<Func<T, bool>> conditions, Expression<Func<T, S>> orderBy, int pageSize, int pageIndex) where T : class
        {
            var queryList = conditions == null ? this.Set<T>() : this.Set<T>().Where(conditions) as IQueryable<T>;

            return queryList.OrderByDescending(orderBy).ToList();
        }
    }
}
