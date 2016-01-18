using ProductsApp.Models;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;

namespace ProductsApp.Controllers
{
    [RoutePrefix("api/Cars")]
    public class CarsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        /// <summary>
        /// This API returns a list of cars records for based upon 4 parameters 
        /// and a sort code.  All parameters and the sort code are optional, but parameter names 
        /// must be provided in the GET request.
        /// For example, the most basic call is: url/api/cars/full?year=&make=&model=&trim=&sort=
        /// where url = http:\\tpeara.carfinder.com (?)
        /// Otherwise, year is a 4 digit numbrer, e.g.,  2011
        /// make is the manufacturer's name, e.g., honda
        /// model is the type of car, e.g., accord
        /// trim is its configuration, e.g., EX-L 2dr Coupe (2.4L 4cyl CVT)
        /// sort, default by date, 1 by make, 2 by model
        /// </summary>
        /// <param name="year"></param>
        /// <param name="make"></param>
        /// <param name="model"></param>
        /// <param name="trim"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        [Route("Full")]
        public IHttpActionResult GetCars4YrMakeModelTrim(string year, string make, string model, string trim, string sort)
        {
            var _yr = new SqlParameter("@yr", year ?? "");
            var _mk = new SqlParameter("@mk", make ?? "");
            var _mod = new SqlParameter("@mod", model ?? "");
            var _trm = new SqlParameter("@trm", trim ?? "");
            var _srt = new SqlParameter("@srt", sort ?? "");

            var retval = db.Database.SqlQuery<Car>(
                "EXEC GetCars4YrMakeModelTrim @yr, @mk, @mod, @trm, @srt", _yr, _mk,_mod,_trm,_srt ).ToList();

            return Ok(retval);

        }
        /// <summary>
        /// This API returns a list of the distinct car makes for the year in question
        /// For example, for 2001 it returns ... bugatti, buick, cadilac, chevrolet...
        /// </summary>
        /// <param name="year"></param>
        /// <returns></returns>
        [Route("Makes")]
        public IHttpActionResult GetCarMakes4Yr(string year)
        {
            var _yr = new SqlParameter("@yr", year ?? "");

            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarMakes4Yr @yr", _yr).ToList();

            return Ok(retval);

        }



        //public async Task<IHttpActionResult> getCar(int Id)
        //{
        //    HttpResponseMessage response;
        //    string content = "";
        //    var Car = db.Cars.Find(Id);
        //    var Recalls = "";
        //    var Image = "";
        //    using (var client = new HttpClient())
        //    {
        //        client.BaseAddress = new Uri("http://www.nhtsa.gov/");
        //        try
        //        {
        //            response = await client.GetAsync("webapi/api/Recalls/vehicle/modelyear/" + Car.Model_year +
        //                                                                            "/make/" + Car.Make +
        //                                                                            "/model/" + Car.Model_name + "?format=json");
        //            content = await response.Content.ReadAsStringAsync();
        //        }
        //        catch (Exception e)
        //        {
        //            return InternalServerError(e);
        //        }
        //    }
        //    Recalls = content;

        //    var image = new BingSearchContainer(new Uri("https://api.datamarket.azure.com/Bing/search/"));

        //    image.Credentials = new NetworkCredential("accountKey", "5u/0CzVmYrTKDOjlxPePfPkh/G8llMIfVJ7QC/oNEvQ");   //"dwmFt1J2rM45AQXkGTk4ebfcVLNcytTxGMHK6dgMreg"
        //    var marketData = image.Composite(
        //        "image",
        //        Car.Model_year + " " + Car.Make + " " + Car.Model_name + " " + Car.Model_trim,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null,
        //        null
        //        ).Execute();

        //    Image = marketData.First().Image.First().MediaUrl;
        //    return Ok(new { car = Car, recalls = Recalls, image = Image });

        //}


    }
}
