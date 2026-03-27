using Entity.Entities;

namespace DAL.Interfaces;

public interface IAnhTourRepository
{
    Task<List<AnhTour>> GetByTourIdAsync(long tourId);

    Task<AnhTour?> GetByIdAsync(long id);

    Task<AnhTour?> GetTrackedByIdAsync(long id);

    Task<AnhTour?> GetAvatarByTourIdAsync(long tourId);

    Task AddAsync(AnhTour anhTour);

    Task<int> SaveChangesAsync();
}
