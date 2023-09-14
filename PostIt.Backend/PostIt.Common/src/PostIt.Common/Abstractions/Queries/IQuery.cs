using MediatR;

namespace PostIt.Common.Abstractions.Queries;

public interface IQuery<out TResponse> : IRequest<TResponse> { }