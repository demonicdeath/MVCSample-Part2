using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SectorTest.Model
{
    public class AllSector
    {
        public int MainSectorId { get; set; }
        public string MainSectorName { get; set; }
      
        public List<SubSector> subSector { get; set; }      
       
    }
}
