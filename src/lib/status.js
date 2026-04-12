export function getPaymentStatusLabel(status) {
  switch (status) {
    case 'paid':
      return 'Sukses';
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Gagal';
    case 'expired':
      return 'Kedaluwarsa';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status || '-';
  }
}

export function getOrderStatusLabel(status) {
  switch (status) {
    case 'processing':
      return 'Dalam Proses';
    case 'completed':
      return 'Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    default:
      return status || '-';
  }
}
