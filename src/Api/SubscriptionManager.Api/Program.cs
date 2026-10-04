//using Hangfire;
//using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using SubscriptionManager.Api.Infrastructure;
using SubscriptionManager.Api.Infrastructure.Data;
using SubscriptionManager.Api.Infrastructure.Data.Repositories;
using SubscriptionManager.Api.Infrastructure.Identity;
using SubscriptionManager.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Aspire Services
builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<SubscriptionDbContext>("subscriptiondb");

//builder.AddRedisDistributedCache("cache");

// Identity Configuration
builder.Services.AddAuthentication(IdentityConstants.BearerScheme);
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
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Hangfire setup
//var connectionString = builder.Configuration.GetConnectionString("subscriptiondb");
//builder.Services.AddHangfire(config => config
//    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
//    .UseSimpleAssemblyNameTypeSerializer()
//    .UseRecommendedSerializerSettings()
//    .UsePostgreSqlStorage(options => options.UseNpgsqlConnection(connectionString)));
//builder.Services.AddHangfireServer();

// Dependency Injection for Repositories and Services
builder.Services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseExceptionHandler();

app.MapScalarApiReference();
app.MapOpenApi();

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGroup("/api").MapIdentityApi<ApplicationUser>();

//app.MapHangfireDashboard("/hangfire");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SubscriptionDbContext>();

    await db.Database.MigrateAsync();

    // Applying migrations at startup using Aspire
    if (app.Environment.IsDevelopment())
    {
        await DbSeeding.SeedAsync(app.Services);
    }
}

app.Run();