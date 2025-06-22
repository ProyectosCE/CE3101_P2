using GymTec_api.Data;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using System.IO;
using System.Text.RegularExpressions;

// Load environment variables based on environment
var envFile = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production" 
    ? ".env.production" 
    : ".env.local";

if (File.Exists(envFile))
{
    Env.Load(envFile);
    Console.WriteLine($"Loaded environment file: {envFile}");
}
else
{
    Console.WriteLine($"Environment file not found: {envFile}");
}

var builder = WebApplication.CreateBuilder(args);

// Add environment variables to configuration
builder.Configuration.AddEnvironmentVariables();

// Configurar CORS
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

// Helper method to replace environment variables in connection strings
string ReplaceEnvironmentVariables(string connectionString)
{
    if (string.IsNullOrEmpty(connectionString))
        return connectionString;

    // Replace ${VARIABLE_NAME} with actual environment variable values
    return Regex.Replace(connectionString, @"\$\{([^}]+)\}", match =>
    {
        var variableName = match.Groups[1].Value;
        var value = Environment.GetEnvironmentVariable(variableName);
        if (string.IsNullOrEmpty(value))
        {
            Console.WriteLine($"Warning: Environment variable '{variableName}' not found");
            return match.Value; // Return original if not found
        }
        return value;
    });
}

// Registrar AppDbContext con la conexión correcta
if (builder.Environment.IsDevelopment())
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var resolvedConnectionString = ReplaceEnvironmentVariables(connectionString);
    
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(resolvedConnectionString));
}
else
{
    var connectionString = builder.Configuration.GetConnectionString("DockerContainerConnection");
    var resolvedConnectionString = ReplaceEnvironmentVariables(connectionString);
    
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(resolvedConnectionString));
        
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.ListenAnyIP(5000); // Solo HTTP
    });
}

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNginx");
app.UseAuthorization();
app.MapControllers();
app.Run();