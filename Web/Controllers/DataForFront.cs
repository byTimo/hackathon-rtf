using System.Collections.Generic;
using Application;

namespace Web.Controllers
{
    public class DataForFront
    {
        public Dictionary<string, HashSet<string>> columns { get; set; }

        public Dictionary<ColumnInfo, HashSet<ColumnInfo>> dependency { get; set; }
    }
}