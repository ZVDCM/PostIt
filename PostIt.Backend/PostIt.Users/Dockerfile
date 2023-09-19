FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app

COPY ./PostIt.Users/NuGet.Config ./
COPY Packages ./Packages

COPY PostIt.Users/src/PostIt.Users.Service/*.csproj ./
RUN dotnet restore

COPY PostIt.Users/src/PostIt.Users.Service ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "PostIt.Users.Service.dll"]