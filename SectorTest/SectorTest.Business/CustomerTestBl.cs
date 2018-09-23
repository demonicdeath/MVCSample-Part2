using SectorTest.Business.Interface;
using SectorTest.DataAccess.Interface;
using SectorTest.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SectorTest.Business
{
    public class CustomerTestBl : ICustomerTestBl
    {
        private readonly ICustomerTestDal _dal;

        public CustomerTestBl(ICustomerTestDal dal)
        {
            _dal = dal;
        }
        public void EditCustomer(string CustomerName, List<int> SectorIds)
        {
            if (string.IsNullOrEmpty(CustomerName) || SectorIds == null)
                return;

            _dal.EditCustomer(CustomerName, SectorIds);
        }
        public List<int> GetCustomerSectors(string CustomerName)
        {
            if (string.IsNullOrEmpty(CustomerName))
                return null;

           return _dal.GetCustomerSectors(CustomerName);          
        }
    }
}
