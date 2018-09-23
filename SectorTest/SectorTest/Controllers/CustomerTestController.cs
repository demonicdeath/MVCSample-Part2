using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SectorTest.Model;
using SectorTest.Business.Interface;

namespace SectorTest.Controllers
{
    public class CustomerTestController : Controller
    {

        private readonly ICustomerTestBl _customerBl;

        public CustomerTestController(ICustomerTestBl customerBl)
        {
            _customerBl = customerBl;
        }


        [HttpPost]
        public void EditCustomer(Customer customer)
        {

            
            if (customer == null)
                return;

            _customerBl.EditCustomer(customer.CustomerName, customer.SectorId);               
            
        }

        [HttpGet]
        public JsonResult GetAllCustomerSectors(string id)
        {

            if (string.IsNullOrEmpty(id))
                return null;

            var customerSectors = _customerBl.GetCustomerSectors(id);
            return Json(customerSectors, JsonRequestBehavior.AllowGet);
                 
        }


        // GET: CustomerTest
        public ActionResult Index()
        {
            return View();
        }
    }
}