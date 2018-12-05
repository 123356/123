using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO.Models
{
    public class t_CM_UserInfo
    {
        #region 简单属性

       
        public global::System.Int32 UserID
        {
            get
            {
                return _UserID;
            }
            set
            {
                if (_UserID != value)
                {
                    _UserID = value;
                }
            }
        }
        private global::System.Int32 _UserID;
       
        public global::System.Int32 RoleID
        {
            get
            {
                return _RoleID;
            }
            set
            {
                _RoleID = value;
            }
        }
        private global::System.Int32 _RoleID;
       
        public global::System.String UserName
        {
            get
            {
                return _UserName;
            }
            set
            {
                _UserName = value;
            }
        }
        private global::System.String _UserName;
       
        public global::System.String UserPassWord
        {
            get
            {
                return _UserPassWord;
            }
            set
            {
                _UserPassWord = value;
            }
        }
        private global::System.String _UserPassWord;
     
        public global::System.String Company
        {
            get
            {
                return _Company;
            }
            set
            {
                _Company = value;
            }
        }
        private global::System.String _Company;
       
        public global::System.String Post
        {
            get
            {
                return _Post;
            }
            set
            {
                _Post = value;
            }
        }
        private global::System.String _Post;
     
        public global::System.String Telephone
        {
            get
            {
                return _Telephone;
            }
            set
            {
                _Telephone = value;
            }
        }
        private global::System.String _Telephone;
      
        public global::System.String Mobilephone
        {
            get
            {
                return _Mobilephone;
            }
            set
            {
                _Mobilephone = value;
            }
        }
        private global::System.String _Mobilephone;
      
        public Nullable<global::System.Int32> OpenAlarmMsg
        {
            get
            {
                return _OpenAlarmMsg;
            }
            set
            {
                _OpenAlarmMsg = value;
            }
        }
        private Nullable<global::System.Int32> _OpenAlarmMsg;
       
        public Nullable<global::System.Int32> IsScreen
        {
            get
            {
                return _IsScreen;
            }
            set
            {
                _IsScreen = value;
            }
        }
        private Nullable<global::System.Int32> _IsScreen;
      
        public Nullable<global::System.Int32> OpenAlarmEmail
        {
            get
            {
                return _OpenAlarmEmail;
            }
            set
            {
                _OpenAlarmEmail = value;
            }
        }
        private Nullable<global::System.Int32> _OpenAlarmEmail;
       
        public global::System.String Email
        {
            get
            {
                return _Email;
            }
            set
            {
                _Email = value;
            }
        }
        private global::System.String _Email;
       
        public global::System.String LogUrl
        {
            get
            {
                return _LogUrl;
            }
            set
            {
                _LogUrl = value;
            }
        }
        private global::System.String _LogUrl;
      
        public global::System.String GroupName
        {
            get
            {
                return _GroupName;
            }
            set
            {
                _GroupName = value;
            }
        }
        private global::System.String _GroupName;
      
        public global::System.String openid
        {
            get
            {
                return _openid;
            }
            set
            {
                _openid = value;
            }
        }
        private global::System.String _openid;
      
        public global::System.String openid2
        {
            get
            {
                return _openid2;
            }
            set
            {
                _openid2 = value;
            }
        }
        private global::System.String _openid2;
       
        public global::System.String openid_bg
        {
            get
            {
                return _openid_bg;
            }
            set
            {
                _openid_bg = value;
            }
        }
        private global::System.String _openid_bg;
       
        public global::System.String openid_bg2
        {
            get
            {
                return _openid_bg2;
            }
            set
            {
                _openid_bg2 = value;
            }
        }
        private global::System.String _openid_bg2;
      
        public global::System.String UNITList
        {
            get
            {
                return _UNITList;
            }
            set
            {
                _UNITList = value;
            }
        }
        private global::System.String _UNITList;
      
        public Nullable<global::System.Int32> UID
        {
            get
            {
                return _UID;
            }
            set
            {
                _UID = value;
            }
        }
        private Nullable<global::System.Int32> _UID;
        
        public Nullable<global::System.Boolean> IsAdmin
        {
            get
            {
                return _IsAdmin;
            }
            set
            {
                _IsAdmin = value;
            }
        }
        private Nullable<global::System.Boolean> _IsAdmin;
    

        #endregion
    }
}
