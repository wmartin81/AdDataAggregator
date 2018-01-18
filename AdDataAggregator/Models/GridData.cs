using System.Collections.Generic;

namespace AdDataAggregator.Models {
    public class GridData<T> {
        public string[] Headers { get; set; }
        public IEnumerable<T> Rows { get; set; }
    }
}