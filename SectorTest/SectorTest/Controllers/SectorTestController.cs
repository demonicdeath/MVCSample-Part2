using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SectorTest.Business.Interface;

namespace SectorTest.Controllers
{
    public class SectorTestController : Controller
    {

        private readonly ISectorTestBl _sectorBl;

        public SectorTestController(ISectorTestBl sectorBl)
        {
            _sectorBl = sectorBl;
        }


        [HttpGet]
        public JsonResult GetAllSectors()
        {
           
            var sectors = _sectorBl.GetAllSectors();
            return Json(sectors, JsonRequestBehavior.AllowGet);
        }

        // GET: SectorTest
        public ActionResult Index()
        {
            return View();
        }
    }
}