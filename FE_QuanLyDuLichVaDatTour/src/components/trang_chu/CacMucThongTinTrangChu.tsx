import { MucGioiThieu } from '../home/MucGioiThieu'
import { MucLyDoChon } from '../home/MucLyDoChon'
import { MucDanhGia } from '../home/MucDanhGia'
import { MucTuVan } from '../home/MucTuVan'

export function CacMucThongTinTrangChu() {
  return (
    <>
      <MucGioiThieu />
      <MucLyDoChon />
      <MucDanhGia />
      <MucTuVan />
    </>
  )
}
