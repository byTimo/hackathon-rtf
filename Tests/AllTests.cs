using System.Linq;
using Application;
using NUnit.Framework;

namespace Tests
{
    [TestFixture]
    public class AllTests
    {
        private static readonly ITableColumnSearcher searcher = new TableColumnSearcher();
        private static readonly IColumnDependencySeracher dependencySeracher = new ColumnDependencySeracher();

        private static readonly string sql = @"
select a.ca1, a.ca2, b.cb1
from
  (select ca1,ca2, ca_id from ta where ca3 = 5) a,
  (select cb1, cb_id from tb where cb3 = 5) b
where b.cb_id = a.ca_id; ";

        [Test]
        public void Q()
        {
            var result = searcher.Search(sql);

            Assert.That(result.Count, Is.EqualTo(2));
            Assert.That(result.Keys, Is.EquivalentTo(new[] {"ta", "tb"}));
            Assert.That(result["ta"], Is.EquivalentTo(new[] {"ca1", "ca2", "ca3", "ca_id"}));
        }

        [Test]
        public void Q2()
        {
            var result = dependencySeracher.Search(sql);
            
            Assert.That(result.Count, Is.EqualTo(3));
            Assert.That(result.Keys.Select(x => x.ToString()), Is.EquivalentTo(new[] {"a.ca1", "a.ca2", "b.cb1"}));
        }
        
        [Test]
        public void Q3()
        {
            var query = @"
insert into lol (a, b, c)
select a e, b, c from lol2
";
            
            var result = dependencySeracher.Search(query);
            
            Assert.That(result.Count, Is.EqualTo(3));
        }
    }
}