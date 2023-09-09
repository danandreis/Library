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
                BookId = b.Id,
                Title = b.Title,
                Author = b.Author,
                AppUser = r.AppUser,
                StartDate = r.StartDate,
                EndDate = r.EndDate

            }).OrderBy(r => r.Title).ThenBy(r => r.StartDate).ToListAsync();

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

        public async Task<bool> cancelReservation(string id)
        {

            //In case of cancel reservation the selected reservation will be deleted

            var result = await _context.BookReservations.FirstOrDefaultAsync(r => r.Id == id);

            if (result == null) return false;

            _context.BookReservations.Remove(result);

            if (await _context.SaveChangesAsync() == 0) return false;

             //updates the dates for all the reservations that follows the one that is canceled - from today

            var reservations = await _context.BookReservations.Where(r=>r.StartDate > result.StartDate).
                                OrderBy(r=>r.StartDate).ToListAsync(); 

            int index = 0;
            foreach (var reservation in reservations)
            {
 
                reservation.StartDate = result.StartDate.AddDays(7 * index);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 2);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * index + 1);

                reservation.EndDate = result.StartDate.AddDays(7 * (index + 1) );

                if (reservation.EndDate.DayOfWeek.Equals(DayOfWeek.Sunday))
                    reservation.EndDate = DateTime.Now.AddDays(7 * (index + 1) + 2);

                if (reservation.StartDate.DayOfWeek.Equals(DayOfWeek.Saturday))
                    reservation.StartDate = DateTime.Now.AddDays(7 * (index + 1) + 1);

                _context.BookReservations.Update(reservation);

                index++;

            }

           await _context.SaveChangesAsync();

            return true;

        }

        public async Task<IEnumerable<BookReservation>> getReservationByBook(string id)
        {

            return await _context.BookReservations.Where(r => r.BookId == id).
                        OrderByDescending(r => r.EndDate).ToListAsync();

        }


    }
}