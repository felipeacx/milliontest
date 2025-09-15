using MongoDB.Driver;
using MillionApi.Models;
using MillionApi.Services;

namespace MillionApi.Data
{
  public static class SeedData
  {
    public static async Task SeedAsync(IMongoCollection<Property> collection)
    {
      // Check if data already exists
      var existingCount = await collection.CountDocumentsAsync(FilterDefinition<Property>.Empty);
      if (existingCount > 0)
      {
        Console.WriteLine("Database already contains data. Skipping seed.");
        return;
      }

      var sampleProperties = new List<Property>
            {
                new Property
                {
                    Name = "Modern Apartment",
                    Address = "123 Main St, Downtown",
                    Price = 350000,
                    Description = "A beautiful modern apartment in the heart of downtown.",
                    Bedrooms = 2,
                    Bathrooms = 2,
                    SquareFootage = 1200,
                    PropertyType = "Apartment",
                    YearBuilt = 2020,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow.AddDays(-30),
                    UpdatedDate = DateTime.UtcNow.AddDays(-5),
                    OwnerId = "1",
                    Image = "/images/apt1.jpg"
                },
                new Property
                {
                    Name = "Luxury Villa",
                    Address = "456 Oak Avenue, Suburbs",
                    Price = 850000,
                    Description = "Spacious luxury villa with garden and pool.",
                    Bedrooms = 4,
                    Bathrooms = 3,
                    SquareFootage = 3200,
                    PropertyType = "House",
                    YearBuilt = 2018,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow.AddDays(-60),
                    UpdatedDate = DateTime.UtcNow.AddDays(-10),
                    OwnerId = "2",
                    Image = "/images/villa2.jpg"
                },
                new Property
                {
                    Name = "Studio Loft",
                    Address = "789 Pine Street, Arts District",
                    Price = 250000,
                    Description = "Cozy studio loft in the trendy arts district.",
                    Bedrooms = 1,
                    Bathrooms = 1,
                    SquareFootage = 800,
                    PropertyType = "Loft",
                    YearBuilt = 2015,
                    IsActive = true,
                    CreatedDate = DateTime.UtcNow.AddDays(-20),
                    UpdatedDate = DateTime.UtcNow.AddDays(-2),
                    OwnerId = "1",
                    Image = "/images/loft1.jpg"
                }
            };

      await collection.InsertManyAsync(sampleProperties);
      Console.WriteLine($"Seeded {sampleProperties.Count} properties to the database.");
    }

    public static async Task InitializeDatabaseAsync(IServiceProvider serviceProvider)
    {
      using var scope = serviceProvider.CreateScope();
      var propertyService = scope.ServiceProvider.GetRequiredService<IPropertyService>();

      if (propertyService is PropertyService mongoService)
      {
        var collection = mongoService.PropertiesCollection;
        await SeedAsync(collection);
      }
    }
  }
}