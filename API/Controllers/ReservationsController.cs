using API.Data.Services;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{

    public class ReservationsController : BaseAPIController
    {

        private readonly IReserveService _reserveService;

        public ReservationsController(IReserveService reserveService)
        {
            _reserveService = reserveService;

        }

        [HttpGet]
        public async Task<IEnumerable<ReservationDTO>> getReservations()
        {

            return await _reserveService.getReservations();

        }

        [HttpPost]
        public async Task<ActionResult<BookReservation>> addReservation(BookReservation reservation)
        {

            var result = await _reserveService.addReservation(reservation);

            if (result == null) return BadRequest("There was a problem when adding reservation!");

            return Ok(reservation);

        }

    }
}