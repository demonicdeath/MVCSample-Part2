using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;
using System.Data;
using HtmlAgilityPack;
using System.Configuration;
using System.Text.RegularExpressions;
using System.Web.Hosting;
using SectorTest.Model;
using SectorTest.DataAccess.Interface;

namespace SectorTest.DataAccess
{
    public class SectorTestDal : ISectorTestDal
    {
        private readonly IBaseDal _dal;
        public SectorTestDal(IBaseDal _dal)
        {
            this._dal = _dal;         
        }

        private void ParseHTML()
        {
            string fileName = ConfigurationManager.AppSettings["DataPath"].Replace("~", HostingEnvironment.ApplicationPhysicalPath);
            var doc = new HtmlDocument();
            doc.Load(fileName);
            int mainPrev = 0;
            int subPrev = 0;
            var value = doc.DocumentNode.SelectNodes("//select/option");

            foreach (var val in value)
            {
                var id = Convert.ToInt32(val.Attributes[0].Value);
                var text = val.InnerHtml;
                int Count = Regex.Matches(text, "&nbsp;").Count;
                text = text.Replace("&nbsp;", "");

                if (Count == 4)
                {
                    mainPrev = id;
                    _dal.ExecuteNonQuery(@"Insert into MainSector values(" + id + ", '" + text + "')",  null, CommandType.Text);                  
                }
                else if (Count == 8)
                {
                    subPrev = id;
                    _dal.ExecuteNonQuery(@"Insert into SubSector values(" + id + ", '" + text + "', " + mainPrev + ")", null, CommandType.Text);
                    
                }
                else if (Count == 12)
                {
                    _dal.ExecuteNonQuery(@"Insert into DetailSector values(" + id + ", '" + text + "', " + subPrev + ")", null, CommandType.Text);                   
                }

            }


        }     

        public List<AllSector> GetAllSectors()
        {
            var lookup = new Dictionary<string, AllSector>();
            var lookupSub = new Dictionary<string, SubSector>();

            var command = @"select Count(*) from MainSector";
            var nResult = _dal.ExecuteScalar<int>(command, null, CommandType.Text);

            if (nResult == 0)
                ParseHTML();

            command = String.Format(CultureInfo.InvariantCulture, "select distinct main.*, sub.SubSectorId, sub.SubSectorName, det.DetailSectorId, det.DetailSectorName from " +
                                        "MainSector main left join SubSector sub on sub.MainSectorSubId = main.MainSectorID left join " +
                                        "DetailSector det on det.SubSectorID = sub.SubSectorId");
           
             _dal.Query<AllSector, SubSector, DetailSector, AllSector>(command, 
                (mainSector, subSector, detailSector) =>
            {
                AllSector sector;
                SubSector subsector;

                if (!lookup.TryGetValue(mainSector.MainSectorName, out sector))
                    lookup.Add(mainSector.MainSectorName, sector = mainSector);

                if (subSector != null)
                {
                    if (sector.subSector == null)
                        sector.subSector = new List<SubSector>();

                    if(sector.subSector.Find(x => x.SubSectorName == subSector.SubSectorName) == null)
                        sector.subSector.Add(subSector);

                    if (!lookupSub.TryGetValue(subSector.SubSectorName, out subsector))
                        lookupSub.Add(subSector.SubSectorName, subsector = subSector);

                    if (detailSector!=null)
                    {                      
                        if (subsector.detailSector == null)
                           subsector.detailSector = new List<DetailSector>();

                        subsector.detailSector.Add(detailSector);
                    }
                }
                                       
                return sector;
            }, null, "SubSectorId, DetailSectorId", CommandType.Text);

            return lookup.Values.ToList();
        }
    }
}
