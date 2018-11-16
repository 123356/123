using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using System.Data;
using System.Text;

namespace S5001Web.PubClass
{
    public class ExportExcel
    {
        public static string doExport2003(DataSet tDS, string fileurl)
        {
            string filepath = "";
            string url = HttpContext.Current.Server.MapPath("~/DownLoad");
            if (Directory.Exists(HttpContext.Current.Server.MapPath("~/DownLoad")) == false)//如果不存在就创建file文件夹
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/DownLoad"));
            }
            //将WorkBook指到我们原本设计好的Templete Book1.xls
            //IWorkbook wb = new HSSFWorkbook(new FileStream("E:/CRM/Temp.xlsx", FileMode.Open));
            try
            {
                IWorkbook wb = new HSSFWorkbook();
                //设定要使用的Sheet为第0个Sheet
                ISheet TempSheet = wb.CreateSheet();
                int StartRow = 1;
                string cname = "";
                for (int i = 0; i < tDS.Tables[0].Columns.Count; i++)
                {
                    cname = tDS.Tables[0].Columns[i].ColumnName;
                    if (i == 0)
                        TempSheet.CreateRow(0).CreateCell(i).SetCellValue(cname);
                    else
                        TempSheet.GetRow(0).CreateCell(i).SetCellValue(cname);
                }
                for (int i = 0; i < tDS.Tables[0].Rows.Count; i++)
                {
                    //第一个Row要用Create的
                    //if (i == 0)
                    //{
                    for (int c = 0; c < tDS.Tables[0].Columns.Count; c++)
                    {
                        if (c == 0)
                            TempSheet.CreateRow(StartRow + i).CreateCell(c).SetCellValue(Convert.ToString(tDS.Tables[0].Rows[i][c]));
                        else
                            TempSheet.GetRow(StartRow + i).CreateCell(c).SetCellValue(Convert.ToString(tDS.Tables[0].Rows[i][c]));
                    }
                }
                //将文档写到指定位置
                filepath = HttpContext.Current.Server.MapPath(fileurl);
                using (FileStream file = new FileStream(filepath, FileMode.Create))
                {
                    wb.Write(file);
                    file.Close();
                    file.Dispose();
                }
            }
            catch (Exception e)
            {
                string a = e.ToString();
            }
            return filepath;
        }

