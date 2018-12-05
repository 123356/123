using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YWWeb.PubClass
{
    public class TimeUtils
    {
        private static DateTime getFirst(DateTime temp)
        {
            return DateTime.Parse(temp.ToString("yyyy-MM-dd 00:00:00"));
        }
        private static DateTime getLast(DateTime temp)
        {
            return DateTime.Parse(temp.ToString("yyyy-MM-dd 23:59:59"));
        }

        internal static DateTime getThisYearFirstDay(DateTime datetime)
        {
            DateTime temp = datetime.AddMonths(1 - datetime.Month).AddDays(1 - datetime.Day);
            return getFirst(temp);
        }

        internal static DateTime getLastMonthFirstDay(DateTime datetime)
        {
            DateTime temp = datetime.AddDays(1 - datetime.Day).AddMonths(-1);
            return getFirst(temp);  
        }

        internal static DateTime getThisMonthFirstDay(DateTime datetime)
        {
            DateTime temp = datetime.AddDays(1 - datetime.Day);
            return getFirst(temp);
        }

        internal static DateTime getLastMonthLastDay(DateTime datetime)
        {
            DateTime temp = datetime.AddDays(1 - datetime.Day).AddDays(-1);
            return getLast(temp);  
        }

        internal static DateTime getLastDayLastMin(DateTime datetime)
        {
            DateTime temp = datetime.AddHours(1 - datetime.Hour-24).AddHours(-1);
            return getLast(temp);
        }
        internal static DateTime getLastDayFirstMin(DateTime datetime)
        {
            DateTime temp = datetime.AddHours(1 - datetime.Hour - 24).AddHours(-1);
            return getFirst(temp);
        }

      

        internal static DateTime getLastWeekFirstDay(DateTime datetime)
        {
            DateTime temp = datetime.AddDays(Convert.ToDouble((0 - Convert.ToInt16(datetime.DayOfWeek))) - 6);
            return getFirst(temp);
        }

        internal static DateTime getLastWeekLastDay(DateTime datetime)
        {
            return getLast(datetime.AddDays(Convert.ToDouble((6 - Convert.ToInt16(datetime.DayOfWeek))) - 6));
        }
    }
}