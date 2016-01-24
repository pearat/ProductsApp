using Bing;
using ProductsApp.Models;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;   
using Newtonsoft.Json;

namespace ProductsApp.Controllers
{
    /// <summary>
    /// CarsController contains three individual controllers
    /// </summary>
    [RoutePrefix("api/Cars")]
    public class CarsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        /// <summary>
        /// Selected is an object 
        /// </summary>
        public class Selected
        {
            public string year { get; set; }
            public string make { get; set; }
            public string model { get; set; }
            public string trim { get; set; }
            public string sort { get; set; }
        }

        public class CarId
        {
            public int id { get; set; }
        }

        [Route("GenerateYears")]
        [HttpPost]
        public IHttpActionResult GenerateYears()
        {
            int startyr, endyr, yr, count;
            yr = startyr = 2015;
            endyr = 1936;
            count = startyr - endyr + 1;
            var years = new string[count];

            for (int i = 0; i < count; i++)
            {
                years[i] = yr.ToString();
                yr--;
            };
            return Ok(years);
        }
        
        [Route("GetModelYears")]
        [HttpPost]
        public IHttpActionResult GetModelYears(Selected selected)
        {
            var _mk = new SqlParameter("@mk", selected.make ?? "");

        var retval = db.Database.SqlQuery<string>(
            "EXEC GetYears4Make @mk", _mk).ToList();

            return Ok(retval);

        }

        /// <summary>
        /// This API returns a list of the distinct car makes for the year in question
        /// For example, for 2001 it returns ... bugatti, buick, cadilac, chevrolet...
        /// </summary>
        /// <param name="year"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetMakes4Yr")]
        public IHttpActionResult GetCarMakes4Yr(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");
            
            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarMakes4Yr @yr", _yr).ToList();

            return Ok(retval);
        }

        [HttpPost]
        [Route("GetAllMakes")]
        public IHttpActionResult GetAllMakes(Selected selected)
        {
            var retval = db.Database.SqlQuery<string>(
                "EXEC GetAllMakes").ToList();

            return Ok(retval);
        }


        [HttpPost]
        [Route("GetModels")]
        public IHttpActionResult GetModels(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");
            var _mk = new SqlParameter("@mk", selected.make ?? "");

            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarModels4YrMake @yr, @mk", _yr,_mk).ToList();

            return Ok(retval);
        }


        [HttpPost]
        [Route("GetTrims")]
        public IHttpActionResult GetTrims(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");
            var _mk = new SqlParameter("@mk", selected.make ?? "");
            var _mod = new SqlParameter("@mod", selected.model ?? "");
            
            var retval = db.Database.SqlQuery<string>(
            "EXEC GetTrims4YrMakeModel @yr, @mk, @mod", _yr, _mk, _mod).ToList();
            return Ok(retval);
        }



        [HttpPost]
        [Route("GetCars")]
        public IHttpActionResult GetCars(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year?? "");
            var _mk = new SqlParameter("@mk", selected.make ?? "");
            var _mod = new SqlParameter("@mod", selected.model ?? "");
            var _trm = new SqlParameter("@trm", selected.trim ?? "");
            var _srt = new SqlParameter("@srt", selected.sort ?? "");

            var retval = db.Database.SqlQuery<Car>(
            "EXEC GetCars4YrMakeModelTrim @yr, @mk, @mod, @trm, @srt", _yr, _mk,_mod,_trm,_srt ).ToList();
            //return Ok(years); /*StatusCode */

