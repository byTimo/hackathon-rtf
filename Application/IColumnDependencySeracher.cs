using System.Collections.Generic;

namespace Application
{
    public interface IColumnDependencySeracher
    {
        Dictionary<ColumnInfo, HashSet<ColumnInfo>> Search(string query);
    }
}