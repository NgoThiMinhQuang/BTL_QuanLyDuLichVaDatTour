namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class TourReviewSummaryDto
{
    public decimal AverageRating { get; set; }

    public int TotalReviews { get; set; }

    public int FiveStar { get; set; }

    public int FourStar { get; set; }

    public int ThreeStar { get; set; }

    public int TwoStar { get; set; }

    public int OneStar { get; set; }
}
