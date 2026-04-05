import { TuVanTrangChu } from './TuVanTrangChu'
import { GioiThieuTrangChu } from './GioiThieuTrangChu'
import { DanhGiaKhachHang } from './DanhGiaKhachHang'
import { LyDoChonChungToi } from './LyDoChonChungToi'

export function CacMucThongTinTrangChu() {
  return (
    <>
      <GioiThieuTrangChu />
      <LyDoChonChungToi />
      <DanhGiaKhachHang />
      <TuVanTrangChu />
    </>
  )
}
