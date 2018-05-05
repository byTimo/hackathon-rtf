using Application;

namespace Web.Controllers
{
    public class DataProvider
    {
        private static readonly ITableColumnSearcher columnSearcher = new TableColumnSearcher();
        private static readonly IColumnDependencySeracher dependencySeracher = new ColumnDependencySeracher();

        public DataForFront GetData(string query)
        {
            var columns = columnSearcher.Search(query);
            var dependency = dependencySeracher.Search(query);

            return new DataForFront
            {
                columns = columns,
                dependency = dependency
            };
        }
    }
}