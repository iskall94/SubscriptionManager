var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithDataVolume()
    .WithPgAdmin();

var subscriptionDb = postgres.AddDatabase("subscriptiondb");

var redis = builder.AddRedis("cache");

var api = builder.AddProject<Projects.SubscriptionManager_Api>("api")
    .WithReference(subscriptionDb)
    .WaitFor(subscriptionDb)
    .WithReference(redis)
    .WaitFor(redis);

builder.Build().Run();