using MillionApi.Models;

namespace MillionApi.Services
{
  public interface IPropertyService
  {
    Task<List<Property>> GetAllPropertiesAsync();
    Task<Property?> GetPropertyByIdAsync(string id);
    Task<Property> CreatePropertyAsync(Property property);
    Task<Property?> UpdatePropertyAsync(string id, Property property);
    Task<bool> DeletePropertyAsync(string id);
    Task<List<Property>> SearchPropertiesAsync(string? search = null, string? propertyType = null,
        decimal? minPrice = null, decimal? maxPrice = null);
  }
}