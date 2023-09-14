namespace PostIt.Common.Primitives.Results;

public class Result<TValue> : Result
{
    public TValue? Value { get; init; }

    protected internal Result(TValue? value, bool isSuccess, Error error)
        : base(isSuccess, error)
    {
        Value = value;
    }

    public static implicit operator Result<TValue>(TValue value) => Success(value);
}