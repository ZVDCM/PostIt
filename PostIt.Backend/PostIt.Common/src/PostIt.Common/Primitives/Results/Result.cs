using System;

namespace PostIt.Common.Primitives.Results;

public class Result
{
    public bool IsSuccess { get; init; }
    public Error Error { get; init; }
    public bool IsFailure => !IsSuccess;

    protected Result(bool isSuccess, Error error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success()
        => new(true, Error.None);

    public static Result<TValue> Success<TValue>()
        => new(default!, true, Error.None);

    public static Result<TValue> Success<TValue>(TValue value)
        => new(value, true, Error.None);

    public static Result<TValue> Create<TValue>(TValue? value, Error error)
        => value switch
        {
            Guid guid => guid == Guid.Empty ? Failure<TValue>(error) : Success(value),
            string s => string.IsNullOrEmpty(s) ? Failure<TValue>(error) : Success(value),
            _ => value is null ? Failure<TValue>(error) : Success(value)
        };

    public static Result Failure(Error error)
        => new(false, error);

    public static Result<TValue> Failure<TValue>(Error error)
        => new(default!, false, error);
}