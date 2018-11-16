using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
//using Microsoft.Office.Core;
using Word = Microsoft.Office.Interop.Word;
using System.IO;
using System.Data;
using Microsoft.Office.Interop.Word;
using S5001Web.Controllers;
namespace S5001Web.PubClass
{
    public class Exportdoc
    {
        private static string TransDateType(DateTime? dt)
        {
            string strResult = "";
            if (dt != null)
            {
                strResult = Convert.ToDateTime(dt).ToString("yyyy-MM-dd HH:mm");
            }
            return strResult;
        }
        /// <summary>
        /// 调用模板生成word
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static void ExportWordFromOrder(int OrderID)
        {
            Word.Document doc = null;
            try
            {
                pdermsWebEntities bll = new pdermsWebEntities();
                string strsql = "select * from V_Order_PdrInfo where OrderID=" + OrderID;
                List<V_Order_PdrInfo> list = bll.ExecuteStoreQuery<V_Order_PdrInfo>(strsql).ToList();
                //如果存在工单
                if (list.Count > 0)
                {
                    V_Order_PdrInfo order = list.First();
                    object linkToFile = false;
                    object saveWithDocument = true;
                    //模板文件
                    string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/运维检修报告.doc");
                    //生成的具有模板样式的新文件
                    string filePath = "~/DownLoad/order";
                    string fileName = HttpContext.Current.Server.MapPath(filePath);
                    DirectoryUtil.CreateDirectory(fileName);
                    fileName = fileName + "\\order" + OrderID + ".doc";
                    DirectoryUtil.DeleteFile(fileName);//删除文件
                    //生成word程序对象
                    Word.Application app = new Word.Application();

                    //模板文件
                    string TemplateFile = templateFile;
                    //生成的具有模板样式的新文件
                    string FileName = fileName;

                    //模板文件拷贝到新文件
                    File.Copy(TemplateFile, FileName);
                    //生成documnet对象
                    doc = new Word.Document();
                    object Obj_FileName = FileName;
                    object Visible = false;
                    object ReadOnly = false;
                    object missing = System.Reflection.Missing.Value;

                    //打开文件
                    doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                        ref missing, ref missing, ref missing, ref missing,
                        ref missing, ref missing, ref missing, ref Visible,
                        ref missing, ref missing, ref missing,
                        ref missing);
                    doc.Activate();
                    object WordMarkName = "编号";//word模板中的书签名称
                    object what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.OrderNO);//插入的内容，插入位置是word模板中书签定位的位置
                    doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式

                    WordMarkName = "配电房名称";//word模板中的书签名称
                    //what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.PName);//插入的内容，插入位置是word模板中书签定位的位置
                    //doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式

                    WordMarkName = "配电房位置";//word模板中的书签名称
                    //what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.Position);//插入的内容，插入位置是word模板中书签定位的位置
                    //doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式

                    WordMarkName = "电压等级";//word模板中的书签名称
                    //what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.Vlevel);//插入的内容，插入位置是word模板中书签定位的位置
                    //doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式

                    WordMarkName = "变压器台数";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.Transformers.ToString());//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "总容量";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.CapTotal.ToString());//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "报告日期";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(order.ReportDate));//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "报告人";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.ReportUser);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "隐患描述";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.BugDesc);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "工单描述";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置

                    string strTmp = order.OrderContent;
                    if (strTmp != null)
                        strTmp = strTmp.Replace("<br>", "\n");
                    doc.ActiveWindow.Selection.TypeText(strTmp);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "派单时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(order.CreateDate));//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "受理时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(order.AcceptedDate));//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "首次到现场时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(order.FistDate));//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "完成时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(order.CheckDate));//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "工单名称";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.OrderName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "负责人";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.UserName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "检查情况";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.CheckInfo);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "处理结果";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.IsQualified == 1 ? "已完成作业" : "未完成作业");//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "维护单位";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.CompanyName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系人";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.LinkMan);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系电话";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(order.Mobile);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "打印时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(DateTime.Now));//插入的内容，插入位置是word模板中书签定位的位置                    

                    //判断是否存在图片
                    strsql = "select [ID],[VerifyOk],[FileName],[FilePath],[FileType],[FileSize],[FileExtension],[Modules],[Fk_ID],[FSource],[MaxTemp],[MinTemp],[Remark],[CommitUser],[CommitTime] from (select row_number()over(partition by modules order by modules) as num,* from t_CM_files where Modules in ('order','bug') and Fk_ID=" + OrderID + " and FileType in ('image','doc'))a";
                    List<t_cm_files> listimage = bll.ExecuteStoreQuery<t_cm_files>(strsql).ToList();
                    int ibug = 0, iorder = 0;
                    string strmark, imgName;
                    int i = 0;
                    foreach (t_cm_files f in listimage)
                    {
                        if (f.FileType.Equals("image"))
                        {
                            i++;
                            if (i > 20) break;
                            if (f.Modules.Equals("bug"))
                            {
                                ibug++;
                                strmark = "工单描述图片" + ibug;
                            }
                            else
                            {
                                iorder++;
                                strmark = "处理结果图片" + iorder;
                            }
                            //图片地址
                            imgName = HttpContext.Current.Server.MapPath(f.FilePath);

                            WordMarkName = strmark;//word模板中的书签名称
                            doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                            object range = app.Selection.Range;
                            Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                        }
                    }
                    //输出完毕后关闭doc对象
                    object IsSave = true;
                    doc.Close(ref IsSave, ref missing, ref missing);
                    //保存到资料库                    
                    listimage = listimage.Where(f => f.FileType == "doc").ToList();


