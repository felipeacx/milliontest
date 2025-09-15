using Microsoft.AspNetCore.Mvc;
using MillionApi.Models;
using MillionApi.Services;

namespace MillionApi.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class PropertiesController(IPropertyService propertyService, ILogger<PropertiesController> logger) : ControllerBase
  {
    private readonly IPropertyService _propertyService = propertyService;
    private readonly ILogger<PropertiesController> _logger = logger;

    [HttpGet]
    public async Task<ActionResult<List<Property>>> GetProperties(
        [FromQuery] string? search = null,
        [FromQuery] string? propertyType = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null)
    {
      try
      {
        List<Property> properties;

        if (!string.IsNullOrWhiteSpace(search) || !string.IsNullOrWhiteSpace(propertyType) ||
            minPrice.HasValue || maxPrice.HasValue)
        {
          properties = await _propertyService.SearchPropertiesAsync(search, propertyType, minPrice, maxPrice);
        }
        else
        {
          properties = await _propertyService.GetAllPropertiesAsync();
        }

        return Ok(properties);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred in GetProperties");
        return StatusCode(500, "Internal server error");
      }
    }

    [HttpGet("health")]
    public ActionResult GetHealth()
    {
      return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    [HttpGet("test")]
    public ActionResult GetTest()
    {
      return Ok("API is working");
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Property>> GetProperty(string id)
    {
      try
      {
        var property = await _propertyService.GetPropertyByIdAsync(id);
        if (property == null)
        {
          return NotFound();
        }
        return Ok(property);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred in GetProperty");
        return StatusCode(500, "Internal server error");
      }
    }

    [HttpPost]
    public async Task<ActionResult<Property>> CreateProperty([FromBody] Property property)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var createdProperty = await _propertyService.CreatePropertyAsync(property);
        return CreatedAtAction(nameof(GetProperty), new { id = createdProperty.Id }, createdProperty);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred in CreateProperty");
        return StatusCode(500, "Internal server error");
      }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Property>> UpdateProperty(string id, [FromBody] Property property)
    {
      try
      {
        if (!ModelState.IsValid)
        {
          return BadRequest(ModelState);
        }

        var updatedProperty = await _propertyService.UpdatePropertyAsync(id, property);
        if (updatedProperty == null)
        {
          return NotFound();
        }

        return Ok(updatedProperty);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred in UpdateProperty");
        return StatusCode(500, "Internal server error");
      }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProperty(string id)
    {
      try
      {
        var deleted = await _propertyService.DeletePropertyAsync(id);
        if (!deleted)
        {
          return NotFound();
        }

        return NoContent();
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Error occurred in DeleteProperty");
        return StatusCode(500, "Internal server error");
      }
    }
  }
}