            return Ok(retval);
        }

        /// <summary>
        /// This API returns a list of cars records for based on up to 4 parameters and a sort code (all optional)  
        /// through a GET request.  Year is a 4 digit number, e.g.,  2011; make is the manufacturer's name, e.g., honda
        /// model is the type of car, e.g., accord; trim is its configuration, e.g., EX-L 2dr Coupe (2.4L 4cyl CVT)
        /// sort, default by date, 1 by make, 2 by model.
        /// </summary>
        /// <param name="year"></param>
        /// <param name="make"></param>
        /// <param name="model"></param>
        /// <param name="trim"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        [Route("GetFull")]
        public IHttpActionResult GetCars4YrMakeModelTrim(string year, string make, string model, string trim, string sort)
        {
            var _yr = new SqlParameter("@yr", year ?? "");
            var _mk = new SqlParameter("@mk", make ?? "");
            var _mod = new SqlParameter("@mod", model ?? "");
            var _trm = new SqlParameter("@trm", trim ?? "");
            var _srt = new SqlParameter("@srt", sort ?? "");
            var retval = db.Database.SqlQuery<Car>(
                "EXEC GetCars4YrMakeModelTrim @yr, @mk, @mod, @trm, @srt", _yr, _mk, _mod, _trm, _srt).ToList();
            return Ok(retval);
        }

        /// <summary>
        /// Use Post 
        /// </summary>
        /// <param name="selected object with year, make, model, trim and (sort -- not used) "></param>
        /// <returns>
        /// JSON compound ojbect of car and one or more complaint records and photos
        /// </returns>
        [Route("GetDetails")]
        [HttpPost]
        public async Task<IHttpActionResult> GetDetails(CarId id)
        {
            HttpResponseMessage response;
            string content = "";
            var Car = db.Cars.Find(id.id);
            dynamic Recalls;
            var Image = "";
            
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://www.nhtsa.gov/");
                try
                {
                    response = await client.GetAsync("webapi/api/recalls/vehicle/modelyear/" + Car.model_year +
                                                                                    "/make/" + Car.make +
                                                                                    "/model/" + Car.model_name + "?format=json");
                    content = await response.Content.ReadAsStringAsync();
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }
            }
            // Recalls = JsonConvert.DeserializeObject(content);
            Recalls = content;

            var image = new BingSearchContainer(new Uri("https://api.datamarket.azure.com/Bing/search/"));

            image.Credentials = new NetworkCredential("accountKey", "uSZdhD53NSOfNv3g0J1hzgObRqsxmFK8iZXUQ3Y2My0");   //"dwmFt1J2rM45AQXkGTk4ebfcVLNcytTxGMHK6dgMreg"
            var marketData = image.Composite(
                "image",
                    Car.model_year + " " + Car.make + " " + Car.model_name + " " + Car.model_trim,
                    null, null, null, null, null, null, null, null, null, null, null, null, null
                    ).Execute();

            Image = marketData.First().Image.First().MediaUrl;
            return Ok(new { car = Car, recalls = Recalls, image = Image });

        }



        /// <summary>
        /// This API takes an Id number from the CarFinders database and returns a list of recall from the 
        /// Natl Highway Traffic Safety Administration (NHTSA), if any, along with links to images, if available.
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        [Route("RecallPics")]
        public async Task<IHttpActionResult> getCar(int Id)
        {
            HttpResponseMessage response = new HttpResponseMessage();
            string content = "";
            var Car = db.Cars.Find(Id);
            var Recalls = "";
            var Image = "";
            using (var client = new HttpClient())
            {
                
                client.BaseAddress = new Uri("http://www.nhtsa.gov/");
                try
                {
                    
                    content = await response.Content.ReadAsStringAsync();response = await client.GetAsync("webapi/api/recalls/vehicle/modelyear/" + Car.model_year +
                                                                                    "/make/" + Car.make +
                                                                                    "/model/" + Car.model_name + "?format=json");
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }
            }
            Recalls = content;

            var image = new BingSearchContainer(new Uri("https://api.datamarket.azure.com/Bing/search/"));

            image.Credentials = new NetworkCredential("accountKey", "uSZdhD53NSOfNv3g0J1hzgObRqsxmFK8iZXUQ3Y2My0");   //"dwmFt1J2rM45AQXkGTk4ebfcVLNcytTxGMHK6dgMreg"
            try {
                var marketData = image.Composite(
                    "image",
                    Car.model_year + " " + Car.make + " " + Car.model_name + " " + Car.model_trim,
                    null, null, null, null, null, null, null, null, null, null, null, null, null
                    ).Execute();

                Image = marketData.First().Image.First().MediaUrl;
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
            return Ok(new { car = Car, recalls = Recalls, image = Image });
        }
    }
}
