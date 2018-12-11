using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.InteropServices;
using System.Text;

namespace YWWeb.Import
{
    public class LibLicenseEx
    {
        [DllImport("LibLicenseEx.dll" ,CallingConvention = CallingConvention.Cdecl)]
        public static extern int SDK_CheckLicense(StringBuilder msg, int msgSize);

        [DllImport("LibLicenseEx.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void SDK_GetLicenseFile(StringBuilder file, int nSize);

        [DllImport("LibLicenseEx.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int SetLicensePath(StringBuilder in_path, int Size);
    }
}