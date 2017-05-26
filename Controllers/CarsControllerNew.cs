﻿using Bing;
using ProductsApp.Models;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Http;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

using System.Threading.Tasks;
using System.Web;

using Newtonsoft.Json;
using System.Diagnostics;

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
        /// Selected is an object with 5 properties used to access the Cars database.
        /// 1: year = model year; 2: make = manufacturer's name, e.g., ford; 
        /// 3: model = model of the car, e.g., escort; 4: trim = body styling, e.g., ST
        /// 5: sort = default (no value given) descending by date, 
        /// the rest are ascending 1 by make, 2 by model, 3 by trim.
        /// </summary>
        public class Selected
        {
            public string year { get; set; }
            public string make { get; set; }
            public string model { get; set; }
            public string trim { get; set; }
            public string sort { get; set; }
        }

        /// <summary>
        /// CarId is an object containing the property "id" of type int which refers to the 
        /// identification number of the car to be searched for in the cars database.
        /// </summary>
        public class CarId
        {
            public int id { get; set; }
        }

        /// <summary>
        /// GenerateYears lists of years that are in the Car Finder database.  This list is used by
        /// the Car Finder App to populate the "Search by Years" drop-down list.
        /// Since these change infrequently, the values are currently hard-coded (1936-2015), 
        /// but in future versions they will be passed in as parameters.
        /// </summary>
        /// <returns>
        /// List of strings
        /// </returns>
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

        /// <summary>
        /// GetModelYears returns a list of the years available for a given car make 
        /// specified in the selected object.
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>List of strings
        /// </returns>
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
        /// GetMakes4Yr lists distinct car makes for the year given in the selected object.
        /// For example, for 2001 it returns ... bugatti, buick, cadilac, chevrolet...
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>
        /// List of type string
        /// </returns>
        [HttpPost]
        [Route("GetMakes4Yr")]
        public IHttpActionResult GetCarMakes4Yr(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");

            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarMakes4Yr @yr", _yr).ToList();

            return Ok(retval);
        }

        /// <summary>
        /// GetAllMakes returns a list of distinct car makes (or manufacturers) in the database
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>
        /// List of type string
        /// </returns>
        [HttpPost]
        [Route("GetAllMakes")]
        public IHttpActionResult GetAllMakes(Selected selected)
        {
            var retval = db.Database.SqlQuery<string>(
                "EXEC GetAllMakes").ToList();

            return Ok(retval);
        }


        /// <summary>
        /// GetModels provides the models for a given year and make that is specified in the "selected" object.
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>
        /// List of type string
        /// </returns>
        [HttpPost]
        [Route("GetModels")]
        public IHttpActionResult GetModels(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");
            var _mk = new SqlParameter("@mk", selected.make ?? "");

            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarModels4YrMake @yr, @mk", _yr, _mk).ToList();

            return Ok(retval);
        }


        /// <summary>
        /// GetTrims provides the trims for a given year, make and model that is specified in the "selected" object.
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>
        /// List of type string
        /// </returns>
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


        /// <summary>
        /// GetCars returns a list of cars based on up to 4 parameters and a sort code, all of which are optional 
        /// through a PUT request.  (CAUTION: calling this API without any parameter returns the entire database!)
        /// Inside the "selected" object: year is a 4 digit number, e.g.,  2011; make is the manufacturer's name, 
        /// e.g., honda; model is the type of car, e.g., accord; trim is its configuration, e.g., EX-L 2dr Coupe;
        /// sort, by default (or if blank) is descending by date, 1 by make, 2 by model, 3 by trim.
        /// </summary>
        /// <param name="selected"></param>
        /// <returns>
        /// JSON object of type Car consisting of approx 30 characteristics of each vehicle
        /// </returns>
        [HttpPost]
        [Route("GetCars")]
        public IHttpActionResult GetCars(Selected selected)
        {
            var _yr = new SqlParameter("@yr", selected.year ?? "");
            var _mk = new SqlParameter("@mk", selected.make ?? "");
            var _mod = new SqlParameter("@mod", selected.model ?? "");
            var _trm = new SqlParameter("@trm", selected.trim ?? "");
            var _srt = new SqlParameter("@srt", selected.sort ?? "");

            var retval = db.Database.SqlQuery<Car>(
            "EXEC GetCars4YrMakeModelTrim @yr, @mk, @mod, @trm, @srt", _yr, _mk, _mod, _trm, _srt).ToList();
            //return Ok(years); /*StatusCode */

            return Ok(retval);
        }

        /// <summary>
        /// This API returns a list of cars based on up to 4 parameters and a sort code (all optional) via a GET 
        /// request.  Year is a 4 digit number, e.g.,  2011; make is the manufacturer's name, e.g., honda
        /// model is the type of car, e.g., accord; trim is its configuration, e.g., EX-L 2dr Coupe (2.4L 4cyl CVT)
        /// sort, default (or no value given) descending by date, 1 by make, 2 by model, 3 by trim.
        /// </summary>
        /// <param name="year"></param>
        /// <param name="make"></param>
        /// <param name="model"></param>
        /// <param name="trim"></param>
        /// <param name="sort"></param>
        /// <returns>
        /// List of "car" objects
        /// </returns>
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
        /// GetDetails uses the Id from the CarFinders database to return a compound object containing 
        /// (1) a car object with vehicle details, (2) a list of recall information from the Natl Highway Traffic 
        /// Safety Administration (NHTSA) along with (3) links to images, if available.
        /// </summary>
        /// <param name="selected">
        /// </param>
        /// <returns>
        /// JSON compound ojbect of Car and one or more Image and Recall records
        /// </returns>
        [Route("GetDetails")]
        [HttpPost]
        public async Task<IHttpActionResult> GetDetails(CarId id)
        {
            HttpResponseMessage response;
            string content = "";
            var j = id.id;
            var Car = db.Cars.Find(id.id);
            dynamic Recalls = null; 
            var imgString = "";
           

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://www.nhtsa.gov/");
                try
                {
                    response = await client.GetAsync("webapi/api/recalls/vehicle/modelyear/" + Car.model_year +
                                                                                    "/make/" + Car.make +
                                                                                    "/model/" + Car.model_name + "?format=json");
                    content = await response.Content.ReadAsStringAsync();
                    Recalls = content;
                }
                catch (Exception e)
                {
                    Console.WriteLine("NHTSA GetAsync error: {0}", e);
                    Recalls = null;
                }
            }

            var image = new BingSearchContainer(new Uri("https://api.datamarket.azure.com/Bing/search/v1/image"));

            const int IMG_COUNT = 6;
            const String IMG_COUNT_STRING = "&count=6";

            try
            {
                var client = new HttpClient();
                var queryString = HttpUtility.ParseQueryString(string.Empty);
                // Request headers
                // ca92ee05fb9448c1b7a7d56d833e6b5b
                //  b1924bbf17dc4760a72d8815bada3400   
                client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "b1924bbf17dc4760a72d8815bada3400");

                // Request parameters
                queryString["q"] = Car.model_year + " " + Car.make + " " + Car.model_name + " " + Car.model_trim;
                var uri = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + queryString + IMG_COUNT_STRING;

                HttpResponseMessage responseImg;

                // Request body
                byte[] byteData = Encoding.UTF8.GetBytes("{body}");

                using (var contentImg = new ByteArrayContent(byteData))
                {
                    contentImg.Headers.ContentType = new MediaTypeHeaderValue("application/json"); 
                    responseImg = await client.PostAsync(uri, contentImg);

                    if (responseImg.IsSuccessStatusCode)
                    {
                        String str = await responseImg.Content.ReadAsStringAsync();

                        dynamic js = JsonConvert.DeserializeObject(str);

                        for (int i = 0; i < IMG_COUNT; i++)
                        {
                            string x = js.value[i].contentUrl;
                            imgString = x.Substring(x.IndexOf("http"));
                            if (UrlCtrl.IsUrl(imgString))
                            {
                                break;
                            }
                            else
                            {
                                imgString = "";
                            }
                        }
                    }
                }
            }
            catch (WebException ex)
            {
                if (ex.Status == WebExceptionStatus.ProtocolError &&
                    ex.Response != null)
                {
                    var resp = (HttpWebResponse)ex.Response;
                    if (resp.StatusCode == HttpStatusCode.NotFound)
                    {
                        imgString = null;
                        Debug.WriteLine("Inside GetDetails, cannot find images: " + resp);
                    }
                    else
                    {
                        imgString = null;
                        Debug.WriteLine("Inside GetDetails, error: " + resp);
                    }
                }
                else
                {
                    Debug.WriteLine("Inside GetDetails, other error response: " + ex.Response);
                    imgString = null;
                }
            }
            return Ok(new { car = Car, recalls = Recalls, image = imgString });
        }
    }
    

    /// <summary>
    /// UrlCtrl tests whether the given path leads to a valid and active URL
    /// </summary>
    /// <param name="path"></param>
    /// <returns>
    /// result (boolean: true if valid, false otherwise)
    /// </returns>
    [Route("IsUrl")]
    public static class UrlCtrl
    {
        public static bool IsUrl(string path)
        {
            HttpWebResponse response = null;
            var request = (HttpWebRequest)WebRequest.Create(path);
            request.Method = "HEAD";
            bool result = true;

            try
            {
                response = (HttpWebResponse)request.GetResponse();
            }
            catch (WebException ex)
            {
                Debug.WriteLine($"error {ex}");
                result = false;
            }
            finally
            {
                if (response != null)
                {
                    response.Close();
                }
            }
            return result;
        }
    }

}