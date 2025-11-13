export const getStatusInfo = (status: string) => {
  const statusMap: { [key: string]: { label: string; color: string } } = {
    pending: { label: "Chờ xác nhận", color: "#FF9800" },
    accept: { label: "Đã chấp nhận", color: "#2196F3" },
    deposited: { label: "Đã đặt cọc", color: "#9C27B0" },
    completed: { label: "Hoàn thành", color: "#4CAF50" },
    paid: { label: "Đã thanh toán", color: "#4CAF50" },
    canceled: { label: "Đã hủy", color: "#F44336" },
  };
  return statusMap[status] || { label: status, color: "#666" };
};
export const getPaymentInfo = (status?: string) => {
  const s = (status || "").toLowerCase();
  const map: { [key: string]: { label: string; color: string; icon: any } } = {
    pending: {
      label: "Chờ thanh toán",
      color: "#FF9800",
      icon: "time-outline",
    },
    paid: {
      label: "Đã thanh toán",
      color: "#4CAF50",
      icon: "checkmark-circle",
    },
    cancelled: {
      label: "Đã hủy thanh toán",
      color: "#F44336",
      icon: "close-circle",
    },
    failed: {
      label: "Thanh toán thất bại",
      color: "#D32F2F",
      icon: "alert-circle",
    },
    timeout: {
      label: "Quá hạn thanh toán",
      color: "#D32F2F",
      icon: "alert-circle",
    },
  };
  return (
    map[s] || {
      label: status || "Không xác định",
      color: "#999",
      icon: "help-circle",
    }
  );
};
