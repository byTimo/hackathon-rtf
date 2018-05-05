namespace Application
{
    public class ColumnInfo
    {
        public string Name { get; }
        public string TableName { get; }

        public ColumnInfo(string name, string tableName)
        {
            Name = name;
            TableName = tableName;
        }

        public override string ToString()
        {
            return $"{TableName}.{Name}";
        }

        protected bool Equals(ColumnInfo other)
        {
            return string.Equals(Name, other.Name) && string.Equals(TableName, other.TableName);
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj))
            {
                return false;
            }

            if (ReferenceEquals(this, obj))
            {
                return true;
            }

            if (obj.GetType() != this.GetType())
            {
                return false;
            }

            return Equals((ColumnInfo) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return ((Name != null ? Name.GetHashCode() : 0) * 397) ^ (TableName != null ? TableName.GetHashCode() : 0);
            }
        }
    }
}