using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SectorTest.Model;

namespace SectorTest.Business.Interface
{
    public interface ISectorTestBl
    {
        List<AllSector> GetAllSectors();        
    }
}
