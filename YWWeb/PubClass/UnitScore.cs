using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YWWeb.PubClass
{
    public class UnitScore
    {
        /// <summary>
        /// 变压器负载率评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkLoadRateScore(decimal v)
        {
            decimal val = 0;
            if (v < 30)
                val = 1;
            else if (v >= 30 && v < 50)
                val = 3;
            else if (v >= 50 && v < 70)
                val = 5;
            else if (v >= 70 && v < 85)
                val = 3;
            else if (v >= 85 && v <= 100)
                val = 1;
            else
                val = 0;

            return val;
        }
        /// <summary>
        /// 预警报警评分规则
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkAlarmScore(decimal v)
        {
            decimal val = 0;
            if (v == 0)
                val = 5;
            else
                val = 0;

            return val;
        }

        /// <summary>
        /// 功率因数评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkPowerfactor(decimal v)
        {
            decimal val = 0;
            if (v == 1)
                val = 2;
            else if (v >= Convert.ToDecimal(0.91) && v < 1)
                val = 1;
            else if (v <= Convert.ToDecimal(0.9))
                val = 0;
            else
                val = 0;

            return val;
        }
        /// <summary>
        /// 三项不平衡评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkTripartiteimbalance(decimal v)
        {
            decimal val = 0;
            if (v <= 2)
                val = 2;
            else if (v >= 2 && v <= 4)
                val = 1;
            else if (v > 4)
                val = 0;
            else
                val = 0;

            return val;
        }
        /// <summary>
        /// 频率评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkFrequency(decimal v)
        {
            decimal val = 0;
            if (v <= Convert.ToDecimal(0.5) || v <= Convert.ToDecimal(-0.5))
                val = 1;
            else if (v > Convert.ToDecimal(0.5) || v > Convert.ToDecimal(-0.5))
                val = 0;
            else
                val = 0;

            return val;
        }
        /// <summary>
        /// 温度评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkTemperature(decimal v)
        {
            decimal val = 0;
            if (v <= 40)
                val = 3;
            else if (v > 40 && v <= 45)
                val = 2;
            else if (v > 45 && v <= 50)
                val = 1;
            else if (v > 50)
                val = 0;
            else
                val = 0;
            return val;
        }
        /// <summary>
        /// 湿度评分
        /// </summary>
        /// <param name="v"></param>
        /// <returns></returns>
        public static decimal checkHumidity(decimal v)
        {
            decimal val = 0;
            if (v <= 70)
                val = 2;
            else if (v > 70)
                val = 0;
            else
                val = 0;
            return val;
        }
    }
}