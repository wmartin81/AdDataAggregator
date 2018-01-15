using AdDataAggregator.ServiceReference1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace AdDataAggregator.Controllers
{
    public class AdsController : ApiController
    {
        public IEnumerable<Ad> GetAllAds() {
            var client = new AdDataServiceClient();
            var ads = client.GetAdDataByDateRange(new DateTime(2011, 1, 1), new DateTime(2011, 4, 1));
            client.Close();

            return ads;
        }
    }
}
