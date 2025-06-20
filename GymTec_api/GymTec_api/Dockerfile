FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["GymTec_api/GymTec_api.csproj", "GymTec_api/"]
RUN dotnet restore "GymTec_api/GymTec_api.csproj"
COPY . .
WORKDIR "/src/GymTec_api"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "GymTec_api.dll"]
