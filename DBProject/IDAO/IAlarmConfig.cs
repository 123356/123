using IDAO.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDAO
{
    public interface IAlarmConfig : IDAOBase, IDisposable
    {
        //添加报警
        IList<t_EE_AlarmConfig> AppendAlarm(t_EE_AlarmConfig alarm);

        //删除报警
        IList<t_EE_AlarmConfig> DeleteAlarm(t_EE_AlarmConfig alarm);
        //修改报警
        IList<t_EE_AlarmConfig> UpdataeAlarm(t_EE_AlarmConfig alarm);
        //获取列表
        IList<t_EE_AlarmConfig> GetPueAlarm(int pid);


        //获取报警类型
        IList<t_EE_AlarmType> GetAlarmType();
        //查询相应的值是否存在
        IList<t_EE_AlarmConfig> GetPueAlarmAfter(t_EE_AlarmConfig alarm);


    }
}
