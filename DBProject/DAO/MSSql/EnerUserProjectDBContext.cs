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
    public class EnerUserProjectDBContext : DBContextBase, IEnerUserProject
    {
        public EnerUserProjectDBContext()
            : base(ConnectBuild.GetConnect(typeof(EnerUserProjectDBContext).Name))
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<EnerUserProjectDBContext>(null);
            modelBuilder.Entity<t_EE_EnerUserProject>()
              .HasKey(t => new { t.child_id});
            base.OnModelCreating(modelBuilder);
        }


        public IList<t_EE_EnerUserProject> AddRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid, int unit_area, int unit_people)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); }); 
            string sql = $"INSERT INTO t_EE_EnerUserProject(child_id,parent_id,unit_id,unit_head,unit_note,addCid,delCid,unit_area,unit_people) output inserted.* VALUES({ child_id},{parent_id},{unit_id},'{unit_head}','{unit_note}','{addCid}','{delCid}',{unit_area},{unit_people})";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }



        public IList<t_EE_EnerUserProject> UpdateSupervisor(int oldId,int id, int unit_id) {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject SET child_id = {id}  WHERE child_id = {oldId} and unit_id = {unit_id} ;UPDATE t_EE_EnerUserProject SET parent_id = {id} output inserted.* WHERE parent_id = {oldId} and unit_id = {unit_id}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }



        public IList<t_EE_EnerUserProject> DeleteSupervisor(int parent_id, int child_id, int unit_id)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            //  string sql = "SELECT t_EE_EnerUserProject.parent_id,t_EE_EnerUserProject.child_id FROM t_EE_EnerUserType,t_EE_EnerUserProject WHERE t_EE_EnerUserType.item_type = 1 AND t_EE_EnerUserType.id =t_EE_EnerUserProject.parent_id";
           // string sql = "SELECT * FROM t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id =b.child_id WHERE b.unit_Id = " + unitId + " AND a.item_type = " + itemType;

            string sql = $"DELETE FROM t_EE_EnerUserProject   output deleted.* WHERE parent_id = {parent_id} and child_id = {child_id} and unit_id = {unit_id};DELETE FROM t_EE_EnerUserProject WHERE parent_id = {child_id} and  unit_id = {unit_id}";

            return SQLQuery<t_EE_EnerUserProject>(sql);
        }

        public IList<t_EE_EnerUserProject> GetCidByUidAndIDepID(int uid, int depid)
        {
            string sql = $"select * from t_EE_EnerUserProject where unit_id={uid} and child_id={depid}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }

        public IList<t_EE_EnerUserProject> GetDepIDByParID(int uid, int parid)
        {
            string sql = $"select * from t_EE_EnerUserProject where unit_id={uid} and parent_id={parid}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }

        public DbSet<t_EE_EnerUserProject> Datas { get; set; }
    }
}
