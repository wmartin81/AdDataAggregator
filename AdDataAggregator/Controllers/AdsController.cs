using AdDataAggregator.Models;
using AdDataAggregator.ServiceReference1;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web.Http;

namespace AdDataAggregator.Controllers {
    [RoutePrefix("api/ads")]
    public class AdsController : ApiController
    {
        private const string ADS_CACHE_KEY = "ALL_ADS";

        /// <summary>
        /// Get ads from wcf service for the following date range: January 1st, 2011 and April 1st, 2011
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

                Task<Ad[]> task = client.GetAdDataByDateRangeAsync(taskStart, taskEnd);
                tasks.Add(task);
                start = taskEnd;
            }

            Ad[][] whenAllResult = await Task.WhenAll(tasks.ToArray());
            IEnumerable<Ad> ads = whenAllResult.SelectMany(ad => ad);
          
            client.Close();

            return ads;
        }

        /// <summary>
        /// Attempts to retrieve Ad objects from cache if they exist, otherwise the objects are added to the cache. 
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
        public async Task<GridData<SimpleAd>> GetAllAds() {
            var ads = await this.GetAllAdsFromCacheAsync();
            
            return new GridData<SimpleAd>() {
                Headers = new string[] {
                    nameof(SimpleAd.AdId), nameof(SimpleAd.BrandId), nameof(SimpleAd.BrandName), nameof(SimpleAd.NumPages), nameof(SimpleAd.Position)
                },
                Rows = ads.OrderBy(a => a.Brand.BrandName).Select(a => new SimpleAd() {
                    AdId = a.AdId,
                    BrandId = a.Brand.BrandId,
                    BrandName = a.Brand.BrandName,
                    NumPages = a.NumPages,
                    Position = a.Position
                })
            };
        }

        /// <summary>
        /// Get Cover ads that take up 50% of the page or more, and are sorted by brand name. 
        /// </summary>
        /// <returns></returns>
        [Route("cover")]
        public async Task<GridData<SimpleAd>> GetCoverAdsOver50() {
            var ads = await this.GetAllAdsFromCacheAsync();

            return new GridData<SimpleAd>() {
                Headers = new string[] {
                    nameof(SimpleAd.AdId), nameof(SimpleAd.BrandId), nameof(SimpleAd.BrandName), nameof(SimpleAd.NumPages), nameof(SimpleAd.Position)
                },
                Rows = ads.Where(a => a.Position == "Cover" && a.NumPages >= 0.5m)
                .OrderBy(a => a.Brand.BrandName).Select(a => new SimpleAd() {
                    AdId = a.AdId,
                    BrandId = a.Brand.BrandId,
                    BrandName = a.Brand.BrandName,
                    NumPages = a.NumPages,
                    Position = a.Position
                })
            };
        }

        /// <summary>
        /// Get the top 5 ads with the highest page coverage amount, 
        /// distinct by brand id and sorted by page coverage(descending) and brand name.
        /// </summary>
        /// <returns></returns>
        [Route("top5ads")]
        public async Task<GridData<TopAd>> GetTop5Ads() {
            var ads = await this.GetAllAdsFromCacheAsync();
            var top5AdsDistinctBrand = new Dictionary<int, Ad>();
            foreach(var ad in ads.OrderByDescending(a => a.NumPages).ThenBy(a => a.Brand.BrandName)) {
                if (top5AdsDistinctBrand.Count == 5) break;
                if (top5AdsDistinctBrand.ContainsKey(ad.Brand.BrandId)) continue;

                top5AdsDistinctBrand.Add(ad.Brand.BrandId, ad);
            }

            return new GridData<TopAd>() {
                Headers = new string[] { nameof(TopAd.AdId), nameof(TopAd.BrandName), nameof(TopAd.PageCoverage) },
                Rows = top5AdsDistinctBrand.Values.Select(ad => new TopAd() {
                    AdId = ad.AdId,
                    BrandName = ad.Brand.BrandName,
                    PageCoverage = ad.NumPages
                })
            };
        }

        /// <summary>
        /// Get the top 5 brands with the highest page coverage amount
        /// sorted by page coverage(descending) and brand name.
        /// </summary>
        /// <returns></returns>
        [Route("top5brands")]
        public async Task<GridData<TopBrand>> GetTop5Brands() {
            var ads = await this.GetAllAdsFromCacheAsync();
            var topAdsByBrand = from ad in ads
                                group ad by ad.Brand.BrandId into newGroup
                                select newGroup.First(g => g.NumPages == newGroup.Max(ng => ng.NumPages));

            var top5Brands = topAdsByBrand.OrderByDescending(a => a.NumPages)
                .ThenBy(a => a.Brand.BrandName)
                .Take(5);

            return new GridData<TopBrand>() {
                Headers = new string[] { nameof(TopBrand.BrandId), nameof(TopBrand.BrandName), nameof(TopBrand.PageCoverage)},
                Rows = top5Brands.Select(ad => new TopBrand() {
                    BrandId = ad.Brand.BrandId,
                    BrandName = ad.Brand.BrandName,
                    PageCoverage = ad.NumPages
                })
            };
        }
    }
}
