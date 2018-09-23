using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using System.Configuration;
using SectorTest.DataAccess.Dapper;


namespace SectorTest.DataAccess
{
    public class BaseDal : IBaseDal
    {
        protected readonly string ConnectionString;
        public BaseDal(string entryKey)
        {
            ConnectionString = GetConnString(entryKey);
        }

        public BaseDal() : this("SectorDB") { }

        public int ExecuteNonQuery(string queryToExec, object parameters, CommandType commandType = CommandType.StoredProcedure, string connStringKey = null)
        {
            if (string.IsNullOrEmpty(connStringKey))
            {
                using (var connection = CreateOpenConnection())
                {
                    int result = connection.Execute(queryToExec, parameters, null, null, commandType);
                    return result;
                }
            }
            else
            {

                using (var connection = CreateOpenConnection(connStringKey))
                {
                    int result = connection.Execute(queryToExec, parameters, null, null, commandType);
                    return result;
                }
            }
        }

        private string GetConnString(string entryKey)
        {
            return ConfigurationManager.ConnectionStrings[entryKey].ConnectionString;
        }

        public IDbConnection CreateOpenConnection(string connStringKey = null)
        {
            var connection = new SqlConnection(connStringKey == null ? ConnectionString : GetConnString(connStringKey));
            connection.Open();
            return connection;
        }

        public List<T> QueryList<T>(string queryToExec, object parameters = null, CommandType commandType = CommandType.StoredProcedure, string connStringKey = null)
        {
            using (var connection = CreateOpenConnection(connStringKey))
            {
                var result = connection.Query<T>(queryToExec, parameters, null, false, 0, commandType).ToList();
                return result;
            }
        }

        public T ExecuteScalar<T>(string queryToExec, object parameters, CommandType commandType = CommandType.StoredProcedure, string connStringKey = null)
        {
            using (var connection = CreateOpenConnection(connStringKey))
            {
                var result = connection.ExecuteScalar<T>(queryToExec, parameters, null, null, commandType);
                return result;
            }
        }

        public IEnumerable<TReturn> Query<TFirst, TSecond, TReturn>(string sql, Func<TFirst, TSecond, TReturn> map,
           object parameters, string splitOn, CommandType commandType, string connStringKey)
        {
            using (var connection = CreateOpenConnection(connStringKey))
            {
                var result = connection.Query(sql, map, parameters, null, true, splitOn, null, commandType);
                return result;
            }
        }

        public IEnumerable<TReturn> Query<TFirst, TSecond, TThird, TReturn>(string sql, Func<TFirst, TSecond, TThird, TReturn> map,
            object parameters, string splitOn, CommandType commandType, string connStringKey)
        {
            using (var connection = CreateOpenConnection(connStringKey))
            {
                var result = connection.Query(sql, map, parameters, null, true, splitOn, null, commandType);
                return result;
            }
        }



    }
}
