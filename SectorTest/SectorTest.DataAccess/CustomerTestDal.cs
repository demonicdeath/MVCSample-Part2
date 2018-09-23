using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using System.Data;
using SectorTest.Model;
using SectorTest.DataAccess.Interface;
using SectorTest.DataAccess.Dapper;

namespace SectorTest.DataAccess
{
    public class CustomerTestDal : ICustomerTestDal
    {
        private readonly IBaseDal _dal;

        public CustomerTestDal(IBaseDal _dal)
        {
            //_dal = new BaseDal("SectorDB");
            this._dal = _dal;
        }

        public void EditCustomer(string CustomerName, List<int> SectorIds)
        {
            var ids = String.Join(",", SectorIds.Select(x => x.ToString()).ToArray());
            var param = new DynamicParameters();
            param.Add("CustomerName", CustomerName);
            param.Add("Sectors", ids);
           
            _dal.ExecuteNonQuery("EditCustomer", param, CommandType.StoredProcedure);
        }
        public List<int> GetCustomerSectors(string CustomerName)
        {
                                       
            var param = new DynamicParameters();
            param.Add("CustomerName", CustomerName);

            List<int> SectorId = _dal.QueryList<int>("GetCustomer", param, CommandType.StoredProcedure);
            return SectorId;
        }
    }
}
