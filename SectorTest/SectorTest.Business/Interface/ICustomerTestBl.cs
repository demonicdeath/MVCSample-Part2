using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SectorTest.Model;

namespace SectorTest.Business.Interface
{
    public interface ICustomerTestBl
    {
        void EditCustomer(string CustomerName,List<int>sectorIds);
        List<int> GetCustomerSectors(string CustomerName);
    }
}
