app.controller("CustomerSectorController", ['$scope', '$q', '$filter', '$http', 'CustomerTestService', 'SectorTestService',  
    function ($scope, $q, $filter, $http, CustomerTestService, SectorTestService) {
        var vm = this;
        vm.SectorList = [{}];
        vm.finalSectors = [{          
        }];
        vm.CustomerData = {
            CustomerName: '',
            SectorId :[]
        };

     
      

        SectorTestService.getAllSectors().then(function (data) {          
            vm.SectorList = data;
            vm.merge();            
        });

        
    

        vm.EditCustomerData = function () {
            var checkBox = document.getElementById("checkboxAgree");

            if ((vm.CustomerData.CustomerName != undefined) && (vm.CustomerData.SectorId != undefined) && (checkBox.checked))
            {
                CustomerTestService.editCustomerSector(vm.CustomerData).then(function (data) {
                    CustomerTestService.getAllCustomerSectors(vm.CustomerData.CustomerName).then(function (data) {                        
                        vm.CustomerData.SectorId = data;
                    });
                });
            }
        }

        vm.Reset = function ()
        {
            vm.CustomerData = {};
            vm.SectorList = [{}];
            vm.finalSectors = [{}];

        }

        vm.merge = function () {
            for (i = 0; i < vm.SectorList.length; i++) {

                if(vm.SectorList[i].subSector == null)
                    vm.finalSectors.push({ SectorId: vm.SectorList[i].MainSectorId, Sector: "\xa0\xa0\xa0\xa0" + vm.SectorList[i].MainSectorName });
                else
                {
                    if (!vm.finalSectors.find(x =>x.SectorId == vm.SectorList[i].MainSectorId))
                        vm.finalSectors.push({ SectorId: vm.SectorList[i].MainSectorId, Sector: "\xa0\xa0\xa0\xa0" + vm.SectorList[i].MainSectorName });
                    for (j = 0; j < vm.SectorList[i].subSector.length; j++) {
                        vm.finalSectors.push({ SectorId: vm.SectorList[i].subSector[j].SubSectorId, Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].subSector[j].SubSectorName });
                        if (vm.SectorList[i].subSector[j].detailSector != null)
                        {
                            if (!vm.finalSectors.find(x =>x.SectorId == vm.SectorList[i].subSector[j].SubSectorId))
                                vm.finalSectors.push({ SectorId: vm.SectorList[i].subSector[j].SubSectorId, Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].subSector[j].SubSectorName });
                            for (k = 0; k < vm.SectorList[i].subSector[j].detailSector.length; k++)
                            {
                                vm.finalSectors.push({
                                    SectorId: vm.SectorList[i].subSector[j].detailSector[k].DetailSectorId,
                                        Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].subSector[j].detailSector[k].DetailSectorName
                                });
                            }
                        }
                    }
                }
                //if(vm.SectorList[i].detailSector == null)
                //{
                //    if (vm.SectorList[i].subSector == null) {                        
                //        vm.finalSectors.push({ SectorId: vm.SectorList[i].MainSectorId, Sector: "\xa0\xa0\xa0\xa0" + vm.SectorList[i].MainSectorName });
                //    }
                //    else {
                //        if (!vm.finalSectors.find(x =>x.SectorId ==vm.SectorList[i].MainSectorId ))
                //            vm.finalSectors.push({ SectorId: vm.SectorList[i].MainSectorId, Sector: "\xa0\xa0\xa0\xa0" + vm.SectorList[i].MainSectorName });
                //        for (j = 0; j < vm.SectorList[i].subSector.length; j++) {                                                       
                //            vm.finalSectors.push({ SectorId: vm.SectorList[i].subSector[j].SubSectorId, Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].subSector[j].SubSectorName });
                //        }
                //    }
                //}
                //else {
                //    if (!vm.finalSectors.find(x =>x.SectorId == vm.SectorList[i].subSector[0].SubSectorId))
                //        vm.finalSectors.push({ SectorId: vm.SectorList[i].subSector[0].SubSectorId, Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].subSector[0].SubSectorName });
                //    for (j = 0; j < vm.SectorList[i].detailSector.length; j++) {
                //        vm.finalSectors.push({ SectorId: vm.SectorList[i].detailSector[j].DetailSectorId, Sector: "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + vm.SectorList[i].detailSector[j].DetailSectorName });
                //    }
                //}
            }

            return vm.finalSectors;

        }
}]);
