using System.Collections.Generic;
using System.Net;

namespace PostIt.Common.Primitives.Validations;

public interface IValidationResult
{
    public static readonly Error ValidationError = new(
        "ValidationError",
        "a validation problem occurred",
        (int)HttpStatusCode.BadRequest);
    IEnumerable<Error> Errors { get; init; }
}