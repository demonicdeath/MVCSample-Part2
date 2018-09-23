using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SectorTest.Model;

namespace SectorTest.DataAccess.Interface
{
    public interface ICustomerTestDal
    {
        void EditCustomer(string CustomerName, List<int> SectorIds);
        List<int> GetCustomerSectors(string CustomerName);

    }
}
