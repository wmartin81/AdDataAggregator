using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdDataAggregator.Models {
    public class SimpleAd {
        public int AdId { get; set; }
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public decimal NumPages { get; set; }
        public string Position { get; set; }
    }
}