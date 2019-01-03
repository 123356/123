using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using IDAO.Models;
using IDAO;

namespace DAO
{
    public class EnerUserTypeDBContext : DBContextBase, IEnerUserType
    {
        public EnerUserTypeDBContext()
            : base("name=YWConnectionStringHis")
        {
        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerUserTypeDBContext>(null);
            modelBuilder.Entity<t_EE_EnerUserType>()
              .HasKey(t => new { t.id });
            base.OnModelCreating(modelBuilder);
        }
        /// <summary>
        /// 加载已经存在的区域列表
        /// </summary>
        /// <param name="item_type"></param>
        /// <returns></returns>
        public IList<t_EE_EnerUserType> GetOrganizationList(int item_type)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = "SELECT b.parent_id,b.child_id,b.unit_head,b.unit_id,b.unit_note,a.Remarks,a.Name,a.item_type FROM t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id =b.parent_id WHERE a.item_type = "+ item_type;
            return SQLQuery<t_EE_EnerUserType>(sql);
        }

        public int unpDateproject(int item_type, string Name, string Remarks)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"DECLARE @id int SELECT @id = id FROM t_EE_EnerUserType WHERE Name = '{Name}' AND item_type = {item_type} IF @id >= 1 BEGIN UPDATE t_EE_EnerUserType SET Name = '{Name}', item_type = {item_type},Remarks = '{Remarks}' WHERE id = @id ; SELECT @id IValue; ; END ELSE BEGIN INSERT INTO t_EE_EnerUserType (Name, item_type, Remarks) VALUES( '{Name}', {item_type},  '{Remarks}') ; SELECT @@identity IValue; ; END";
            int v = -1;
            var data= SQLQuery<IntegerValue>(sql);
            if (data.Count() > 0)
            {
                v = data.FirstOrDefault().IValue;
            }
            return v;
        }


        public DbSet<t_EE_EnerUserType> Datas { get; set; }
    }
}
