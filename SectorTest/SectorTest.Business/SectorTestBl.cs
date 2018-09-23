using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SectorTest.Business.Interface;
using SectorTest.DataAccess.Interface;
using SectorTest.Model;

namespace SectorTest.Business
{
    public class SectorTestBl: ISectorTestBl
    {
        private readonly ISectorTestDal _dal;

        public SectorTestBl(ISectorTestDal dal)
        {
            _dal = dal;
        }
        public List<AllSector> GetAllSectors()
        {
            return _dal.GetAllSectors();
        }
     
    }
}
