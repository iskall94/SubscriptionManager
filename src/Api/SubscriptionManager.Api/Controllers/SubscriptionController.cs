using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Services;
using System.Security.Claims;

namespace SubscriptionManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/subscriptions")]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subscriptions = await _subscriptionService.GetAllAsync(UserId);
        return Ok(subscriptions);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subscription = await _subscriptionService.GetByIdAsync(id, UserId);

        if (subscription is null)
        {
            return NotFound();
        }

        return Ok(subscription);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSubscriptionDto dto)
    {
        var response = await _subscriptionService.CreateAsync(dto, UserId);

        if (response is null)
        {
            return BadRequest("Category not found.");
        }

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _subscriptionService.DeleteAsync(id, UserId);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSubscriptionDto dto)
    {
        var response = await _subscriptionService.UpdateAsync(id, dto, UserId);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }
}