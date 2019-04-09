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
              .HasKey(t => new { t.child_id });
            base.OnModelCreating(modelBuilder);
        }


        public IList<t_EE_EnerUserProject> addTreeNode(t_V_EnerProjectType data)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"INSERT INTO t_EE_EnerUserProject(child_id,parent_id,unit_id,unit_head,unit_note,addCid,delCid,unit_area,unit_people) output inserted.* " +
                $" VALUES({ data.ID},{data.parent_id},{data.unit_id},'{data.unit_head}','{data.unit_note}','{data.addCid}','{data.delCid}',{data.unit_area},{data.unit_people})";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }




        public IList<t_EE_EnerUserProject> updataTreeNode(t_V_EnerProjectType data)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject SET unit_head = '{data.unit_head}',unit_note='{data.unit_note}',addCid='{data.addCid}',delCid='{data.delCid}',unit_area={data.unit_area},unit_people={data.unit_people} output inserted.*  WHERE parent_id = {data.parent_id} and  child_id = {data.ID} and unit_id = {data.unit_id}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }


        public IList<t_EE_EnerUserProject> updataTreeNodeId(t_V_EnerProjectType data)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject SET  child_id = {data.ID} output inserted.*  WHERE parent_id = {data.parent_id} and  child_id = {data.child_id} and unit_id = {data.unit_id};" +
                        $"UPDATE t_EE_EnerUserProject SET  parent_id = {data.ID}  WHERE parent_id = {data.child_id} and unit_id = {data.unit_id};";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }





        public IList<t_EE_EnerUserProject> UpdateSupervisor(int oldId, int id, int unit_id)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject SET child_id = {id}  WHERE child_id = {oldId} and unit_id = {unit_id} ;UPDATE t_EE_EnerUserProject SET parent_id = {id} output inserted.* WHERE parent_id = {oldId} and unit_id = {unit_id}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }



        public IList<t_EE_EnerUserProject> UpdatEnerNode(t_V_EnerProjectType data)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject SET child_id = {data.child_id}  WHERE child_id = {data.child_id} and unit_id = {data.unit_id} ;UPDATE t_EE_EnerUserProject SET parent_id = {data.parent_id} output inserted.* WHERE parent_id = {data.parent_id} and unit_id = {data.unit_id}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }


        public IList<t_EE_EnerUserProject> DeleteSupervisor(int parent_id, int child_id, int unit_id)
        {



            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = "";
            if (child_id == -1)
            {
                sql = $"DELETE FROM t_EE_EnerUserProject  output deleted.*  WHERE parent_id = {parent_id} and  unit_id = {unit_id}";
            }
            else
            {
                sql = $"DELETE FROM t_EE_EnerUserProject  output deleted.* WHERE parent_id = {parent_id} and child_id = {child_id} and unit_id = {unit_id}";
            }

            return SQLQuery<t_EE_EnerUserProject>(sql);


        }

        public IList<t_EE_EnerUserProject> GetCidByUidAndIDepID(int uid, int depid)
        {
            string sql = $"select * from t_EE_EnerUserProject where unit_id={uid}";
            if (depid != 0)
                sql += $" and child_id = {depid}";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }

        public IList<t_EE_EnerUserProject> GetDepIDByParID(int uid, int parid, int isP)
        {
            string sql = $"select * from t_EE_EnerUserProject where unit_id={uid}";
            if (isP == 1)
            {
                sql += $" and parent_id={parid}";
            }
            else
            {
                if (parid != 0)
                    sql += $" and parent_id={parid}";
            }
            sql += " order by child_id";
            return SQLQuery<t_EE_EnerUserProject>(sql);
        }

        public DbSet<t_EE_EnerUserProject> Datas { get; set; }
    }
}
