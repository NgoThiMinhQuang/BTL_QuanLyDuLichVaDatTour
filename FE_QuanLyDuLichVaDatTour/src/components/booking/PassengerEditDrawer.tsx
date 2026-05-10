import { Drawer, Form, Input, DatePicker, Select, Button, message, Space } from 'antd'
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useAuthStore } from '../../store/authStore'
import { capNhatHanhKhach } from '../../services/booking/booking'
import type { BookingPassenger } from '../../services/booking/booking'

const { TextArea } = Input

interface PassengerEditDrawerProps {
  open: boolean
  bookingId: number
  passenger: BookingPassenger | null
  onClose: () => void
}

export function PassengerEditDrawer({ open, bookingId, passenger, onClose }: PassengerEditDrawerProps) {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && passenger) {
      form.setFieldsValue({
        hoTen: passenger.hoTen,
        ngaySinh: passenger.ngaySinh ? dayjs(passenger.ngaySinh) : null,
        gioiTinh: passenger.gioiTinh,
        soGiayTo: passenger.soGiayTo,
        quocTich: passenger.quocTich,
        ghiChu: passenger.ghiChu,
      })
    } else {
      form.resetFields()
    }
  }, [open, passenger, form])

  const onFinish = async (values: any) => {
    if (!passenger) return
    setSubmitting(true)
    try {
      await capNhatHanhKhach(bookingId, passenger.id, {
        hoTen: values.hoTen,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('DD/MM/YYYY') : undefined,
        gioiTinh: values.gioiTinh,
        soGiayTo: values.soGiayTo,
        quocTich: values.quocTich,
        ghiChu: values.ghiChu,
      })
      message.success('Cập nhật thông tin hành khách thành công')
      queryClient.invalidateQueries({ queryKey: ['booking-detail', bookingId] })
      onClose()
    } catch (error: any) {
      message.error(error.message || 'Cập nhật thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      title="Chỉnh sửa thông tin hành khách"
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" loading={submitting} onClick={() => form.submit()}>
            Lưu thay đổi
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="hoTen"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ tên' },
            { min: 2, message: 'Họ tên ít nhất 2 ký tự' },
            { max: 200, message: 'Họ tên tối đa 200 ký tự' },
          ]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item name="ngaySinh" label="Ngày sinh">
          <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
        </Form.Item>

        <Form.Item name="gioiTinh" label="Giới tính">
          <Select placeholder="Chọn giới tính" allowClear>
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
            <Select.Option value="Khác">Khác</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="soGiayTo" label="Số CCCD/CMND/Passport">
          <Input placeholder="012345678901" maxLength={50} />
        </Form.Item>

        <Form.Item name="quocTich" label="Quốc tịch">
          <Input placeholder="Việt Nam" />
        </Form.Item>

        <Form.Item name="ghiChu" label="Ghi chú">
          <TextArea rows={3} placeholder="Ghi chú thêm..." maxLength={300} showCount />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