                    if (listimage.Count() > 0)
                    {
                        strsql = "delete from t_cm_files where FileType='doc' and FK_ID=" + OrderID + " and Modules='order'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }
                    t_cm_files obj1 = new t_cm_files();
                    obj1.FileName = "order" + OrderID + ".doc";
                    obj1.FilePath = filePath + "/order" + OrderID + ".doc";
                    obj1.FileExtension = ".doc";
                    obj1.FileSize = (FileSize(FileName) / 1024).ToString() + "KB";
                    obj1.FileType = "doc";
                    obj1.Fk_ID = OrderID;
                    obj1.FSource = "auto";
                    obj1.MaxTemp = 0;
                    obj1.MinTemp = 0;
                    obj1.Remark = "检修报告自动生成";
                    obj1.Modules = "order";
                    obj1.CommitTime = DateTime.Now;
                    obj1.CommitUser = order.UserName;
                    bll.t_cm_files.AddObject(obj1);
                    bll.SaveChanges();
                    //}
                    //else
                    //{
                    //    //strsql = "update t_cm_files set FileSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CommitTime=getdate() where FileType='doc' and FK_ID=" + OrderID + " and Modules='order'";
                    //    //bll.ExecuteStoreCommand(strsql, null);
                    //}

                    //保存到分析报告                 
                    strsql = "select  * from t_PM_ReportInfo where  RType='应急抢修' and RName='order" + OrderID + ".doc'";
                    List<t_PM_ReportInfo> listreport = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();
                    if (listreport.Count() == 0)
                    {
                        t_PM_ReportInfo obj = new t_PM_ReportInfo();
                        obj.RName = " " + OrderID + ".doc";
                        obj.RPath = filePath + "/order" + OrderID + ".doc";
                        obj.RSize = (FileSize(FileName) / 1024).ToString() + "KB";
                        obj.FType = "doc";
                        obj.RType = "应急抢修";
                        obj.PID = order.PID;
                        obj.CreatDate = DateTime.Now;
                        obj.Creater = order.UserName;
                        bll.t_PM_ReportInfo.AddObject(obj);
                        bll.SaveChanges();
                    }
                    else
                    {
                        strsql = "update t_PM_ReportInfo set RSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CreatDate=getdate() where RType='应急抢修' and RName='order" + OrderID + ".doc'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }
                }
            }
            catch (Exception ex)
            {
                //实际发生的异常
                Exception innerException = ex.InnerException;
                if (innerException != null) ex = innerException;
                var logPath = HttpContext.Current.Server.MapPath("~/logs/");
                if (!Directory.Exists(logPath))
                {
                    Directory.CreateDirectory(logPath);
                }
                //new StreamWriter(mydocpath + @"\WriteLines.txt", true)
                using (StreamWriter sw = new StreamWriter(logPath + @"\WordLog" + DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss") + ".txt", true))
                {
                    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    sw.WriteLine("生成word未处理异常：" + ex.GetType().ToString());
                    sw.WriteLine("异常信息：" + ex.Message);
                    sw.WriteLine("异常堆栈：" + ex.StackTrace);
                    sw.WriteLine();
                }
                return;
            }
            finally
            {
                //输出完毕后关闭doc对象
                if (doc != null)
                {
                    object IsSave = true;
                    object missing = System.Reflection.Missing.Value;
                    doc.Close(ref IsSave, ref missing, ref missing);
                }
            }
        }

        //生成变压器试验报告；
        public static void ExportWordFromReport(int OrderID, int DID, t_CM_UserInfo user, int templateId, int pid)
        {
            Word.Document doc = null;
            string timeFile = DateTime.Now.ToString("yyyyMMddHHmmss");
            try
            {
                pdermsWebEntities bll = new pdermsWebEntities();
                string strsql = "SELECT DISTINCT t_PM_Order_Template.templateInfo,t_PM_Order_Template.infoType,t_PM_Order_Template.templateName,t_PM_Order_InfoRecord.* FROM t_PM_Order_InfoRecord,t_PM_Order_Template WHERE orderId=" + OrderID + " AND DID = " + DID + " AND t_PM_Order_InfoRecord.tInfoId=t_PM_Order_Template.id AND t_PM_Order_InfoRecord.templateId=" + templateId;
                List<OrderRecord> list = bll.ExecuteStoreQuery<OrderRecord>(strsql).ToList();
                //如果存在记录
                if (list.Count > 0)
                {
                    OrderRecord record = list.First();
                    object linkToFile = false;
                    object saveWithDocument = true;
                    //模板文件
                    string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/" + record.templateName + ".doc");
                    //生成的具有模板样式的新文件
                    string filePath = "~/DownLoad/report";
                    string fileName = HttpContext.Current.Server.MapPath(filePath);
                    DirectoryUtil.CreateDirectory(fileName);
                    fileName = fileName + "\\" + record.templateName + OrderID + "_" + DID + "_" + timeFile + ".doc";
                    DirectoryUtil.DeleteFile(fileName);//删除文件
                    //生成word程序对象
                    Word.Application app = new Word.Application();

                    //模板文件
                    string TemplateFile = templateFile;
                    //生成的具有模板样式的新文件
                    string FileName = fileName;

                    //模板文件拷贝到新文件
                    File.Copy(TemplateFile, FileName);
                    //生成documnet对象
                    doc = new Word.Document();
                    object Obj_FileName = FileName;
                    object Visible = false;
                    object ReadOnly = false;
                    object missing = System.Reflection.Missing.Value;

                    //打开文件
                    doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                        ref missing, ref missing, ref missing, ref missing,
                        ref missing, ref missing, ref missing, ref Visible,
                        ref missing, ref missing, ref missing,
                        ref missing);
                    doc.Activate();

                    for (int i = 0; i < list.Count; i++)
                    {
                        if (list[i].infoValue != null)
                        {
                            object WordMarkName = "q" + list[i].tInfoId;//word模板中的书签名称
                            object what = Word.WdGoToItem.wdGoToBookmark;
                            doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                            string value = list[i].infoValue;
                            if (list[i].infoType == 2)
                            {
                                value = value.Equals("1") ? "合格" : "不合格";
                            }
                            doc.ActiveWindow.Selection.TypeText(value);//插入的内容，插入位置是word模板中书签定位的位置
                        }
                    }
                    //输出完毕后关闭doc对象
                    object IsSave = true;
                    doc.Close(ref IsSave, ref missing, ref missing);
                    //保存到资料库                    
                    t_cm_files obj1 = new t_cm_files();
                    obj1.FileName = record.templateName + OrderID + "_" + DID + "_" + timeFile + ".doc";
                    obj1.FilePath = filePath + "/" + record.templateName + OrderID + "_" + DID + "_" + timeFile + ".doc";
                    obj1.FileExtension = ".doc";
                    obj1.FileSize = (FileSize(FileName) / 1024).ToString() + "KB";
                    obj1.FileType = "doc";
                    obj1.Fk_ID = OrderID;
                    obj1.FSource = "auto";
                    obj1.MaxTemp = 0;
                    obj1.MinTemp = 0;
                    obj1.Remark = "试验报告自动生成";
                    obj1.Modules = "report";
                    obj1.CommitTime = DateTime.Now;
                    obj1.CommitUser = user.UserName;
                    bll.t_cm_files.AddObject(obj1);
                    bll.SaveChanges();
                    //保存到分析报告                 
                    strsql = "select  * from t_PM_ReportInfo where  RType='试验报告' and RName='report" + OrderID + ".doc'";
                    List<t_PM_ReportInfo> listreport = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();

                    if (listreport.Count() == 0)
                    {
                        t_PM_ReportInfo obj = new t_PM_ReportInfo();
                        obj.RName = OrderID + "_" + DID + ".doc";
                        obj.RPath = filePath + "/" + record.templateName + OrderID + "_" + DID + "_" + timeFile + ".doc";
                        obj.RSize = (FileSize(FileName) / 1024).ToString() + "KB";
                        obj.FType = "doc";
                        obj.RType = "试验报告";
                        obj.PID = pid;
                        obj.CreatDate = DateTime.Now;
                        obj.Creater = user.UserName;
                        bll.t_PM_ReportInfo.AddObject(obj);
                        bll.SaveChanges();
                    }
                    else
                    {
                        strsql = "update t_PM_ReportInfo set RSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CreatDate=getdate() where RType='试验报告' and RName='record" + OrderID + ".doc'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }
                }
            }
            catch (Exception ex)
            {
                //实际发生的异常
                Exception innerException = ex.InnerException;
                if (innerException != null) ex = innerException;
                var logPath = HttpContext.Current.Server.MapPath("~/logs/");
                if (!Directory.Exists(logPath))
                {
                    Directory.CreateDirectory(logPath);
                }
                //new StreamWriter(mydocpath + @"\WriteLines.txt", true)
                using (StreamWriter sw = new StreamWriter(logPath + @"\WordLog" + DateTime.Now.ToString("yyyy-MM-dd HH-mm-ss") + ".txt", true))
                {
                    sw.WriteLine(DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
                    sw.WriteLine("生成word未处理异常：" + ex.GetType().ToString());
                    sw.WriteLine("异常信息：" + ex.Message);
                    sw.WriteLine("异常堆栈：" + ex.StackTrace);
                    sw.WriteLine();
                }
                return;
            }
        }

        /// <summary>
        /// 调用模板生成word
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static void ExportWord()
        {
            try
            {
                //图片地址
                string imgName = HttpContext.Current.Server.MapPath("~/Content/images/xct1.jpg");
                object linkToFile = false;
                object saveWithDocument = true;
                //模板文件
                string templateFile = @"D:\Word模板.doc";
                //生成的具有模板样式的新文件
                string fileName = @"D:\导出后的Word文件" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                //生成word程序对象
                Word.Application app = new Word.Application();

                //模板文件
                string TemplateFile = templateFile;
                //生成的具有模板样式的新文件
                string FileName = fileName;

                //模板文件拷贝到新文件
                File.Copy(TemplateFile, FileName);
                //生成documnet对象
                Word.Document doc = new Word.Document();
                object Obj_FileName = FileName;
                object Visible = false;
                object ReadOnly = false;
                object missing = System.Reflection.Missing.Value;

                //打开文件
                doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                    ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref Visible,
                    ref missing, ref missing, ref missing,
                    ref missing);
                doc.Activate();

                int WordNum = 10;//书签个数
                //将光标转到模板中定义的书签的位置，插入所需要添加的内容，循环次数与书签个数相符
                for (int WordIndex = 1; WordIndex <= WordNum; WordIndex++)
                {
                    object WordMarkName = "书签名称" + WordIndex.ToString();//word模板中的书签名称
                    object what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    //插入图片
                    if (WordIndex == 4)
                    {
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }
                    else
                        doc.ActiveWindow.Selection.TypeText("插入的内容" + WordIndex.ToString());//插入的内容，插入位置是word模板中书签定位的位置

                    doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式
                    //doc.ActiveWindow.Selection.TypeParagraph();//回车换行
                }

                //输出完毕后关闭doc对象
                object IsSave = true;
                doc.Close(ref IsSave, ref missing, ref missing);
            }
            catch (Exception Ex)
            {
                return;
            }
        }

        /// <summary>
        /// 调用模板生成word
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static void ExportWordFromAlarm(int AlarmID)
        {
            try
            {
                LoginAttribute loginbll = new LoginAttribute();
                pdermsWebEntities bll = new pdermsWebEntities();
                string strsql = "select * from V_Alarm_PDRInfo where AlarmID=" + AlarmID;
                List<V_Alarm_PDRInfo> list = bll.ExecuteStoreQuery<V_Alarm_PDRInfo>(strsql).ToList();

                //如果存在报警
                if (list.Count > 0)
                {
                    V_Alarm_PDRInfo alarm = list.First();
                    object linkToFile = false;
                    object saveWithDocument = true;
                    //模板文件
                    string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/报警报告模板.doc");
                    //生成的具有模板样式的新文件
                    string filePath = "~/DownLoad/alarm";
                    string fileName = HttpContext.Current.Server.MapPath(filePath);
                    DirectoryUtil.CreateDirectory(fileName);
                    fileName = fileName + "\\alarm" + AlarmID + ".doc";
                    DirectoryUtil.DeleteFile(fileName);//删除文件
                    //生成word程序对象
                    Word.Application app = new Word.Application();

                    //模板文件
                    string TemplateFile = templateFile;
                    //生成的具有模板样式的新文件
                    string FileName = fileName;

                    //模板文件拷贝到新文件
                    File.Copy(TemplateFile, FileName);
                    //生成documnet对象
                    Word.Document doc = new Word.Document();
                    object Obj_FileName = FileName;
                    object Visible = false;
                    object ReadOnly = false;
                    object missing = System.Reflection.Missing.Value;

                    //打开文件
                    doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                        ref missing, ref missing, ref missing, ref missing,
                        ref missing, ref missing, ref missing, ref Visible,
                        ref missing, ref missing, ref missing,
                        ref missing);
                    doc.Activate();

                    string temperature = "";  //环境温度
                    string humidity = "";  //环境湿度
                    if (alarm.PID > 0 && alarm.TagID > 0)
                    {
                        string sql = "select a.*,b.DataTypeID,b.DID from t_SM_RealTimeData_" + alarm.PID.ToString().PadLeft(5, '0') + " a left join t_CM_PointsInfo b on a.TagID=b.TagID where a.TagID=" + alarm.TagID;
                        List<t_SM_RealTimeData> RealTimData = bll.ExecuteStoreQuery<t_SM_RealTimeData>(sql).ToList();
                        if (RealTimData.Count > 0)
                        {
                            int TypeID = RealTimData[0].DataTypeID;
                            if (TypeID == 24 || TypeID == 12)
                                temperature = RealTimData[0].PV.ToString();
                            if (TypeID == 25 || TypeID == 13)
                                humidity = RealTimData[0].PV.ToString();
                        }

                        //前一小时趋势数据 
                        string sql2 = "select CONVERT(varchar(100), RecTime, 20) RecTime,PV,AlarmStatus,AlarmLimits from t_SM_HisData_" + alarm.PID.ToString().PadLeft(5, '0') + " where TagID=" + alarm.TagID + " and RecTime >= '" + Convert.ToDateTime(alarm.AlarmDateTime).AddHours(-1) + "' and RecTime <= '" + Convert.ToDateTime(alarm.AlarmDateTime) + "' order by RecTime desc";
                        System.Data.DataTable dt = Common.ToDataTable(bll.ExecuteStoreQuery<t_SM_HisData>(sql2).ToList());
                        if (dt.Rows.Count > 0)
                        {
                            Bookmarks odf = doc.Bookmarks;

                            object obAttachMent = "前一小时趋势数据";
                            //创建Word表格，并指定标签
                            Microsoft.Office.Interop.Word.Table dtWord = doc.Tables.Add(odf.get_Item(ref obAttachMent).Range, dt.Rows.Count + 1, dt.Columns.Count);

                            dtWord.Borders.InsideLineStyle = WdLineStyle.wdLineStyleDot;
                            dtWord.Borders.OutsideLineStyle = WdLineStyle.wdLineStyleDot;

                            //列宽度
                            dtWord.Columns[1].Width = 120f;
                            dtWord.Columns[2].Width = 85f;
                            dtWord.Columns[3].Width = 85f;
                            dtWord.Columns[4].Width = 85f;

                            dtWord.Rows[1].Cells[1].Range.Text = "时间";
                            dtWord.Rows[1].Cells[2].Range.Text = "报警值";
                            dtWord.Rows[1].Cells[3].Range.Text = "状态";
                            dtWord.Rows[1].Cells[4].Range.Text = "限值";

                            //循环往表格里赋值
                            for (int i = 2; i <= dt.Rows.Count + 1; i++)
                            {
                                for (int j = 1; j <= dt.Columns.Count; j++)
                                {
                                    dtWord.Rows[i].Cells[j].Range.Text = dt.Rows[i - 2][j - 1].ToString();
                                }
                            }
                        }
                    }
                    string Desc = alarm.ALarmType + "：" + alarm.AlarmCate + "" + alarm.PName + alarm.AlarmAddress + alarm.Company + "：" + alarm.AlarmValue + "，限值" + alarm.AlarmMaxValue + "，" + TransDateType(alarm.AlarmDateTime);
                    object WordMarkName = "站名称";//word模板中的书签名称
                    object what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.PName);//插入的内容，插入位置是word模板中书签定位的位置
                    doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式

                    WordMarkName = "位置";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.Position);//插入的内容，插入位置是word模板中书签定位的位置                  

                    WordMarkName = "报警日期";//word模板中的书签名称                 
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(alarm.AlarmDateTime));//插入的内容，插入位置是word模板中书签定位的位置 

