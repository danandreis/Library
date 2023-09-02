using API.Entities;
using API.Entities.DTO;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Services
{
    public class ReserveService : IReserveService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ReserveService(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;

        }

        public async Task<IEnumerable<ReservationDTO>> getReservations()
        {

            var reservationsList = await _context.Books.Join(_context.BookReservations, b => b.Id, r => r.BookId, (b, r) => new ReservationDTO
            {
                Id = r.Id,
                Title = b.Title,
                Author = b.Author,
                AppUser = r.AppUser,
                StartDate = r.StartDate,
                EndDate = r.EndDate

            }).OrderBy(r=>r.StartDate).ToListAsync();

            return reservationsList;

        }


        public async Task<BookReservation> addReservation(BookReservation reservation)
        {

            if (reservation == null) return null;

            reservation.Id = Guid.NewGuid().ToString();

            await _context.BookReservations.AddAsync(reservation);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return null;

            return reservation;

        }

        public Task<bool> cancelReservation(string bokoId)
        {
            throw new NotImplementedException();
        }

    }
}