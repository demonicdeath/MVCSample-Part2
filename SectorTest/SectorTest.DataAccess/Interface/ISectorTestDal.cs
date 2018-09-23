using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SectorTest.Model;

namespace SectorTest.DataAccess.Interface
{
    public interface ISectorTestDal
    {        
        List<AllSector> GetAllSectors();
    }
}
