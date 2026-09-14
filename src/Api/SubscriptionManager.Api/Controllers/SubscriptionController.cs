using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Domain.Entities;
using SubscriptionManager.Api.Infrastructure.Data;
using System.Security.Claims;

namespace SubscriptionManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SubscriptionController : ControllerBase
{
	private readonly SubscriptionDbContext _db;
	public SubscriptionController(SubscriptionDbContext db)
	{
		_db = db;
	}

	private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

	[HttpGet]
	public async Task<IActionResult> GetAll()
	{
		var subscriptions = await _db.Subscriptions
			.AsNoTracking()
			.Where(s => s.UserId == UserId)
			.Select(s => new SubscriptionResponseDto(
				s.Id,
				s.Name,
				s.Price,
				s.Currency,
				s.Interval,
				s.NextBillingDate,
				s.IsActive,
				s.CategoryId,
				s.Category.Name
			))
			.ToListAsync();

		return Ok(subscriptions);
	}

	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetById(int id)
	{
		var subscription = await _db.Subscriptions
			.AsNoTracking()
			.Where(s => s.Id == id && s.UserId == UserId)
			.Select(s => new SubscriptionResponseDto(
				s.Id,
				s.Name,
				s.Price,
				s.Currency,
				s.Interval,
				s.NextBillingDate,
				s.IsActive,
				s.CategoryId,
				s.Category.Name
			))
			.FirstOrDefaultAsync();

		if (subscription is null)
		{
			return NotFound();
		}

		return Ok(subscription);
	}

	[HttpPost] 
	public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
	{
		var category = await _db.Categories.FindAsync(dto.CategoryId);

		if (category is null)
		{
			return BadRequest("Category not found.");
		}

		var sub = new Subscription
		{
			Name = dto.Name,
			Price = dto.Price,
			Currency = dto.Currency,
			Interval = dto.Interval,
			NextBillingDate = dto.NextBillingDate,
			CategoryId = dto.CategoryId,
			UserId = UserId,
			IsActive = true,
			Created = DateTime.UtcNow
		};

		_db.Subscriptions.Add(sub);
		await _db.SaveChangesAsync();

		var response = new SubscriptionResponseDto(
			sub.Id,
			sub.Name,
			sub.Price,
			sub.Currency,
			sub.Interval,
			sub.NextBillingDate,
			sub.IsActive,
			sub.CategoryId,
			category.Name
		);

		return CreatedAtAction(nameof(GetById), new { id = sub.Id }, response);
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id)
	{
		var subscription = await _db.Subscriptions
			.FirstOrDefaultAsync(s => s.Id == id && s.UserId == UserId);

		if (subscription is null) 
		{ 
			return NotFound();
		}

		_db.Subscriptions.Remove(subscription);
		await _db.SaveChangesAsync();

		return NoContent();
	}
}