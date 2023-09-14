using System;

namespace PostIt.Common.Primitives;

public interface IAuditable
{
    DateTime CreatedOnUtc { get; init; }
    DateTime ModifiedOnUtc { get; init; }
}