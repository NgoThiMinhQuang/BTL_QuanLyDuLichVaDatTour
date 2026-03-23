using Entity.Enums;

namespace Entity.Entities;

public class BangGiaLichKhoiHanh
{
    public ulong Id { get; set; }

    public ulong LichKhoiHanhId { get; set; }

    public LoaiKhach LoaiKhach { get; set; }

    public LoaiGiaApDung LoaiGia { get; set; }

    public decimal DonGia { get; set; }

    public string? MoTa { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public LichKhoiHanh? LichKhoiHanh { get; set; }
}
