using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdDataAggregator.Models {
    public class TopBrand {
        public int BrandId { get; set; }
        public string BrandName { get; set; }
        public decimal PageCoverage { get; set; }
    }
}