using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using SubscriptionManager.Api.Infrastructure.Data;
using SubscriptionManager.Api.Infrastructure.Identity;
using SubscriptionManager.Api.Application.Common.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Aspire Services
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<SubscriptionDbContext>("subscriptiondb");
builder.AddRedisDistributedCache("cache");

// Identity Configuration
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<ApplicationUser>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<SubscriptionDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Hangfire setup
var connectionString = builder.Configuration.GetConnectionString("subscriptiondb");
builder.Services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));
builder.Services.AddHangfireServer();

var app = builder.Build();

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference();
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapIdentityApi<ApplicationUser>();

app.MapHangfireDashboard("/hangfire");

app.Run();