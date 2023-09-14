using System;
using System.Collections.Generic;
using System.Linq;

namespace PostIt.Common.Primitives;

public sealed class PageList<T>
{
    public int Page { get; private set; }
    public int PageSize { get; private set; }
    public int TotalCount { get; private set; }
    public IEnumerable<T> Items { get; private set; } = new List<T>();

    public PageList(int page, int pageSize, int totalCount, IEnumerable<T> items)
    {
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
        Items = items;
    }

    public int TotalPages => TotalCount == 0 ? 0 : (int)Math.Ceiling(Items.Count() / (double)TotalCount);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}