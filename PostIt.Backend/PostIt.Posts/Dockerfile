FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-env
WORKDIR /app

COPY ./PostIt.Posts/NuGet.Config ./
COPY Packages ./packages

COPY PostIt.Posts/src/PostIt.Posts.Service/*.csproj ./
RUN dotnet restore

COPY PostIt.Posts/src/PostIt.Posts.Service ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "PostIt.Posts.Service.dll"]