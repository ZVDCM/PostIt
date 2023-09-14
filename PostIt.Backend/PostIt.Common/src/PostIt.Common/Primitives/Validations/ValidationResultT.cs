using System.Collections.Generic;
using PostIt.Common.Primitives.Results;

namespace PostIt.Common.Primitives.Validations;

public sealed class ValidationResult<T> : Result<T>, IValidationResult
{
    public IEnumerable<Error> Errors { get; init; }
    private ValidationResult(IEnumerable<Error> errors) : base(
        default!,
        false,
        IValidationResult.ValidationError)
    {
        Errors = errors;
    }

    public static ValidationResult<T> Failure(IEnumerable<Error> errors) => new(errors);
}