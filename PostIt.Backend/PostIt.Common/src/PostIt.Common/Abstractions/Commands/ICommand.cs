using MediatR;

namespace PostIt.Common.Abstractions.Commands;

public interface ICommand<out TResponse> : IRequest<TResponse> { }