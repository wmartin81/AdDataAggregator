using AdDataAggregator.ServiceReference1;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web.Http;

namespace AdDataAggregator.Controllers
{
    [RoutePrefix("api/ads")]
    public class AdsController : ApiController
    {
        private const string ADS_CACHE_KEY = "ALL_ADS";

        /// <summary>
        /// Gets ads from wcf service for the following date range: January 1st, 2011 and April 1st, 2011
        /// </summary>
        /// <returns></returns>
        private async Task<IEnumerable<Ad>> GetAllAdsFromServiceAsync() {
            var client = new AdDataServiceClient();
            var tasks = new List<Task<Ad[]>>();
            var start = new DateTime(2011, 1, 1);
            var end = new DateTime(2011, 4, 1);
            while (start < end) {
                DateTime taskStart = start;
                DateTime taskEnd = start.AddMonths(1);

                Task<Ad[]> firstHalf = client.GetAdDataByDateRangeAsync(taskStart, taskEnd);
                tasks.Add(firstHalf);
                start = taskEnd;
            }

            Ad[][] whenAllResult = await Task.WhenAll(tasks.ToArray());
            IEnumerable<Ad> ads = whenAllResult.SelectMany(ad => ad);
          
            client.Close();

            return ads;
        }

        /// <summary>
        /// Attempts to retrieve Ad objects from cache if the exist, otherwise the objects are added to the cache. 
        /// </summary>
        /// <returns></returns>
        private async Task<IEnumerable<Ad>> GetAllAdsFromCacheAsync() {
            var cache = MemoryCache.Default;
            var ads = cache.Get(ADS_CACHE_KEY) as IEnumerable<Ad>;
            if (ads != null) return ads;

            ads = await this.GetAllAdsFromServiceAsync();
            cache.Add(ADS_CACHE_KEY, ads, new CacheItemPolicy());

            return ads;
        }

        /// <summary>
        /// Get all ads sorted by brand name.
        /// </summary>
        /// <returns></returns>
        [Route("list")]
        public async Task<IEnumerable<Ad>> GetAllAds() {
            var ads = await this.GetAllAdsFromCacheAsync();
            return ads.OrderBy(a => a.Brand.BrandName);
        }

        /// <summary>
        /// Get Cover ads that take up 50% of the page or more, and are sorted by brand name. 
        /// </summary>
        /// <returns></returns>
        [Route("cover")]
        public async Task<IEnumerable<Ad>> GetCoverAdsOver50() {
            var ads = await this.GetAllAdsFromCacheAsync();
            return ads.Where(a => a.Position == "Cover" && a.NumPages >= 0.5m)
                .OrderBy(a => a.Brand.BrandName);
        }

        /// <summary>
        /// Get the top 5 ads with the highest page coverage amount, 
        /// distinct by brand id and sorted by page coverage(descending) and brand name.
        /// </summary>
        /// <returns></returns>
        [Route("top5ads")]
        public async Task<IEnumerable<Ad>> GetTop5Ads() {
            var ads = await this.GetAllAdsFromCacheAsync();
            var top5AdsDistinctBrand = new Dictionary<int, Ad>();
            foreach(var ad in ads.OrderByDescending(a => a.NumPages).ThenBy(a => a.Brand.BrandName)) {
                if (top5AdsDistinctBrand.Count == 5) break;
                if (top5AdsDistinctBrand.ContainsKey(ad.Brand.BrandId)) continue;

                top5AdsDistinctBrand.Add(ad.Brand.BrandId, ad);
            }

            return top5AdsDistinctBrand.Values.ToList();
        }

        /// <summary>
        /// Get the top 5 brands with the highest page coverage amount
        /// sorted by page coverage(descending) and brand name.
        /// </summary>
        /// <returns></returns>
        [Route("top5brands")]
        public async Task<IEnumerable<Ad>> GetTop5Brands() {
            var ads = await this.GetAllAdsFromCacheAsync();
            var topAdsByBrand = from ad in ads
                                group ad by ad.Brand.BrandId into newGroup
                                select newGroup.First(g => g.NumPages == newGroup.Max(ng => ng.NumPages));

            var top5Brands = topAdsByBrand.OrderByDescending(a => a.NumPages)
                .ThenBy(a => a.Brand.BrandName)
                .Take(5);

            return top5Brands;
        }
    }
}
