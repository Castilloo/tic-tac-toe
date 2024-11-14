using ticTacToeSignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(option => 
{
    option.AddPolicy("MyPolicy", opt => opt
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowCredentials()
    );
});

builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseCors("MyPolicy");

app.MapHub<GameHub>("/gameHub");

app.Run();
