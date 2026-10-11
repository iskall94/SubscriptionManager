using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SubscriptionManager.Api.Domain.DTOs;
using SubscriptionManager.Api.Services;
using System.Security.Claims;

namespace SubscriptionManager.Api.Controllers;

[Authorize]
[ApiController]
[Route("api")]
public class PaymentHistoryController : ControllerBase
{
    private readonly IPaymentHistoryService _paymentService;

    public PaymentHistoryController(IPaymentHistoryService paymentService)
    {
        _paymentService = paymentService;
    }

    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("payments")]
    public async Task<IActionResult> GetAllPayments()
    {
        var payments = await _paymentService.GetAllForUserAsync(UserId);
        return Ok(payments);
    }

    [HttpGet("subscriptions/{subscriptionId:int}/payments")]
    public async Task<IActionResult> GetBySubscription(int subscriptionId)
    {
        var payments = await _paymentService.GetBySubscriptionIdAsync(subscriptionId, UserId);
        return Ok(payments);
    }

    [HttpPost("subscriptions/{subscriptionId:int}/payments")]
    public async Task<IActionResult> Create(int subscriptionId, [FromBody] CreatePaymentHistoryDto dto)
    {
        var response = await _paymentService.CreateAsync(subscriptionId, dto, UserId);

        if (response is null)
        {
            return NotFound("Subscription not found.");
        }

        return Ok(response);
    }

    [HttpPatch("payments/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
    {
        var response = await _paymentService.UpdateStatusAsync(id, dto, UserId);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }

    [HttpDelete("payments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _paymentService.DeleteAsync(id, UserId);

        if (!success)
        {
            return NotFound();
        }

        return NoContent();
    }
}
