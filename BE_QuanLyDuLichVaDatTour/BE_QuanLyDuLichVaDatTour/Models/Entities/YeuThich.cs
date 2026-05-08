namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class YeuThich
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long TourId { get; set; }
    public DateTime CreatedAt { get; set; }
    public NguoiDung? User { get; set; }
    public Tour? Tour { get; set; }
}