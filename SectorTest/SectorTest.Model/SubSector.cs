using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SectorTest.Model
{
    public class SubSector
    {
        public int SubSectorId { get; set; }
        public string SubSectorName { get; set; }

        public List<DetailSector> detailSector { get; set; }
    }
}
