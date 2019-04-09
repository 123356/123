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
    public class VEnerProjectTypeDBContext : DBContextBase, IVEnerProjectType
    {
        public VEnerProjectTypeDBContext()
            : base(ConnectBuild.GetConnect(typeof(VEnerProjectTypeDBContext).Name))
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer<VEnerProjectTypeDBContext>(null);
            modelBuilder.Entity<t_V_EnerProjectType>()
              .HasKey(t => new { t.child_id});
            base.OnModelCreating(modelBuilder);
        }
        public IList<t_V_EnerProjectType> GetEnergyData(int UnitID, int ItemType,string UnitName)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"SELECT b.*,0.0 NeedPower,0.0 UsePower,a.*,a.Name name" +
                $" FROM t_EE_EnerUserType a " +
                $" right join t_EE_EnerUserProject b" +
                $" on a.id =b.child_id " +
                $" WHERE b.unit_id = {UnitID} AND a.item_type = {ItemType} ORDER BY b.ProjectID";
            return SQLQuery<t_V_EnerProjectType>(sql);
        }
        public IList<t_V_EnerProjectType> GetTreeData(int unitId, int item_type) {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = "SELECT *,0.0 NeedPower,0.0 UsePower FROM t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id =b.child_id  WHERE b.unit_id = " + unitId + " AND a.item_type = " + item_type;
            return SQLQuery<t_V_EnerProjectType>(sql);
        }




        public IList<t_V_EnerProjectType> UpdateRelationship(int child_id, int parent_id, int unit_id, string unit_head, string unit_note, string addCid, string delCid,int updateTypeID,int unit_area,int unit_people)
        {
            this.Database.Log = new Action<string>((string text) => { System.Diagnostics.Debug.WriteLine(text); });
            string sql = $"UPDATE t_EE_EnerUserProject  SET unit_head = '{unit_head}',unit_note = '{unit_note}',addCid='{addCid}',delCid='{delCid}',child_id='{updateTypeID}',unit_area={unit_area},unit_people={unit_people}  output inserted.*,inserted.parent_id id,inserted.unit_note Name,inserted.parent_id item_type,inserted.unit_note Remarks,0.0 NeedPower,0.0 UsePower  WHERE parent_id = {parent_id} and child_id={child_id} and unit_id={unit_id}";
            return SQLQuery<t_V_EnerProjectType>(sql);
        }
      
        public IList<t_V_EnerProjectType> DefaultNode(int unitId, int item_type)
        {
            string sql = "";
            if(item_type == 1)
            {
                sql = $"INSERT INTO t_EE_EnerUserProject  VALUES (N'0', N'1', N'{unitId}', NULL, NULL, NULL, NULL, N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'1', N'2', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'1', N'3', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'2', N'4', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'2', N'5', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'2', N'6', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'3', N'7', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'4', N'8', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'4', N'9', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'4', N'10', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'5', N'11', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'5', N'12', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'5', N'13', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'6', N'14', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'6', N'15', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'16', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'17', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'18', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'19', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'20', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'21', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'22', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'7', N'23', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'9', N'24', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'9', N'25', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'11', N'26', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'11', N'27', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'11', N'28', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'12', N'29', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'11', N'30', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'12', N'31', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'12', N'32', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'14', N'33', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'14', N'34', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'16', N'35', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'16', N'36', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'17', N'37', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'17', N'38', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'18', N'40', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'19', N'41', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'19', N'42', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'20', N'43', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'20', N'44', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'21', N'45', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'21', N'46', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject  VALUES (N'21', N'47', N'{unitId}', N'', N'', N'', N'', N'0', N'0')INSERT INTO t_EE_EnerUserProject output inserted.*,inserted.parent_id id,inserted.unit_note Name,inserted.parent_id item_type,inserted.unit_note Remarks,0.0 NeedPower,0.0 UsePower  VALUES (N'21', N'48', N'{unitId}', N'', N'', N'', N'', N'0', N'0')";
            }
            else
            {
                sql = $"INSERT INTO t_EE_EnerUserProject  output inserted.*,inserted.parent_id id,inserted.unit_note Name,inserted.parent_id item_type,inserted.unit_note Remarks,0.0 NeedPower,0.0 UsePower   VALUES  (N'0', N'415', N'{unitId}', NULL, NULL, NULL, NULL, N'0', N'0')";
            }
            return SQLQuery<t_V_EnerProjectType>(sql);
        }

        public IList<t_V_EnerProjectType> GetHistoryList(int item_type, int unitId)
        {
            string sql = "SELECT * ,0.0 NeedPower,0.0 UsePower  FROM t_EE_EnerUserType a join t_EE_EnerUserProject b on a.id =b.child_id  WHERE b.unit_id = " + unitId + " AND a.item_type = " + item_type;
            return SQLQuery<t_V_EnerProjectType>(sql);
        }

        public IList<t_V_EnerPower> GetElectricityToDay(string pid, string cid)
        {
            DateTime startTime = DateTime.Now;
            string star = startTime.ToString("yyyy-MM-dd 00:00:00.000");
            startTime = startTime.AddDays(1);
            string end = startTime.ToString("yyyy-MM-dd 00:00:00.000");

            string sql = $" SELECT a.PID,a.CID,b.UsePower,isnull(b.NeedPower,'0') as NeedPower,a.ener_use_type,b.RecordTime FROM   t_DM_CircuitInfo a" +
                $" right JOIN t_EE_PowerQualityDaily b " +
                $" ON a.CID = b.CID AND a.PID = b.PID" +
                $" WHERE a.pid  in({pid})  and a.cid in ({cid})" +
                $" and b.RecordTime> '{star}' and b.RecordTime< '{end}'  and b.UsePower!= 0   and a.ener_use_type!=''";
                return SQLQuery<t_V_EnerPower>(sql);
        }

        public IList<t_V_EnerPower> GetElectricityToMonth(string pid, string cid)
        {
            DateTime startTime = DateTime.Now;

            string star = startTime.AddDays(1 - startTime.Day).ToString("yyyy-MM-dd 00:00:00.000");
            startTime = startTime.AddDays(1);
            string end = startTime.AddDays(1 - startTime.Day).AddMonths(1).AddDays(-1).ToString("yyyy-MM-dd 00:00:00.000");
            string sql = $"SELECT DISTINCT PID,CID,RecordTime , isnull(NeedPower,'0') as NeedPower, isnull(UsePower,'0') as UsePower  FROM t_EE_PowerQualityMonthly WHERE pid in ({pid}) and cid in ({cid}) and RecordTime>= '{star}' and RecordTime<= '{end}'  order by RecordTime DESC";
            return SQLQuery<t_V_EnerPower>(sql);
        }

        public IList<t_V_EnerProjectType> PidCidGetArea(int pid, int cid)
        {

            string sql = $"SELECT  *,0.0 NeedPower , 0.0 UsePower  FROM  t_EE_EnerUserType a " +
                        $" INNER JOIN t_EE_EnerUserProject b" +
                        $" ON a.id = b.child_id" +
                        $" WHERE a.item_type= 2 AND  CHARINDEX('{pid}-{cid}',b.addCid )>0 or CHARINDEX('{pid}-{cid}',b.delCid )>0";
            return SQLQuery<t_V_EnerProjectType>(sql);
        }

        public DbSet<t_V_EnerProjectType> Datas { get; set; }
    }
}
