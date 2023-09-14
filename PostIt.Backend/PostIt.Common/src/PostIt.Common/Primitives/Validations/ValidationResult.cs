using System.Collections.Generic;
using PostIt.Common.Primitives.Results;

namespace PostIt.Common.Primitives.Validations;

public sealed class ValidationResult : Result, IValidationResult
{
    public IEnumerable<Error> Errors { get; init; }

    private ValidationResult(IEnumerable<Error> errors) : base(
        false,
        IValidationResult.ValidationError)
    {
        Errors = errors;
    }

    public static ValidationResult Failure(IEnumerable<Error> errors) => new(errors);
}