        public static string doImport2003( DataSet tDS,int Mode)
        {
            StringBuilder Result = new StringBuilder();
            string TagIDs = "";
            int errorCount = 0;
            try
            {
                pdermsWebEntities bll = new pdermsWebEntities();

                //检验excel表格中的数据是否符合格式
                //检查列数是否与数据库一致
                if (tDS.Tables[0].Columns.Count == 42){
                    for (int i = 0; i < tDS.Tables[0].Rows.Count; i++)
                    {
                        string MDate = tDS.Tables[0].Rows[i][1].ToString();
                        string Val = tDS.Tables[0].Rows[i][2].ToString();
                        for (int j = 0; j < tDS.Tables[0].Columns.Count; j++)
                        {
                            //检查TagID
                            if (tDS.Tables[0].Rows[i][0].ToString() == "")
                            {
                                Result.Append("错误：第" + i + "列,缺少TagID。<br>");
                                errorCount++;
                            }
                            else
                                TagIDs += tDS.Tables[0].Rows[i][0].ToString() + ",";
                            //检查DID
                            if (tDS.Tables[0].Rows[i][2].ToString() == "")
                            {
                                Result.Append("错误：第" + i + "列,缺少DID。<br>");
                                errorCount++;
                            }

                            //检查实时库索引
                            if (tDS.Tables[0].Rows[i][14].ToString() == "")
                            {
                                Result.Append("错误：第" + i + "列,缺少实时库索引。<br>");
                                errorCount++;
                            }

                            //检查PID
                            if (tDS.Tables[0].Rows[i][15].ToString() == ""){
                                Result.Append("错误：第" + i + "列,缺少PID。<br>");
                                errorCount++;
                            }

                        }
                    }
                }
                else {
                    Result.Append("错误：列数错误。\r");
                    errorCount++;
                }
                string pointSQL = "SELECT * FROM t_CM_PointsInfo WHERE TagID in (" + TagIDs.TrimEnd(',') + ")";
                List<t_CM_PointsInfo> list = bll.ExecuteStoreQuery<t_CM_PointsInfo>(pointSQL).ToList();
                if (list.Count > 0) {
                    //覆盖模式下删除重复数据
                    if (Mode > 0)
                    {
                        list.ForEach(i =>
                        {
                            bll.AttachTo("t_CM_PointsInfo", i);
                            bll.t_CM_PointsInfo.DeleteObject(i);
                        });
                        bll.SaveChanges();
                    }
                    else
                    {
                        foreach (t_CM_PointsInfo p in list)
                        {
                            Result.Append("错误：数据库中已经存在 TagID = " + p.TagID + "的行。<br>");
                            errorCount++;
                        }
                    }
                }
                StringBuilder strSQL = new StringBuilder();
                if (errorCount < 1)
                {
                    //关闭标识
                    strSQL.Append("set IDENTITY_INSERT t_CM_PointsInfo ON ");
                    //插入数据库
                    for (int i = 0; i < tDS.Tables[0].Rows.Count; i++)
                    {
                        strSQL.Append("insert into t_CM_PointsInfo (TagID,TagName,DID,DataTypeID,Position,MPID,UseState,PIOID,ABCID,Remarks,数据类型,设备点名,中文描述,站内点号,实时库索引,PID,通信地址,例外报告死区,工程下限,工程上限,码值下限,码值上限,远动数据类型,报警下限1,报警上限1,报警定义,置0说明,置1说明,单位,分组,最大间隔时间,小信号切除值,报警下限2,报警上限2,报警下限3,报警上限3,报警死区,报警级别,报警方式,速率报警限制,初始值,传感器SN编码) ");
                        strSQL.Append( "values ("
                        + "" + tDS.Tables[0].Rows[i][0] + ","
                        + "'" + tDS.Tables[0].Rows[i][1] + "',"
                        + "" + tDS.Tables[0].Rows[i][2] + ","
                        + "" + tDS.Tables[0].Rows[i][3] + ","
                        + "'" + tDS.Tables[0].Rows[i][4] + "',"
                        + "" + tDS.Tables[0].Rows[i][5] + ","
                        + "" + tDS.Tables[0].Rows[i][6] + ","
                        + "" + tDS.Tables[0].Rows[i][7] + ","
                        + "" + tDS.Tables[0].Rows[i][8] + ","
                        + "'" + tDS.Tables[0].Rows[i][9] + "',"
                        + "'" + tDS.Tables[0].Rows[i][10] + "',"
                        + "'" + tDS.Tables[0].Rows[i][11] + "',"
                        + "'" + tDS.Tables[0].Rows[i][12] + "',"
                        + "'" + tDS.Tables[0].Rows[i][13] + "',"
                        + "" + tDS.Tables[0].Rows[i][14] + ","
                        + "" + tDS.Tables[0].Rows[i][15] + ","
                        + "" + tDS.Tables[0].Rows[i][16] + ","
                        + "" + tDS.Tables[0].Rows[i][17] + ","
                        + "" + tDS.Tables[0].Rows[i][18] + ","
                        + "" + tDS.Tables[0].Rows[i][19] + ","
                        + "" + tDS.Tables[0].Rows[i][20] + ","
                        + "" + tDS.Tables[0].Rows[i][21] + ","
                        + "'" + tDS.Tables[0].Rows[i][22] + "',"
                        + "" + tDS.Tables[0].Rows[i][23] + ","
                        + "" + tDS.Tables[0].Rows[i][24] + ","
                        + "" + tDS.Tables[0].Rows[i][25] + ","
                        + "'" + tDS.Tables[0].Rows[i][26] + "',"
                        + "'" + tDS.Tables[0].Rows[i][27] + "',"
                        + "'" + tDS.Tables[0].Rows[i][28] + "',"
                        + "" + tDS.Tables[0].Rows[i][29] + ","
                        + "" + tDS.Tables[0].Rows[i][30] + ","
                        + "" + tDS.Tables[0].Rows[i][31] + ","
                        + "" + tDS.Tables[0].Rows[i][32] + ","
                        + "" + tDS.Tables[0].Rows[i][33] + ","
                        + "" + tDS.Tables[0].Rows[i][34] + ","
                        + "" + tDS.Tables[0].Rows[i][35] + ","
                        + "" + tDS.Tables[0].Rows[i][36] + ","
                        + "" + tDS.Tables[0].Rows[i][37] + ","
                        + "" + tDS.Tables[0].Rows[i][38] + ","
                        + "" + tDS.Tables[0].Rows[i][39] + ","
                        + "" + tDS.Tables[0].Rows[i][40] + ","
                        + "'" + tDS.Tables[0].Rows[i][41] + "')");
                    }
                    strSQL.Append("set IDENTITY_INSERT t_CM_PointsInfo OFF");
                    bll.ExecuteStoreCommand(strSQL.ToString());
                    Result.Append("OK");
                }
                return Result.ToString();
            }
            catch (Exception e)
            {
                string a = e.ToString();
                return a;
            }
        }
    }
}