using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;


namespace SectorTest.DataAccess
{
    public interface IBaseDal
    {
        int ExecuteNonQuery(string queryToExec, object parameters, CommandType commandType = CommandType.StoredProcedure, string connStringKey = null);
        List<T> QueryList<T>(string queryToExec, object parameters = null, CommandType commandType = CommandType.Text, string connStringKey = null);
        T ExecuteScalar<T>(string queryToExec, object parameters, CommandType commandType = CommandType.StoredProcedure, string connStringKey = null);

        IEnumerable<TReturn> Query<TFirst, TSecond, TReturn>(string sql, Func<TFirst, TSecond, TReturn> map,
            object parameters, string splitOn, CommandType commandType, string connStringKey = null);

        IEnumerable<TReturn> Query<TFirst, TSecond, TThird, TReturn>(string sql,
            Func<TFirst, TSecond, TThird, TReturn> map, object parameters, string splitOn, CommandType commandType,
            string connStringKey = null);
    }
}
