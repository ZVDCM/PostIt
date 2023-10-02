FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app

COPY ./PostIt.Users/NuGet.Config /app
COPY ./Packages /app/Packages

COPY ./PostIt.Users /app
RUN dotnet restore
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out /app
ENTRYPOINT ["dotnet", "PostIt.Users.Service.dll"]