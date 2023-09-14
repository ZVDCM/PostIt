using System;
using System.Collections.Generic;
using System.Linq;

namespace PostIt.Common.Abstraction;

public abstract class Equatable : IEquatable<Equatable>
{
    protected static bool EqualOperator(Equatable left, Equatable right)
    {
        if (left is null || right is null)
        {
            return false;
        }
        return ReferenceEquals(left, right) || left.Equals(right);
    }

    protected static bool NotEqualOperator(Equatable left, Equatable right)
    {
        return !EqualOperator(left, right);
    }

    public static bool operator ==(Equatable one, Equatable two)
    {
        return EqualOperator(one, two);
    }

    public static bool operator !=(Equatable one, Equatable two)
    {
        return NotEqualOperator(one, two);
    }

    public bool Equals(Equatable? other)
    {
        if (other is null || GetType() != other.GetType())
        {
            return false;
        }

        return GetEqualityComponents().SequenceEqual(other.GetEqualityComponents());
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Equatable);
    }

    protected abstract IEnumerable<object> GetEqualityComponents();

    public override int GetHashCode()
    {
        return GetEqualityComponents()
            .Select(x => x != null ? x.GetHashCode() : 0)
            .Aggregate((x, y) => x ^ y);
    }
}