using System;
using System.Data;

namespace SectorTest.DataAccess.Dapper
{
    static partial class SqlMapper
    {
        public static T ExecuteScalar<T>(
#if CSHARP30
this IDbConnection cnn, string sql, object param, IDbTransaction transaction, int? commandTimeout, CommandType? commandType
#else
this IDbConnection cnn, string sql, dynamic param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null
#endif
)
        {
            var identity = new Identity(sql, commandType, cnn, null, (object)param == null ? null : ((object)param).GetType(), null);                        
            var info = GetCacheInfo(identity);
            var scalar = ExecuteScalar(cnn, transaction, sql, info.ParamReader, param, commandTimeout, commandType);
            if (scalar == null || DBNull.Value.Equals(scalar))
            {
                return default(T);
            }
            return (T)scalar;
        }

        private static object ExecuteScalar(IDbConnection cnn, IDbTransaction transaction, string sql, Action<IDbCommand, object> paramReader, object obj, int? commandTimeout, CommandType? commandType)
        {
            using (var cmd = SetupCommand(cnn, transaction, sql, paramReader, obj, commandTimeout, commandType))            
            {
                return cmd.ExecuteScalar();
            }
        }
    }
}
