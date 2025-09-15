using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MillionApi.Models;

namespace MillionApi.Services
{
  public class MongoDbSettings
  {
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
  }

  public class PropertyService : IPropertyService
  {
    private readonly IMongoCollection<Property> _propertiesCollection;
    public IMongoCollection<Property> PropertiesCollection => _propertiesCollection;

    public PropertyService(IOptions<MongoDbSettings> mongoDbSettings)
    {
      var mongoClient = new MongoClient(mongoDbSettings.Value.ConnectionString);
      var mongoDatabase = mongoClient.GetDatabase(mongoDbSettings.Value.DatabaseName);
      _propertiesCollection = mongoDatabase.GetCollection<Property>("properties");
    }

    public async Task<List<Property>> GetAllPropertiesAsync()
    {
      return await _propertiesCollection
          .Find(p => p.IsActive)
          .ToListAsync();
    }

    public async Task<Property?> GetPropertyByIdAsync(string id)
    {
      return await _propertiesCollection
          .Find(p => p.Id == id && p.IsActive)
          .FirstOrDefaultAsync();
    }

    public async Task<Property> CreatePropertyAsync(Property property)
    {
      property.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
      property.CreatedDate = DateTime.UtcNow;
      property.UpdatedDate = DateTime.UtcNow;
      property.IsActive = true;

      await _propertiesCollection.InsertOneAsync(property);
      return property;
    }

    public async Task<Property?> UpdatePropertyAsync(string id, Property property)
    {
      property.Id = id;
      property.UpdatedDate = DateTime.UtcNow;

      var result = await _propertiesCollection
          .ReplaceOneAsync(p => p.Id == id && p.IsActive, property);

      return result.ModifiedCount > 0 ? property : null;
    }

    public async Task<bool> DeletePropertyAsync(string id)
    {
      var update = Builders<Property>.Update.Set(p => p.IsActive, false);
      var result = await _propertiesCollection
          .UpdateOneAsync(p => p.Id == id && p.IsActive, update);

      return result.ModifiedCount > 0;
    }

    public async Task<List<Property>> SearchPropertiesAsync(string? search = null, string? propertyType = null,
        decimal? minPrice = null, decimal? maxPrice = null)
    {
      var filterBuilder = Builders<Property>.Filter;
      var filters = new List<FilterDefinition<Property>>
            {
                filterBuilder.Eq(p => p.IsActive, true)
            };

      if (!string.IsNullOrWhiteSpace(search))
      {
        var searchFilter = filterBuilder.Or(
            filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")),
            filterBuilder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(search, "i")),
            filterBuilder.Regex(p => p.Description, new MongoDB.Bson.BsonRegularExpression(search, "i"))
        );
        filters.Add(searchFilter);
      }

      if (!string.IsNullOrWhiteSpace(propertyType))
      {
        filters.Add(filterBuilder.Eq(p => p.PropertyType, propertyType));
      }

      if (minPrice.HasValue)
      {
        filters.Add(filterBuilder.Gte(p => p.Price, minPrice.Value));
      }

      if (maxPrice.HasValue)
      {
        filters.Add(filterBuilder.Lte(p => p.Price, maxPrice.Value));
      }

      var combinedFilter = filterBuilder.And(filters);

      return await _propertiesCollection
          .Find(combinedFilter)
          .ToListAsync();
    }
  }
}