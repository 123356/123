using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using Newtonsoft.Json;
using System.IO;
using System.Text;
//using System.Data.Objects;
//using System.Data.Objects.SqlClient;
using System.Data.SqlClient;
using YWWeb.PubClass;
using System.Configuration;

namespace YWWeb.Controllers
{
    public class FileUploadController : UserControllerBaseEx
    {
        //
        // GET: /FileUpload/
        pdermsWebEntities bll = new pdermsWebEntities();
        //LoginAttribute loginbll = new LoginAttribute();
        public ActionResult Index()
        {
            return View();
        }
        /// <summary>
        /// 资料上传《对外接口》
        /// </summary>
        /// <param name="files">文件列表</param>
        /// <param name="Modules">所属模块</param>
        /// <param name="fk_id">ID</param>
        /// <param name="FSource">来源</param>
        /// <param name="FileType">资料类型（图片，视频）</param>
        /// <param name="Remark">备注</param>
        /// <param name="CommitUser">上传用户</param>
        /// <returns>0表示未登录，1表示成功，2表示太大 3上传失败，网络超时</returns>
        public ActionResult MultiUpload(IEnumerable<HttpPostedFileBase> files, string Modules, int fk_id, string FSource, string Remark, string CommitUser)
        {
            string reCode = "0";
            try
            {
                double maxsize = 1024;
                //设置文件上传路径
                string pathForSaving = "";// Server.MapPath("~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM"));
                //检查目录是否存在，如果不存在，则新建目录

                string filename, filePath, fileExtension, saveName;//原文件名称，文件路径，文件后缀，文件重命名
                int fileSize;//文件大小
                byte[] FileData;//获取文件信息
                double fileSizeKB;//转换文件大小，单位KB
                string fSize;//文件大小完整，如：54KB
                string FileType = "unknow";//文件类型
                t_cm_files obj;
                string[] pic = { ".jpg", ".jpeg", ".bmp", ".png", ".gif" };
                string[] ved = { ".avi", ".rmvb", ".mp4", ".flv", ".wmv", ".mkv", ".mpeg" };
                string[] voi = { ".wav", ".mp3", ".wma", ".ogg", ".ape", ".acc", ".3gp" };
                // 遍历文件
                foreach (var file in files)
                {
                    if (file != null && file.ContentLength > 0)
                    {
                        filename = file.FileName;
                        fileExtension = Path.GetExtension(filename);//文件扩展名
                        saveName = DateTime.Now.Ticks + fileExtension;//文件重命名                         
                        //根据判断文件类型
                        string LFE = fileExtension.ToLower();
                        if (pic.Contains(LFE))
                        {
                            FileType = "image";
                        }
                        else if (ved.Contains(LFE))
                        {
                            FileType = "infrared";
                        }
                        else if (voi.Contains(LFE))
                        {
                            FileType = "voice";
                        }
                        pathForSaving = Server.MapPath("~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM") + "/" + FileType);
                        //判断文件是否存在
                        if (this.CreateFolderIfNeeded(pathForSaving))
                        {
                            //上传资料
                            var path = Path.Combine(pathForSaving, saveName);
                            file.SaveAs(path);//上传资料到服务器
                            FileData = ReadFileBytes(file);
                            fileSize = FileData.Length;
                            fileSizeKB = fileSize / 1024;
                            fileSizeKB = Math.Round(fileSizeKB, 2);
                            if (ConfigurationManager.AppSettings[Modules + "size"] != null)
                                maxsize = Convert.ToDouble(ConfigurationManager.AppSettings[Modules + "size"]);
                            //判断资料大小
                            //if (fileSizeKB > maxsize)
                            //{
                            //    reCode = "2";
                            //    break;
                            //}
                            //else
                            //{}

                            fSize = fileSizeKB + "KB";
                            //文件大小限制(后期添加)
                            filePath = "~/UploadFiles/" + Modules + DateTime.Now.ToString("yyMM") + "/" + FileType + "/" + saveName;
                            //保存到资料库
                            obj = new t_cm_files();
                            obj.CommitTime = DateTime.Now;
                            obj.CommitUser = CommitUser;
                            obj.FileName = filename;
                            obj.FilePath = filePath;
                            obj.FileExtension = fileExtension;
                            obj.FileSize = fSize;
                            obj.FileType = FileType;
                            obj.Fk_ID = fk_id;
                            obj.FSource = FSource;
                            obj.MaxTemp = 0;
                            obj.MinTemp = 0;
                            obj.Remark = Remark;
                            obj.Modules = Modules;
                            bll.t_cm_files.AddObject(obj);
                            bll.SaveChanges();

                        }
                    }
                }
                reCode = "1";
            }
            catch (Exception ex)
            {
                reCode = "3";
            }
            return Content(reCode);
        }
        /// <summary>
        //删除文件《对外接口》
        /// </summary>
        /// <param name="filename">文件名</param>
        /// <param name="ctype">文件类型（图片，视频，红外）</param>
        public ActionResult AppDeleteFile(string filename, string module, string ctype)
        {
            string strJson = "success";
            try
            {
                string filePath = Server.MapPath("~/UploadFiles/" + module + DateTime.Now.ToString("yyMM") + "/" + ctype);
                //删除数据库表中数据ctype分为image,file,video if (ctype.Equals("file"))
                List<t_cm_files> list = bll.t_cm_files.Where(d => d.FileName.Contains(filename) && d.Modules == module && d.FileType == ctype).ToList();
                if (list.Count > 0)
                {
                    string mappth = System.AppDomain.CurrentDomain.BaseDirectory;
                    string fileName = mappth + list[0].FilePath.Replace("~", "").Replace("/", "\\");
                    DirectoryUtil.DeleteFile(fileName);
                    t_cm_files img = list[0];
                    bll.t_cm_files.DeleteObject(img);
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return Content(strJson);
        }
        // 检查是否要创建上传文件夹
        private bool CreateFolderIfNeeded(string path)
        {
            bool result = true;
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception)
                {
                    //TODO：处理异常
                    result = false;
                }
            }
            return result;
        }
        //[Login]
        public ActionResult Upload(HttpPostedFileBase fileData, string folder, int pid, int channelid, string channelname, string positionName, string maxtemp, string mintemp, int iNewnCCDW, int iNewnIRW, int iNewnIRH)
        {
            if (fileData != null)
            {
                try
                {
                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/" + folder + "/" + DateTime.Now.ToString("yyyyMM") + "/";
                    string filePath = Server.MapPath(url);
                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    string fullurl = url + saveName;
                    string imgpath = "", reportpath = "",filetype="doc";
                    if (fileExtension.Contains("doc"))
                    {
                        reportpath = fullurl;
                        imgpath = "";
                        filetype = "doc";
                    }
                    else
                    {
                        reportpath = "";
                        imgpath = fullurl;
                        filetype = "image";
                    }
                    string strsql = "INSERT INTO t_SM_InfraredPic(PID,ChannelID,ChannelName,PositionName,ImgPath,ImgNameOld,FileSize,MaxTemp,MinTemp,ReportPath,CommitTime,NewnCCDW,NewnIRW,NewnIRH)VALUES(" + pid + "," + channelid + ",'" + channelname + "','" + positionName + "','" + imgpath + "','" + fileName + "','" + fSize + "'," + maxtemp + "," + mintemp + ",'" + reportpath + "',getdate()," + iNewnCCDW + "," + iNewnIRW + "," + iNewnIRH + ");";
                    strsql =strsql+ "INSERT INTO t_cm_files([FileName],FilePath,FileType,FileSize,FileExtension,Modules,Fk_ID,FSource,MaxTemp,MinTemp,Remark,CommitUser,CommitTime)VALUES('" + fileName + "','" + fullurl + "','"+filetype+"','"+fSize+"','"+fileExtension+"','shuangshi',0,'pc',"+maxtemp+","+mintemp+",'双视上传','双视桌面版',getdate());";
                    bll.ExecuteStoreCommand(strsql, null);
                    return Content("success");
                }
                catch (Exception ex)
                {
                    //return Content(ex.ToString());
                    return Content("false"); ;
                }
            }
            else
            {
                return Content("false");
            }
        }
          public ActionResult UploadInfrared2()
        {
            return Content("true");
        }
          public ActionResult UploadInfrared3(HttpPostedFileBase fileData)
          {
              if (null == fileData)
              {
                  return Content("false");
              } 
              else
              {
                  return Content("true");
              }
          }
          public ActionResult UploadInfrared4(HttpPostedFileBase fileData, string folder, int pid, int infraredid)
          {
              if (null == fileData)
              {
                  return Content("false");
              }
              else
              {
                  return Content(pid.ToString());
              }
          }
        //add by jiang 测试小红外
        public ActionResult UploadInfrared(HttpPostedFileBase fileData, string folder, int pid, int infraredid, string maxtemp, string mintemp)
        {
            if (fileData != null)
            {
                try
                {
                    ControllerContext.HttpContext.Request.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.ContentEncoding = Encoding.GetEncoding("UTF-8");
                    ControllerContext.HttpContext.Response.Charset = "UTF-8";

                    // 文件上传后的保存路径
                    string url = "~/UploadFiles/" + folder + "/" + DateTime.Now.ToString("yyyyMM") + "/";
                    string filePath = Server.MapPath(url);
                    DirectoryUtil.CreateDirectory(filePath);

                    string fileName = Path.GetFileName(fileData.FileName);      //原始文件名称
                    string fileExtension = Path.GetExtension(fileName);         //文件扩展名
                    //string saveName = Guid.NewGuid().ToString() + fileExtension; //保存文件名称
                    string saveName = DateTime.Now.Ticks + fileExtension;
                    fileData.SaveAs(filePath + saveName);
                    byte[] FileData = ReadFileBytes(fileData);
                    double fileSize = FileData.Length;
                    double fileSizeKB = fileSize / 1024;
                    fileSizeKB = Math.Round(fileSizeKB, 2);
                    string fSize = fileSizeKB + "KB";
                    string fullurl = url + saveName;
                    string imgpath = "", reportpath = "", filetype = "doc";
                    if (fileExtension.Contains("doc"))
                    {
                        reportpath = fullurl;
                        imgpath = "";
                        filetype = "doc";
                    }
                    else
                    {
                        reportpath = "";
                        imgpath = fullurl;
                        filetype = "image";
                    }
                    //string strsql = "INSERT INTO t_SM_InfraredPic(PID,ChannelID,ChannelName,PositionName,ImgPath,ImgNameOld,FileSize,MaxTemp,MinTemp,ReportPath,CommitTime,NewnCCDW,NewnIRW,NewnIRH)VALUES(" + pid + "," + channelid + ",'" + channelname + "','" + positionName + "','" + imgpath + "','" + fileName + "','" + fSize + "'," + maxtemp + "," + mintemp + ",'" + reportpath + "',getdate()," + iNewnCCDW + "," + iNewnIRW + "," + iNewnIRH + ");";
                    //strsql = strsql + "INSERT INTO t_cm_files([FileName],FilePath,FileType,FileSize,FileExtension,Modules,Fk_ID,FSource,MaxTemp,MinTemp,Remark,CommitUser,CommitTime)VALUES('" + fileName + "','" + fullurl + "','" + filetype + "','" + fSize + "','" + fileExtension + "','shuangshi',0,'pc'," + maxtemp + "," + mintemp + ",'双视上传','双视桌面版',getdate());";
                    //bll.ExecuteStoreCommand(strsql, null);
                    return Content("success");
                }
                catch (Exception ex)
                {
                    //return Content(ex.ToString());
                    return Content("false"); ;
                }
            }
            else
            {
                return Content("false");
            }
        }
        //删除用户临时文件
        public ActionResult DeleteTempFile(int uid)
        {
            int id = 99999 + uid;
            DeleteDFile(id);
            return Content("success");
        }
        public void DeleteDFile(int id)
        {
            try
            {
                string mappth = System.AppDomain.CurrentDomain.BaseDirectory;
                string fileName = "";
                List<t_DM_DevicesFiles> listfile = bll.t_DM_DevicesFiles.Where(d => d.fk_DID == id).ToList();
                if (listfile.Count > 0)
                {
                    listfile.ForEach(d =>
                    {
                        fileName = mappth + d.FilePath.Replace("~", "").Replace("/", "\\");
                        DirectoryUtil.DeleteFile(fileName);
                        bll.DeleteObject(d);
                    });
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                string result = ex.ToString();
            }
        }
        //删除文件《客户端》
        public ActionResult DeleteFile(string filename, string ctype)
        {
            string strJson = "success";
            try
            {
                string filePath = Server.MapPath("~/UploadFiles/");
                DirectoryUtil.DeleteFile(filePath + filename);
                //删除数据库表中数据ctype分为image,file,video if (ctype.Equals("file"))
                List<t_DM_DevicesFiles> list = bll.t_DM_DevicesFiles.Where(d => d.FilePath.Contains(filename) && d.FileType == ctype).ToList();
                if (list.Count > 0)
                {
                    t_DM_DevicesFiles img = list[0];
                    bll.t_DM_DevicesFiles.DeleteObject(img);
                    bll.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                strJson = "error";
            }
            return Content(strJson);
        }
        private byte[] ReadFileBytes(HttpPostedFileBase fileData)
        {
            byte[] data;
            using (Stream inputStream = fileData.InputStream)
            {
                MemoryStream memoryStream = inputStream as MemoryStream;
                if (memoryStream == null)
                {
                    memoryStream = new MemoryStream();
                    inputStream.CopyTo(memoryStream);
                }
                data = memoryStream.ToArray();
            }
            return data;
        }
        //private t_CM_UserInfo CurrentUser
        //{
        //    get { return loginbll.CurrentUser; }
        //}
        public string SaveImage(int did,int index,string IS)
        {
            string ImageSend = Server.UrlDecode(IS);
            string[] url = ImageSend.Split(',');
            string u = url[1].Replace(' ', '+');
            string pathForSaving = Server.MapPath("~/UploadFiles/temp/" + CurrentUser.UserID + "_" + did + "_" + index + ".png");
            byte[] byteImage = Convert.FromBase64String(u);
            //string createFileFullPath = "E:\\12.png";
            System.IO.File.WriteAllBytes(pathForSaving, byteImage); 

            return ImageSend;
        }
    }
}
