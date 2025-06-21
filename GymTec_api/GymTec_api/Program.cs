using GymTec_api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Configurar Kestrel para solo HTTP


// En Program.cs
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
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Registrar AppDbContext antes de builder.Build()
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
        options.ListenAnyIP(5000); // Solo HTTP en puerto 5000
    });
}

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    //app.UseHttpsRedirection();

}

app.UseCors("AllowNginx");

app.UseAuthorization();

app.MapControllers();

app.Run();
