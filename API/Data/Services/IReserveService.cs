using API.Entities;
using API.Entities.DTO;

namespace API.Data.Services
{
    public interface IReserveService
    {

        Task<IEnumerable<ReservationDTO>> getReservations();
        Task<BookReservation> addReservation(BookReservation reservation);
        Task<bool> cancelReservation(string bokoId);

    }
}