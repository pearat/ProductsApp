using ProductsApp.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProductsApp.Controllers
{
    public class ProductsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        Product[] products = new Product[]
        {
            new Product { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
            new Product { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
            new Product { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };

        public IEnumerable<Product> GetAllProducts()
        {
            return products;
        }

        public IHttpActionResult GetProduct(int id, string body_style)
        {

            // var retval = db.Cars.Find(id);  // pre-existing function

            var Sid = new SqlParameter("@id", id);
            var Sbody_style = new SqlParameter("@body_style", id);

            var retval = db.Database.SqlQuery<Car>(
                "EXEC GetCarMakes4Yr @yr", Sid, Sbody_style).ToList();

            return Ok(retval);

        }
    }
}
