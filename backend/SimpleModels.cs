using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MillionApi.Models
{
  [BsonIgnoreExtraElements]
  public class Property
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    [Required]
    [StringLength(200)]
    public string Address { get; set; } = string.Empty;

    [BsonElement("price")]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [BsonElement("description")]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [BsonElement("bedrooms")]
    [Range(0, 100)]
    public int Bedrooms { get; set; }

    [BsonElement("bathrooms")]
    [Range(0, 100)]
    public int Bathrooms { get; set; }

    [BsonElement("squareFootage")]
    [Range(0, int.MaxValue)]
    public int SquareFootage { get; set; }

    [BsonElement("propertyType")]
    [Required]
    [StringLength(50)]
    public string PropertyType { get; set; } = string.Empty;

    [BsonElement("yearBuilt")]
    [Range(1800, 2100)]
    public int YearBuilt { get; set; }

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdDate")]
    public DateTime CreatedDate { get; set; }

    [BsonElement("updatedDate")]
    public DateTime UpdatedDate { get; set; }

    [BsonElement("ownerId")]
    [Required]
    public string OwnerId { get; set; } = string.Empty;

    [BsonElement("features")]
    public List<string>? Features { get; set; }

    [BsonElement("image")]
    public string Image { get; set; } = string.Empty;
  }

  public class Owner
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("email")]
    public string Email { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("photoUrl")]
    public string PhotoUrl { get; set; } = string.Empty;

    [BsonElement("createdDate")]
    public DateTime CreatedDate { get; set; }

    [BsonElement("updatedDate")]
    public DateTime UpdatedDate { get; set; }
  }

  public class PropertyImage
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("propertyId")]
    public string PropertyId { get; set; } = string.Empty;

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;

    [BsonElement("altText")]
    public string AltText { get; set; } = string.Empty;

    [BsonElement("isPrimary")]
    public bool IsPrimary { get; set; }

    [BsonElement("uploadedDate")]
    public DateTime UploadedDate { get; set; }
  }
}