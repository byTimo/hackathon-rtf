using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace Web.Controllers
{
    public class HomeController : Controller
    {
        private static readonly DataProvider dataProvider = new DataProvider(); 
        
        public ActionResult Index()
        {
            return View();
        }

        [System.Web.Http.HttpPost]
        public ActionResult GetData([FromBody] Wrapper wrapper)
        {
            var query = wrapper.data;
            var data = dataProvider.GetData(query);

            return new ContentResult
            {
                Content = JsonConvert.SerializeObject(data),
                ContentType = "application/json",
                ContentEncoding = Encoding.UTF8
            };
        }

        public class Wrapper
        {
            public string data { get; set; }
        }
    }
}