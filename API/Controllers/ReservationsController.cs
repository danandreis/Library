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

        [HttpGet("{id}")]
        public async Task<IEnumerable<BookReservation>> getReservationByBook(string id)
        {

            return await _reserveService.getReservationByBook(id);
        }

        [HttpPost]
        public async Task<ActionResult<BookReservation>> addReservation(BookReservation reservation)
        {

            var result = await _reserveService.addReservation(reservation);

            if (result == null) return BadRequest("There was a problem when adding reservation!");

            return Ok(reservation);

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> cancelReservation(string id)
        {

            var result = await _reserveService.cancelReservation(id);

            if (!result) return BadRequest("There was a problem when canceling reservation!");

            return Ok(result);
        }

    }
}