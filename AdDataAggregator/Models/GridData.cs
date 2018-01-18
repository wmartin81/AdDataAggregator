using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdDataAggregator.Models {
    public class GridData<T> {
        public string[] Headers { get; set; }
        public IEnumerable<T> Rows { get; set; }
    }
}