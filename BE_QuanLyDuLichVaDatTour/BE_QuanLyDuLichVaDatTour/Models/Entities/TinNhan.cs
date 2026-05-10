using System.ComponentModel.DataAnnotations.Schema;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class TinNhan
{
    public long Id { get; set; }

    public long BookingId { get; set; }

    public long NguoiGuiId { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public bool DaDoc { get; set; }

    public DateTime ThoiGianGui { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Booking? Booking { get; set; }

    public NguoiDung? NguoiGui { get; set; }
}
