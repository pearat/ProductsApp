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

        [Route("Makes")]
        public IHttpActionResult GetCarMakes4Yr(string year)
        {
            var _yr = new SqlParameter("@yr", year ?? "");

            var retval = db.Database.SqlQuery<string>(
                "EXEC GetCarMakes4Yr @yr", _yr).ToList();

            return Ok(retval);

        }

    }
}
