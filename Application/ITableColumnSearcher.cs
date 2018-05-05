using System.Collections.Generic;

namespace Application
{
    public interface ITableColumnSearcher
    {
        Dictionary<string, HashSet<string>> Search(string query);
    }
}