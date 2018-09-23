using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity;
using Unity.Injection;
using SectorTest.DataAccess;
using SectorTest.Business.Interface;
using SectorTest.DataAccess.Interface;


namespace SectorTest.Business
{
    public static class UnityConfigBl
    {
        public static void RegisterTypes(IUnityContainer container)
        {

            container.RegisterType<ISectorTestBl, SectorTestBl>();
            container.RegisterType<ICustomerTestBl, CustomerTestBl>();

            container.RegisterType<IBaseDal, BaseDal>(new InjectionConstructor("SectorDB"));
            container.RegisterType<ISectorTestDal, SectorTestDal>();
            container.RegisterType<ICustomerTestDal, CustomerTestDal>();

        }
    }
}
