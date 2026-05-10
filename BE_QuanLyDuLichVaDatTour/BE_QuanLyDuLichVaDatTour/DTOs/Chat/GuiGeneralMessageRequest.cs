using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Chat;

public class GuiGeneralMessageRequest
{
    [MaxLength(1000)]
    public string NoiDung { get; set; } = string.Empty;
}