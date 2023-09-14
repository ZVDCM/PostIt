using System;
using System.Threading.Tasks;
using PostIt.Common.Primitives.Validations;

namespace PostIt.Common.Primitives.Results;

public static class ResultExtensions
{
    public static Result<T> Ensure<T>(this Result<T> result, Func<T, bool> predicate, Error error)
    {
        if (result.IsFailure)
        {
            return result;
        }

        return result.IsSuccess && predicate(result.Value!) ? result : Result.Failure<T>(error);
    }

    public static Result<Tuple<T1, T2>> Join<T1, T2>(this Result<T1> result, T2 other)
        => result.IsSuccess ? Result.Success(Tuple.Create(result.Value!, other)) : Result.Failure<Tuple<T1, T2>>(result.Error);

    public static Result<Tuple<T1, T2, T3>> Join<T1, T2, T3>(this Result<Tuple<T1, T2>> result, T3 other)
        => result.IsSuccess ? Result.Success(Tuple.Create(result.Value!.Item1, result.Value!.Item2, other)) : Result.Failure<Tuple<T1, T2, T3>>(result.Error);

    public static Result<Tuple<T1, T2, T3, T4>> Join<T1, T2, T3, T4>(this Result<Tuple<T1, T2, T3>> result, T4 other)
        => result.IsSuccess ? Result.Success(Tuple.Create(result.Value!.Item1, result.Value!.Item2, result.Value!.Item3, other)) : Result.Failure<Tuple<T1, T2, T3, T4>>(result.Error);


    public static Result<T> Tap<T>(this Result<T> result, Action<Result<T>> action)
    {
        action(result);
        return result;
    }

    public static async Task<Result<T>> Tap<T>(this Task<Result<T>> resultTask, Action<Result<T>> action)
    {
        var result = await resultTask;
        action(result);
        return result;
    }
    public static async Task<Result> Tap(this Task<Result> resultTask, Action<Result> action)
    {
        var result = await resultTask;
        action(result);
        return result;
    }

    public static Result<TOut> Map<TIn, TOut>(
        this Result<TIn> result,
        Func<Result<TIn>, TOut> func)
        => result.IsSuccess ? Result.Success(func(result)) : Result.Failure<TOut>(result.Error);

    public static async Task<Result<TOut>> Map<TIn, TOut>(
        this Task<Result<TIn>> resultTask,
        Func<Result<TIn>, TOut> func)
    {
        var result = await resultTask;
        return result switch
        {
            { IsSuccess: true } => Result.Success(func(result)),
            IValidationResult validationResult => ValidationResult<TOut>.Failure(validationResult.Errors),
            _ => Result.Failure<TOut>(result.Error)
        };
    }

    public static async Task<Result<TOut>> Bind<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, Task<Result<TOut>>> func)
        => result switch
        {
            { IsSuccess: true } => await func(result.Value!),
            IValidationResult validationResult => ValidationResult<TOut>.Failure(validationResult.Errors),
            _ => Result.Failure<TOut>(result.Error)
        };

    public static async Task<Result<TOut>> Bind<TIn, TOut>(
       this Task<Result<TIn>> resultTask,
       Func<TIn, Task<Result<TOut>>> func)
    {
        var result = await resultTask;
        return result switch
        {
            { IsSuccess: true } => await func(result.Value!),
            IValidationResult validationResult => ValidationResult<TOut>.Failure(validationResult.Errors),
            _ => Result.Failure<TOut>(result.Error)
        };
    }

    public static async Task<Result> Bind<TIn>(
        this Result<TIn> result,
        Func<TIn, Task<Result>> func)
        => result switch
        {
            { IsSuccess: true } => await func(result.Value!),
            IValidationResult validationResult => ValidationResult.Failure(validationResult.Errors),
            _ => Result.Failure(result.Error)
        };

    public static async Task<Result> Bind<TIn>(
       this Task<Result<TIn>> resultTask,
       Func<TIn, Task<Result>> func)
    {
        var result = await resultTask;
        return result switch
        {
            { IsSuccess: true } => await func(result.Value!),
            IValidationResult validationResult => ValidationResult.Failure(validationResult.Errors),
            _ => Result.Failure(result.Error)
        };
    }

    public static async Task<TOut> Match<TIn, TOut>(
        this Task<Result<TIn>> resultTask,
        Func<TIn, TOut> onSuccess,
        Func<Result, TOut> onFailure)
    {
        var result = await resultTask;
        return result.IsSuccess ? onSuccess(result.Value!) : onFailure(result);
    }

    public static async Task<TOut> Match<TOut>(
        this Task<Result> resultTask,
        Func<TOut> onSuccess,
        Func<Result, TOut> onFailure)
    {
        var result = await resultTask;
        return result.IsSuccess ? onSuccess() : onFailure(result);
    }
}
