using System.Collections.Generic;

namespace PostIt.Common.Primitives;

public sealed class Error : ValueObject
{
    public int? Status { get; private set; }
    public string Code { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;

    public Error(string code, string message, int? status = null)
    {
        Code = code;
        Message = message;
        Status = status;
    }

    public static implicit operator string(Error error) => error.Message ?? string.Empty;

    public static Error None => new(string.Empty, string.Empty);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Code;
        yield return Message;
    }
}