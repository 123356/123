﻿using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IEneryOverview : IDAOBase, IDisposable
    {
        IList<t_V_EneryView> GetDatas(string cids, string pids, string month);

        IList<t_V_EneryView> GetMonthDatas(Dictionary<int,string> cpids, string month);
        IList<t_V_EneryView> GetLookDatas(Dictionary<int, string> cpids, string month);
        IList<t_V_EneryView> GetMonthDatasByTime(string cids, string pids, int type, string startTime, string endTime);

        IList<t_V_EneryView> GetYearDatasByTime(string cids, string pids, int type, string startTime, string endTime);

        IList<t_V_EneryView> GetDayDatasByTime(string cids, string pids, int type, string startTime, string endTime);

        IList<t_V_EneryView> GetDayDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime);

        IList<t_V_EneryView> GetMonthDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime);

        IList<t_V_EneryView> GetYearDatasByTime(Dictionary<int, string> cpids, int type, string startTime, string endTime);
        IList<t_V_EneryView> GetYearBudgetDatas(string cids, string pids, string month);

        IList<t_V_EneryView> GetFirstPageDatas(Dictionary<int,string> cpids, string time);
    }
}
