using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdDataAggregator.Models {
    public class TopAd {
        public int AdId { get; set; }
        public string BrandName { get; set; }
        public decimal PageCoverage { get; set; }
    }
}