                    WordMarkName = "环境温度";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(temperature);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "环境湿度";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(humidity);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "设备名称";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.DeviceName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "监测位置";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.AlarmArea);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "描述";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(Desc);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "维护单位";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.UnitName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系人";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.LinkMan);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系电话";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(alarm.LinkMobile);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "打印时间";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(TransDateType(DateTime.Now));//插入的内容，插入位置是word模板中书签定位的位置

                    //输出完毕后关闭doc对象
                    object IsSave = true;
                    doc.Close(ref IsSave, ref missing, ref missing);
                    //保存到资料库                 
                    strsql = "select  * from t_cm_files where  FileType='doc' and Fk_ID=" + AlarmID + " and Modules='alarm'";
                    List<t_cm_files> listimage = bll.ExecuteStoreQuery<t_cm_files>(strsql).ToList();
                    listimage = listimage.Where(f => f.FileType == "doc").ToList();
                    if (listimage.Count() == 0)
                    {
                        t_cm_files obj = new t_cm_files();
                        obj.FileName = "alarm" + AlarmID + ".doc";
                        obj.FilePath = filePath + "/alarm" + AlarmID + ".doc";
                        obj.FileExtension = ".doc";
                        obj.FileSize = "";
                        obj.FileType = "doc";
                        obj.Fk_ID = AlarmID;
                        obj.FSource = "web";
                        obj.MaxTemp = 0;
                        obj.MinTemp = 0;
                        obj.Remark = "报警报告生成";
                        obj.Modules = "alarm";
                        obj.CommitTime = DateTime.Now;
                        obj.CommitUser = loginbll.CurrentUser.UserName;
                        bll.t_cm_files.AddObject(obj);
                        bll.SaveChanges();
                    }
                    else
                    {
                        strsql = "update t_cm_files set FileSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CommitTime=getdate() where FileType='doc' and FK_ID=" + AlarmID + " and Modules='alarm'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }

                    //保存到分析报告                 
                    strsql = "sel ect  * from t_PM_ReportInfo where  RType='监测报警' and RName='alarm" + AlarmID + ".doc'";
                    List<t_PM_ReportInfo> listreport = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();
                    if (listreport.Count() == 0)
                    {
                        t_PM_ReportInfo obj = new t_PM_ReportInfo();
                        obj.RName = "alarm" + AlarmID + ".doc";
                        obj.RPath = filePath + "/alarm" + AlarmID + ".doc";
                        obj.RSize = (FileSize(FileName) / 1024).ToString() + "KB";
                        obj.FType = "doc";
                        obj.RType = "监测报警";
                        obj.PID = alarm.PID;
                        obj.CreatDate = DateTime.Now;
                        obj.Creater = loginbll.CurrentUser.UserName;
                        bll.t_PM_ReportInfo.AddObject(obj);
                        bll.SaveChanges();
                    }
                    else
                    {
                        strsql = "update t_PM_ReportInfo set RSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CreatDate=getdate() where RType='监测报警' and RName='alarm" + AlarmID + ".doc'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }
                }
            }
            catch (Exception Ex)
            {
                return;
            }
        }


        /// <summary>
        /// 调用模板生成word
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static void ExportWordFromRun(string Img2, string Img3, string Img4, string Img5, string Img6, int PID, string ReportStartDate, string ReportEndDate)
        {
            try
            {
                LoginAttribute loginbll = new LoginAttribute();
                pdermsWebEntities bll = new pdermsWebEntities();
                string strsql = "select * from t_CM_PDRInfo where PID=" + PID;
                List<t_CM_PDRInfo> list = bll.ExecuteStoreQuery<t_CM_PDRInfo>(strsql).ToList();

                //如果存在配电房
                if (list.Count > 0)
                {
                    t_CM_PDRInfo PDRInfo = list.First();
                    object linkToFile = false;
                    object saveWithDocument = true;
                    //模板文件
                    string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/运行监测报告.doc");
                    //生成的具有模板样式的新文件
                    string filePath = "~/DownLoad/run";
                    string fileName = HttpContext.Current.Server.MapPath(filePath);
                    DirectoryUtil.CreateDirectory(fileName);
                    fileName = fileName + "\\run" + PID + ".doc";
                    DirectoryUtil.DeleteFile(fileName);//删除文件
                    //生成word程序对象
                    Word.Application app = new Word.Application();

                    //模板文件
                    string TemplateFile = templateFile;
                    //生成的具有模板样式的新文件
                    string FileName = fileName;

                    //模板文件拷贝到新文件
                    File.Copy(TemplateFile, FileName);
                    //生成documnet对象
                    Word.Document doc = new Word.Document();
                    object Obj_FileName = FileName;
                    object Visible = false;
                    object ReadOnly = false;
                    object missing = System.Reflection.Missing.Value;

                    //打开文件
                    doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                        ref missing, ref missing, ref missing, ref missing,
                        ref missing, ref missing, ref missing, ref Visible,
                        ref missing, ref missing, ref missing,
                        ref missing);
                    doc.Activate();


                    object WordMarkName = "监测周期";//word模板中的书签名称
                    object what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(ReportStartDate + "~" + ReportEndDate);//插入的内容，插入位置是word模板中书签定位的位置  

                    WordMarkName = "报告生成日期";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(DateTime.Now.ToString("yyyy-MM-dd"));//插入的内容，插入位置是word模板中书签定位的位置           

                    WordMarkName = "配电房名称";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.Name);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "配电房位置";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.Position);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "电压等级";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.Vlevel);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "变压器台数";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.Transformers.ToString());//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "总容量";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.CapTotal.ToString());//插入的内容，插入位置是word模板中书签定位的位置     

                    WordMarkName = "维护单位";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.CompanyName);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系人";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.LinkMan);//插入的内容，插入位置是word模板中书签定位的位置

                    WordMarkName = "联系电话";//word模板中的书签名称
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                    doc.ActiveWindow.Selection.TypeText(PDRInfo.Mobile);//插入的内容，插入位置是word模板中书签定位的位置     

                    //现场巡视
                    string sqlorder = "select * from t_PM_Order where pid=" + PID + " and CreateDate>='" + ReportStartDate + "' and CreateDate<='" + ReportEndDate + "' order by OrderID desc";
                    List<t_PM_Order> listorder = bll.ExecuteStoreQuery<t_PM_Order>(sqlorder).ToList();
                    int Count = listorder.Count;
                    listorder = listorder.Where(p => p.IsQualified == 0).ToList();
                    int BuHeGeCount = listorder.Count;
                    if (listorder.Count > 0)
                    {
                        WordMarkName = "现场巡视次数";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(Count.ToString());//插入的内容，插入位置是word模板中书签定位的位置

                        WordMarkName = "不合格次数";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(BuHeGeCount.ToString());//插入的内容，插入位置是word模板中书签定位的位置     

                        Bookmarks odf = doc.Bookmarks;

                        object obAttachMent = "现场巡视";
                        //创建Word表格，并指定标签
                        Microsoft.Office.Interop.Word.Table dtWord = doc.Tables.Add(odf.get_Item(ref obAttachMent).Range, listorder.Count + 1, 9);

                        dtWord.Borders.InsideLineStyle = WdLineStyle.wdLineStyleDot;
                        dtWord.Borders.OutsideLineStyle = WdLineStyle.wdLineStyleDot;

                        dtWord.Rows[1].Cells[1].Range.Text = "发布日期";
                        dtWord.Rows[1].Cells[2].Range.Text = "工单名称";
                        dtWord.Rows[1].Cells[3].Range.Text = "检查人";
                        dtWord.Rows[1].Cells[4].Range.Text = "完成日期";
                        dtWord.Rows[1].Cells[5].Range.Text = "优先级";
                        dtWord.Rows[1].Cells[6].Range.Text = "状态";
                        dtWord.Rows[1].Cells[7].Range.Text = "是否合格";
                        dtWord.Rows[1].Cells[8].Range.Text = "检查情况";
                        dtWord.Rows[1].Cells[9].Range.Text = "整改措施";

                        //循环往表格里赋值
                        for (int i = 2; i <= listorder.Count + 1; i++)
                        {
                            dtWord.Rows[i].Cells[1].Range.Text = listorder[i - 2].CreateDate.ToString();
                            dtWord.Rows[i].Cells[2].Range.Text = listorder[i - 2].OrderName;
                            dtWord.Rows[i].Cells[3].Range.Text = listorder[i - 2].UserName;
                            dtWord.Rows[i].Cells[4].Range.Text = listorder[i - 2].CheckDate.ToString();
                            if (listorder[i - 2].Priority == 1)
                                dtWord.Rows[i].Cells[5].Range.Text = "一般";
                            else if (listorder[i - 2].Priority == 2)
                                dtWord.Rows[i].Cells[5].Range.Text = "高";
                            else if (listorder[i - 2].Priority == 3)
                                dtWord.Rows[i].Cells[5].Range.Text = "很高";
                            if (listorder[i - 2].OrderState == 0)
                                dtWord.Rows[i].Cells[6].Range.Text = "待接收";
                            else if (listorder[i - 2].OrderState == 1)
                                dtWord.Rows[i].Cells[6].Range.Text = "已受理";
                            else if (listorder[i - 2].OrderState == 2)
                                dtWord.Rows[i].Cells[6].Range.Text = "已完成";
                            dtWord.Rows[i].Cells[7].Range.Text = listorder[i - 2].IsQualified == 0 ? "不合格" : "合格";
                            dtWord.Rows[i].Cells[8].Range.Text = listorder[i - 2].CheckInfo;
                            dtWord.Rows[i].Cells[9].Range.Text = listorder[i - 2].Rectification;
                        }
                    }

                    //报警情况
                    string sql = "select top 10 * from t_AlarmTable_en where pid=" + PID + " and AlarmDateTime>='" + ReportStartDate + "' and AlarmDateTime<='" + ReportEndDate + "' order by AlarmID desc";
                    List<t_AlarmTable_en> listalarm = bll.ExecuteStoreQuery<t_AlarmTable_en>(sql).ToList();
                    if (listalarm.Count > 0)
                    {
                        Bookmarks odf = doc.Bookmarks;

                        object obAttachMent = "报警情况";
                        //创建Word表格，并指定标签
                        Microsoft.Office.Interop.Word.Table dtWord = doc.Tables.Add(odf.get_Item(ref obAttachMent).Range, listalarm.Count + 1, 9);

                        dtWord.Borders.InsideLineStyle = WdLineStyle.wdLineStyleDot;
                        dtWord.Borders.OutsideLineStyle = WdLineStyle.wdLineStyleDot;

                        //列宽度                      
                        dtWord.Columns[4].Width = 30f;
                        dtWord.Columns[5].Width = 80f;
                        dtWord.Columns[7].Width = 40f;
                        dtWord.Columns[8].Width = 40f;

                        dtWord.Rows[1].Cells[1].Range.Text = "报警级别";
                        dtWord.Rows[1].Cells[2].Range.Text = "报警时间";
                        dtWord.Rows[1].Cells[3].Range.Text = "报警类型";
                        dtWord.Rows[1].Cells[4].Range.Text = "数值";
                        dtWord.Rows[1].Cells[5].Range.Text = "监测位置";
                        dtWord.Rows[1].Cells[6].Range.Text = "设备";
                        dtWord.Rows[1].Cells[7].Range.Text = "确认";
                        dtWord.Rows[1].Cells[8].Range.Text = "确认人";
                        dtWord.Rows[1].Cells[9].Range.Text = "确认时间";

                        //循环往表格里赋值
                        for (int i = 2; i <= listalarm.Count + 1; i++)
                        {
                            dtWord.Rows[i].Cells[1].Range.Text = listalarm[i - 2].ALarmType;
                            dtWord.Rows[i].Cells[2].Range.Text = listalarm[i - 2].AlarmDateTime.ToString();
                            dtWord.Rows[i].Cells[3].Range.Text = listalarm[i - 2].AlarmCate;
                            dtWord.Rows[i].Cells[4].Range.Text = listalarm[i - 2].AlarmValue.ToString();
                            dtWord.Rows[i].Cells[5].Range.Text = listalarm[i - 2].AlarmAddress;
                            dtWord.Rows[i].Cells[6].Range.Text = listalarm[i - 2].AlarmArea;
                            dtWord.Rows[i].Cells[7].Range.Text = listalarm[i - 2].AlarmConfirm;
                            dtWord.Rows[i].Cells[8].Range.Text = listalarm[i - 2].UserName;
                            dtWord.Rows[i].Cells[9].Range.Text = listalarm[i - 2].ConfirmDate.ToString();
                        }
                    }

                    if (Img2 != "")
                    {
                        string imgName = HttpContext.Current.Server.MapPath("~/UploadFiles/temp/" + loginbll.CurrentUser.UserID + "_" + PID + "_" + 2 + ".png");
                        WordMarkName = "用电情况";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }
                    if (Img3 != "")
                    {
                        string imgName = HttpContext.Current.Server.MapPath("~/UploadFiles/temp/" + loginbll.CurrentUser.UserID + "_" + PID + "_" + 3 + ".png");
                        WordMarkName = "温升情况";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }
                    if (Img4 != "")
                    {
                        string imgName = HttpContext.Current.Server.MapPath("~/UploadFiles/temp/" + loginbll.CurrentUser.UserID + "_" + PID + "_" + 4 + ".png");
                        WordMarkName = "电压合格率";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }
                    if (Img5 != "")
                    {
                        string imgName = HttpContext.Current.Server.MapPath("~/UploadFiles/temp/" + loginbll.CurrentUser.UserID + "_" + PID + "_" + 5 + ".png");
                        WordMarkName = "电流合格率";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }
                    if (Img6 != "")
                    {
                        string imgName = HttpContext.Current.Server.MapPath("~/UploadFiles/temp/" + loginbll.CurrentUser.UserID + "_" + PID + "_" + 6 + ".png");
                        WordMarkName = "功率因数";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        object range = app.Selection.Range;
                        Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                    }

                    string dids = "";
                    if (PID > 0)
                        dids = GetDeviceDID(PID);
                    string query = "select * from t_EE_PowerQualityDaily where did in (" + dids + ") and RecordTime >='" + ReportStartDate + "' and RecordTime <='" + ReportEndDate + "' order by recordtime";
                    List<t_EE_PowerQualityDaily> listquality = bll.ExecuteStoreQuery<t_EE_PowerQualityDaily>(query).ToList();
                    if (listquality.Count > 0)
                    {
                        List<t_EE_PowerQualityDaily> ListTemperature = listquality.FindAll(P => P.MaxTemperature == listquality.Max(p => p.MaxTemperature));
                        List<t_EE_PowerQualityDaily> ListPowerMax = listquality.FindAll(P => P.Power == listquality.Max(p => p.Power));
                        List<t_EE_PowerQualityDaily> ListPowerMin = listquality.FindAll(P => P.Power == listquality.Min(p => p.Power));
                        List<t_EE_PowerQualityDaily> ListFactorMax = listquality.FindAll(P => P.AFactor == listquality.Max(p => p.AFactor));
                        List<t_EE_PowerQualityDaily> ListFactorrMin = listquality.FindAll(P => P.AFactor == listquality.Min(p => p.AFactor));

                        WordMarkName = "用电";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(" 用电总量：" + listquality.Sum(p => p.UsePower) + "kWh    电量损耗：" + listquality.Sum(p => p.EnergyLoss) + "kWh \n 最大负荷：" + listquality.Max(p => p.Power) + " kW    发生时间 " + TransDateType(ListPowerMax[0].RecordTime) + " \n 最小负荷：" + listquality.Min(p => p.Power) + "kW    发生时间 " + TransDateType(ListPowerMin[0].RecordTime) + " \n 平均负荷：" + Math.Round((decimal)listquality.Sum(p => p.Power) / listquality.Count, 2) + " kW");//插入的内容，插入位置是word模板中书签定位的位置     

                        WordMarkName = "温升";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(" 最高温度：" + listquality.Max(p => p.MaxTemperature) + "°C \n 发生时间：" + TransDateType(ListTemperature[0].RecordTime) + "");//插入的内容，插入位置是word模板中书签定位的位置     

                        WordMarkName = "电压";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(" 电压合格率：" + Math.Round((decimal)listquality.Count(p => p.AVoltage > 30) / listquality.Count * 100, 2) + "% \n 三相不平衡度超限时长：" + listquality.Count(p => p.UnBalanceUa > 30) + "小时 \n 电压越限时长：" + listquality.Count(p => p.AVoltage > 30) + "小时");//插入的内容，插入位置是word模板中书签定位的位置     

                        WordMarkName = "电流";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(" 电流合格率：" + Math.Round((decimal)listquality.Count(p => p.ACurrent > 30) / listquality.Count * 100, 2) + "% \n 三相不平衡度超限时长：" + listquality.Count(p => p.UnBalanceIa > 30) + "小时 \n 电流越限时长：" + listquality.Count(p => p.ACurrent > 30) + "小时");//插入的内容，插入位置是word模板中书签定位的位置     

                        WordMarkName = "功率";//word模板中的书签名称
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                        doc.ActiveWindow.Selection.TypeText(" 平均功率因数：" + Math.Round((decimal)listquality.Sum(p => p.AFactor) / listquality.Count, 6) + " \n 最大功率因数：" + listquality.Max(p => p.AFactor) + "发生时间 " + TransDateType(ListFactorMax[0].RecordTime) + " \n 最小功率因数：" + listquality.Min(p => p.AFactor) + "发生时间 " + TransDateType(ListFactorMax[0].RecordTime) + " \n 功率因数超限时长：" + listquality.Count(p => (double)p.AFactor > 0.9) + "小时");//插入的内容，插入位置是word模板中书签定位的位置     
                    }

                    //输出完毕后关闭doc对象
                    object IsSave = true;
                    doc.Close(ref IsSave, ref missing, ref missing);



                    //保存到分析报告                 
                    strsql = "select  * from t_PM_ReportInfo where  RType='运行监测' and PID=" + PID + " and RName='run" + PID + ".doc'";
                    List<t_PM_ReportInfo> listreport = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();
                    if (listreport.Count() == 0)
                    {
                        t_PM_ReportInfo obj = new t_PM_ReportInfo();
                        obj.RName = "run" + PID + ".doc";
                        obj.RPath = filePath + "/run" + PID + ".doc";
                        obj.RSize = (FileSize(FileName) / 1024).ToString() + "KB";
                        obj.FType = "doc";
                        obj.RType = "运行监测";
                        obj.PID = PID;
                        obj.CreatDate = DateTime.Now;
                        obj.Creater = loginbll.CurrentUser.UserName;
                        bll.t_PM_ReportInfo.AddObject(obj);
                        bll.SaveChanges();
                    }
                    else
                    {
                        strsql = "update t_PM_ReportInfo set  RSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CreatDate=getdate() where RType='运行监测' and PID=" + PID + " and RName='run" + PID + ".doc'";
                        bll.ExecuteStoreCommand(strsql, null);
                    }
                }
            }
            catch (Exception Ex)
            {
                return;
            }
        }

        /// <summary>
        /// 调用维护检修报告模板生成word
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static void ExportWordFromBO(int PID, string StartDate, string EndDate)
        {
            try
            {
                LoginAttribute loginbll = new LoginAttribute();
                pdermsWebEntities bll = new pdermsWebEntities();
                object linkToFile = false;
                object saveWithDocument = true;
                //模板文件
                string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/维护检修报告.docx");
                //生成的具有模板样式的新文件
                string filePath = "~/DownLoad/repair ";
                string fileName = HttpContext.Current.Server.MapPath(filePath);
                DirectoryUtil.CreateDirectory(fileName);
                fileName = fileName + "\\repair" + PID + ".doc";
                DirectoryUtil.DeleteFile(fileName);//删除文件
                //生成word程序对象
                Word.Application app = new Word.Application();

                //模板文件
                string TemplateFile = templateFile;
                //生成的具有模板样式的新文件
                string FileName = fileName;

                //模板文件拷贝到新文件
                File.Copy(TemplateFile, FileName);
                //生成documnet对象
                Word.Document doc = new Word.Document();
                object Obj_FileName = FileName;
                object Visible = false;
                object ReadOnly = false;
                object missing = System.Reflection.Missing.Value;

                //打开文件
                doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                    ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref Visible,
                    ref missing, ref missing, ref missing,
                    ref missing);
                doc.Activate();

                object WordMarkName = "监测周期";
                object what = Word.WdGoToItem.wdGoToBookmark;
                doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                doc.ActiveWindow.Selection.TypeText(StartDate + "--" + EndDate);

                WordMarkName = "打印时间";
                what = Word.WdGoToItem.wdGoToBookmark;
                doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                doc.ActiveWindow.Selection.TypeText(DateTime.Now.ToLongDateString());

                string Pstrsql = "select * from t_CM_PDRInfo where PID=" + PID;
                List<t_CM_PDRInfo> Plist = bll.ExecuteStoreQuery<t_CM_PDRInfo>(Pstrsql).ToList();
                if (Plist.Count > 0)
                {
                    t_CM_PDRInfo P = Plist.First();
                    WordMarkName = "配电房名称";
                    what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                    doc.ActiveWindow.Selection.TypeText(P.Name);

                    WordMarkName = "配电房位置";
                    what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                    doc.ActiveWindow.Selection.TypeText(P.Position);

                    WordMarkName = "电压等级";
                    what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                    doc.ActiveWindow.Selection.TypeText(P.Vlevel);

                    double Total = 0;
                    List<t_DM_DeviceInfo> Dlist = bll.t_DM_DeviceInfo.Where(k => k.PID == P.PID & k.DTID == 3).ToList();
                    foreach (t_DM_DeviceInfo D in Dlist)
                    {
                        Total += Convert.ToDouble(D.Z);
                    }

                    WordMarkName = "变压器台数";
                    what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                    doc.ActiveWindow.Selection.TypeText(Dlist.Count.ToString());

                    WordMarkName = "总容量";
                    what = Word.WdGoToItem.wdGoToBookmark;
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                    doc.ActiveWindow.Selection.TypeText(Total.ToString());

                }
                string Bstrsql = "select * from t_CM_BugInfo where PID=" + PID;
                List<t_CM_BugInfo> Blist = bll.ExecuteStoreQuery<t_CM_BugInfo>(Bstrsql).ToList();
                //如果存在隐患
                if (Blist.Count > 0)
                {
                    string Bcontent = "";
                    WordMarkName = "隐患管理内容";
                    foreach (t_CM_BugInfo B in Blist)
                    {

                        Bcontent = "处理情况:" + B.HandeSituation;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();

                        //判断是否存在图片
                        string fstrsql = "select [ID],[FileName],[FilePath],[FileType],[FileSize],[FileExtension],[Modules],[Fk_ID],[FSource],[MaxTemp],[MinTemp],[Remark],[CommitUser],[CommitTime] from (select row_number()over(partition by modules order by modules) as num,* from t_CM_files where Modules in ('bug') and Fk_ID=" + B.BugID + " and FileType in ('image'))a where num<=3";
                        List<t_cm_files> listimage = bll.ExecuteStoreQuery<t_cm_files>(fstrsql).ToList();
                        foreach (t_cm_files f in listimage)
                        {
                            if (f.FileType.Equals("image"))
                            {
                                //图片地址
                                string imgName = HttpContext.Current.Server.MapPath(f.FilePath);
                                doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                                object range = app.Selection.Range;
                                Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                            }
                        }

                        Bcontent = "隐患描述:" + B.BugDesc;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();

                        Bcontent = "隐患名称:" + B.BugLocation + " 隐患等级：" + B.BugLevel + "  报告时间:" + B.ReportDate;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();
                    }

                }

                string Ostrsql = "select * from t_PM_Order where PID=" + PID;
                List<t_PM_Order> Olist = bll.ExecuteStoreQuery<t_PM_Order>(Ostrsql).ToList();
                //如果存在工单
                if (Blist.Count > 0)
                {
                    string Bcontent = "";
                    WordMarkName = "检修情况内容";
                    foreach (t_PM_Order O in Olist)
                    {
                        string Os = "未完成";
                        if (O.OrderState == 0)
                            Os = "待接收";
                        else if (O.OrderState == 1)
                            Os = "已受理";
                        else if (O.OrderState == 2)
                            Os = "已完成";
                        Bcontent = "完成情况:" + Os;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();

                        //判断是否存在图片
                        string fstrsql = "select [ID],[FileName],[FilePath],[FileType],[FileSize],[FileExtension],[Modules],[Fk_ID],[FSource],[MaxTemp],[MinTemp],[Remark],[CommitUser],[CommitTime] from (select row_number()over(partition by modules order by modules) as num,* from t_CM_files where Modules in ('order') and Fk_ID=" + O.OrderID + " and FileType in ('image'))a where num<=3";
                        List<t_cm_files> listimage = bll.ExecuteStoreQuery<t_cm_files>(fstrsql).ToList();
                        foreach (t_cm_files f in listimage)
                        {
                            if (f.FileType.Equals("image"))
                            {
                                //图片地址
                                string imgName = HttpContext.Current.Server.MapPath(f.FilePath);
                                doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置
                                object range = app.Selection.Range;
                                Word.InlineShape shape = app.ActiveDocument.InlineShapes.AddPicture(imgName, ref linkToFile, ref saveWithDocument, ref range);
                            }
                        }

                        Bcontent = "检修内容:" + O.OrderContent;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();

                        Bcontent = "检修名称:" + O.OrderName + " " + "  检修时间:" + O.PlanDate;
                        what = Word.WdGoToItem.wdGoToBookmark;
                        doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);
                        doc.ActiveWindow.Selection.TypeText(Bcontent);
                        doc.ActiveWindow.Selection.TypeParagraph();
                    }

                }
                //输出完毕后关闭doc对象
                object IsSave = true;
                doc.Close(ref IsSave, ref missing, ref missing);


                //保存到分析报告                 
                string strsql = "select  * from t_PM_ReportInfo where  RType='维护检修' and PID=" + PID + " and RName='repair" + PID + ".doc'";
                List<t_PM_ReportInfo> listreport = bll.ExecuteStoreQuery<t_PM_ReportInfo>(strsql).ToList();
                if (listreport.Count() == 0)
                {
                    t_PM_ReportInfo obj = new t_PM_ReportInfo();
                    obj.RName = "repair" + PID + ".doc";
                    obj.RPath = filePath + "/repair" + PID + ".doc";
                    obj.RSize = (FileSize(FileName) / 1024).ToString() + "KB";
                    obj.FType = "doc";
                    obj.RType = "维护检修";
                    obj.PID = PID;
                    obj.CreatDate = DateTime.Now;
                    obj.Creater = loginbll.CurrentUser.UserName;
                    bll.t_PM_ReportInfo.AddObject(obj);
                    bll.SaveChanges();
                }
                else
                {
                    strsql = "update t_PM_ReportInfo set  RSize='" + (FileSize(FileName) / 1024).ToString() + "KB',CreatDate=getdate() where RType='维护检修' and PID=" + PID + " and RName='repair" + PID + ".doc'";
                    bll.ExecuteStoreCommand(strsql, null);
                }
            }
            catch (Exception Ex)
            {
                return;
            }
        }


        //利用递归的思想,只不过是通过File类的Exits方法来判断,所给路径中所对应的是否为文件
        public static long FileSize(string filePath)
        {
            long temp = 0;
            //判断当前路径所指向的是否为文件
            if (File.Exists(filePath) == false)
            {
                string[] str1 = Directory.GetFileSystemEntries(filePath);
                foreach (string s1 in str1)
                {
                    temp += FileSize(s1);
                }
            }
            else
            {
                //定义一个FileInfo对象,使之与filePath所指向的文件向关联,
                //以获取其大小
                FileInfo fileInfo = new FileInfo(filePath);
                return fileInfo.Length;
            }
            return temp;
        }
        //获取站室的变压器 
        public static string GetDeviceDID(int pid)
        {
            pdermsWebEntities bll = new pdermsWebEntities();
            string DIDS = "0";
            string sql = "select d.* from t_DM_DeviceInfo d join t_CM_DeviceType dt on d.DTID=dt.DTID where pid=" + pid + " and d.DTID=3";
            List<t_DM_DeviceInfo> list = bll.ExecuteStoreQuery<t_DM_DeviceInfo>(sql).ToList();
            if (list.Count > 0)
            {
                DIDS = "";
                foreach (t_DM_DeviceInfo item in list)
                {
                    if (!string.IsNullOrEmpty(item.B))
                        DIDS += Convert.ToInt32(item.B) + ",";
                }
                DIDS = DIDS.TrimEnd(',');
            }
            return DIDS;
        }
        /// <summary>
        ///实时数据实体
        /// </summary>
        public class t_SM_RealTimeData
        {
            public DateTime RecTime { set; get; }
            public int TagID { set; get; }
            public int PID { set; get; }
            public double PV { set; get; }
            public string AlarmStatus { set; get; }
            public double AlarmLimits { set; get; }
            public int DataTypeID { set; get; }
            public int DID { set; get; }
        }
        /// <summary>
        /// 历史数据实体
        /// </summary>
        public class t_SM_HisData
        {
            public string RecTime { set; get; }
            public double PV { set; get; }
            public string AlarmStatus { set; get; }
            public double AlarmLimits { set; get; }
        }


        /// <summary>
        /// 调用模板生成word(合同模板）type 1 物资采购合同 2建设工程承包合同
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static string ExportWordConTemp(string ConNo,int type,out string SaveConName)
        {
            try
            {
                object linkToFile = false;
                object saveWithDocument = true;
                //模板文件
                string path = GetConTempPath(type);
                string templateFile = HttpContext.Current.Server.MapPath(path);
                //生成的具有模板样式的新文件
                string ConName = GetConName(type);
                string fileName = HttpContext.Current.Server.MapPath("~/DownLoad/ConDoc/") + ConName + ConNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                SaveConName = ConName + ConNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                string Cname = "~/DownLoad/ConDoc/" + ConName + ConNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                //生成word程序对象
                Word.Application app = new Word.Application();

                //模板文件
                string TemplateFile = templateFile;
                //生成的具有模板样式的新文件
                string FileName = fileName;

                //模板文件拷贝到新文件
                File.Copy(TemplateFile, FileName);
                //生成documnet对象
                Word.Document doc = new Word.Document();
                object Obj_FileName = FileName;
                object Visible = false;
                object ReadOnly = false;
                object missing = System.Reflection.Missing.Value;

                //打开文件
                doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                    ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref Visible,
                    ref missing, ref missing, ref missing,
                    ref missing);
                doc.Activate();



                object WordMarkName = "合同编号";//word模板中的书签名称
                object what = Word.WdGoToItem.wdGoToBookmark;
                if (type == 1)
                {
                    doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置

                    doc.ActiveWindow.Selection.TypeText(ConNo);//插入的内容，插入位置是word模板中书签定位的位置
                }
                doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式
                                                                                                                        //doc.ActiveWindow.Selection.TypeParagraph();//回车换行


                //输出完毕后关闭doc对象
                object IsSave = true;
                doc.Close(ref IsSave, ref missing, ref missing);
                return Cname;
            }
            catch (Exception Ex)
            {
                SaveConName = "";
                return "";
            }
        }
        private static string GetConName(int type)
        {
            string result = string.Empty;
            switch (type)
            {
                case 1:
                    result = "物资采购合同";
                    break;
                case 2:
                    result = "建设工程承包合同";
                    break;
                default:
                    result = "物资采购合同";
                    break;
             
            }
            return result+"_";
        }
        private static string GetConTempPath(int type)
        {
            string result = string.Empty;
            switch (type)
            {
                case 1:
                    result = "~/Content/doc/物资采购合同.doc";
                    break;
                case 2:
                    result = "~/Content/doc/建设工程承包合同.doc";
                    break;
                default:
                    result = "~/Content/doc/物资采购合同.doc";
                    break;

            }
            return result;
        }


        /// <summary>
        /// 调用模板生成word(合同模板）type 1 物资采购合同 2建设工程承包合同
        /// </summary>
        /// <param name="templateFile">模板文件</param>
        /// <param name="fileName">生成的具有模板样式的新文件</param>
        public static string ExportWordHanJianTemp(string TempNo,out string SaveConName)
        {
            try
            {
                object linkToFile = false;
                object saveWithDocument = true;
                //模板文件
                //string path = GetConTempPath(type);
                string templateFile = HttpContext.Current.Server.MapPath("~/Content/doc/函件模板.doc");
                //生成的具有模板样式的新文件
                //string ConName = GetConName(type);
                string fileName = HttpContext.Current.Server.MapPath("~/DownLoad/ConTempDoc/") + "函件" + TempNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                SaveConName = "函件" + TempNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                string Cname = "~/DownLoad/ConTempDoc/" + "函件" + TempNo + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc";
                //生成word程序对象
                Word.Application app = new Word.Application();

                //模板文件
                string TemplateFile = templateFile;
                //生成的具有模板样式的新文件
                string FileName = fileName;

                //模板文件拷贝到新文件
                File.Copy(TemplateFile, FileName);
                //生成documnet对象
                Word.Document doc = new Word.Document();
                object Obj_FileName = FileName;
                object Visible = false;
                object ReadOnly = false;
                object missing = System.Reflection.Missing.Value;

                //打开文件
                doc = app.Documents.Open(ref Obj_FileName, ref missing, ref ReadOnly, ref missing,
                    ref missing, ref missing, ref missing, ref missing,
                    ref missing, ref missing, ref missing, ref Visible,
                    ref missing, ref missing, ref missing,
                    ref missing);
                doc.Activate();



                object WordMarkName = "函件编号";//word模板中的书签名称
                object what = Word.WdGoToItem.wdGoToBookmark;
               
                doc.ActiveWindow.Selection.GoTo(ref what, ref missing, ref missing, ref WordMarkName);//光标转到书签的位置

                doc.ActiveWindow.Selection.TypeText(TempNo);//插入的内容，插入位置是word模板中书签定位的位置
                
                doc.ActiveWindow.Selection.ParagraphFormat.Alignment = Word.WdParagraphAlignment.wdAlignParagraphCenter;//设置当前定位书签位置插入内容的格式
                                                                                                                        //doc.ActiveWindow.Selection.TypeParagraph();//回车换行


                //输出完毕后关闭doc对象
                object IsSave = true;
                doc.Close(ref IsSave, ref missing, ref missing);
                return Cname;
            }
            catch (Exception Ex)
            {
                SaveConName = "";
                return "";
            }
        }
    }
}