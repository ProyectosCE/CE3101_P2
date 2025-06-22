using GymTec_api.Data;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Cargar archivo de entorno manualmente
string envFilePath = builder.Environment.IsDevelopment()
    ? ".env.local"
    : "Docker/.env.production";

if (File.Exists(envFilePath))
{
    foreach (var line in File.ReadAllLines(envFilePath))
    {
        if (!string.IsNullOrWhiteSpace(line) && !line.Trim().StartsWith("#"))
        {
            var parts = line.Split('=', 2);
            if (parts.Length == 2)
            {
                Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
            }
        }
    }
}

// Expansión manual de variables de entorno en appsettings.json
foreach (var section in builder.Configuration.GetSection("ConnectionStrings").GetChildren())
{
    var value = section.Value;
    if (!string.IsNullOrWhiteSpace(value) && value.Contains("${"))
    {
        string expanded = Environment.ExpandEnvironmentVariables(value);
        builder.Configuration[section.Path] = expanded;
    }
}

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

// Registrar AppDbContext con la conexión correcta
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(builder.Configuration.GetConnectionString("DockerContainerConnection")));

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
