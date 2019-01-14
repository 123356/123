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
    public class VEnerProjectTypeDBContext : DBContextBase, IVEnerProjectType
    {
        public VEnerProjectTypeDBContext()
            : base("name=YWConnectionStringHis")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<VEnerProjectTypeDBContext>(null);
            modelBuilder.Entity<t_V_EnerProjectType>()
              .HasKey(t => new { t.child_id});
            base.OnModelCreating(modelBuilder);
        }


        public IList<t_V_EnerProjectType> GetTreeData(int unitId, int item_type)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = "SELECT * FROM t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id =b.child_id  WHERE b.unit_id = " + unitId + " AND a.item_type = " + item_type;
            return SQLQuery<t_V_EnerProjectType>(sql);
        }

        public IList<t_V_EnerProjectType> UpdateRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid,int updateTypeID,int unit_area,int unit_people)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject  SET unit_head = '{unit_head}',unit_note = '{unit_note}',addCid='{addCid}',delCid='{delCid}',child_id='{updateTypeID}',unit_area={unit_area},unit_people={unit_people}  output inserted.*,inserted.parent_id id,inserted.unit_note Name,inserted.parent_id item_type,inserted.unit_note Remarks  WHERE parent_id = {parent_id} and child_id={child_id} and unit_id={unit_id}";
            return SQLQuery<t_V_EnerProjectType>(sql);
        }
        public DbSet<t_V_EnerProjectType> Datas { get; set; }
    }
}
