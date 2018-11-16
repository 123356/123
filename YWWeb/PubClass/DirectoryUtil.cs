using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.IO;

namespace S5001Web.PubClass
{
    public class DirectoryUtil
    {
        /// <summary>
        /// 重命名目录
        /// </summary>
        /// <param name="old">原目录名（包含路径）</param>
        /// <param name="newname">新目录名（包含路径）</param>
        /// <returns>成功则返回true</returns>
        public static bool ReNameDirectory(string old, string newname)
        {
            try
            {
                Directory.Move(old, newname);
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// 新建目录
        /// </summary>
        /// <param name="path">目录名（包含路径）</param>
        /// <returns>成功则返回true</returns>
        public static bool CreateDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                    return true;
                }
                catch
                {
                    return false;
                }

            }
            return false;
        }
        /// <summary>
        /// 删除目录
        /// </summary>
        /// <param name="path">目录名（包含路径）</param>
        /// <returns>成功则返回true</returns>
        public static bool DeleteDirectory(string path)
        {
            try
            {
                Directory.Delete(path, true);
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// 删除文件
        /// </summary>
        /// <param name="path">文件名（包含路径）</param>
        public static bool DeleteFile(string path)
        {
            try
            {
                if (File.Exists(path))
                    File.Delete(path);
                return true;
            }
            catch
            {
                return false;
            }
        }
        /// <summary>
        /// 复制目录
        /// </summary>
        /// <param name="src">原目录名（包含路径）</param>
        /// <param name="dst">目标目录名（包含路径）</param>
        /// <returns>成功则返回true</returns>
        public static bool CopyDirectory(string src, string dst)
        {
            try
            {
                String[] Files; if (dst[dst.Length - 1] != Path.DirectorySeparatorChar)
                    dst += Path.DirectorySeparatorChar; if (!Directory.Exists(dst))
                    Directory.CreateDirectory(dst); Files = Directory.GetFileSystemEntries(src);
                foreach (string Element in Files)
                {
                    if (Directory.Exists(Element))
                        CopyDirectory(Element, dst + Path.GetFileName(Element));
                    else
                        File.Copy(Element, dst + Path.GetFileName(Element), true);
                } return true;
            }
            catch
            {
                return false;
            }
        }

        public static string jsonData()
        {
            string url = System.AppDomain.CurrentDomain.BaseDirectory;
            string path = url + "App\\app.json";
            var getWeatherInfoUrl = path;
            var client = new WebClient();
            //client.Encoding = System.Text.Encoding.UTF8;
            var result = client.DownloadString(getWeatherInfoUrl);
            var json = Newtonsoft.Json.JsonConvert.DeserializeObject(result);
            //string jsonData = File.ReadAllText(path, Encoding.UTF8);
            return json.ToString();
        }
    }
}