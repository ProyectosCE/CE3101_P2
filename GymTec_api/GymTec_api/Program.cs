using GymTec_api.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using System.Text.RegularExpressions;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Solo en desarrollo: cargar .env.local
if (builder.Environment.IsDevelopment())
{
    const string devEnvFile = ".env.local";
    if (File.Exists(devEnvFile))
    {
        Env.Load(devEnvFile);
        Console.WriteLine($"Loaded environment file: {devEnvFile}");
    }
    else
    {
        Console.WriteLine($"Environment file not found: {devEnvFile}");
    }
}

// 🔹 Añadir variables de entorno a la configuración
builder.Configuration.AddEnvironmentVariables();

// 🔹 Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNginx", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔹 Método para reemplazar ${VAR} en connection string
string ReplaceEnvironmentVariables(string connectionString)
{
    if (string.IsNullOrEmpty(connectionString))
        return connectionString;

    return Regex.Replace(connectionString, @"\$\{([^}]+)\}", match =>
    {
        var variableName = match.Groups[1].Value;
        var value = Environment.GetEnvironmentVariable(variableName);
        if (string.IsNullOrEmpty(value))
        {
            Console.WriteLine($"⚠️ Warning: Environment variable '{variableName}' not found");
            return match.Value;
        }
        return value;
    });
}

// 🔹 Elegir la cadena según entorno
var connectionKey = builder.Environment.IsDevelopment() ? "DefaultConnection" : "DockerContainerConnection";
var rawConnectionString = builder.Configuration.GetConnectionString(connectionKey);
var resolvedConnectionString = ReplaceEnvironmentVariables(rawConnectionString);

// 🔹 Registrar contexto con cadena resuelta
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(resolvedConnectionString));

// 🔹 Configurar Kestrel solo en producción
if (!builder.Environment.IsDevelopment())
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(5000); // Solo HTTP
    });
}

var app = builder.Build();

// 🔹 Pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNginx");
app.UseAuthorization();
app.MapControllers();
app.Run();
