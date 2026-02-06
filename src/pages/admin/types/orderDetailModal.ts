export type OrderItem = {
  product_id?: string;
  nombreProducto?: string;
  coverImage?: string;
  cantidad?: number;
  precio?: number;
};

export type CustomerInfo = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  birthday?: string | null;
  address?: {
    country?: string | null;
    department?: string | null;
    city?: string | null;
    address?: string | null;
    extra?: string | null;
  } | null;
};

export type OrderRow = {
  id: string;
  total?: number | null;
  status?: string | null;
  created_at?: string | null;
  items?: OrderItem[] | null;
  customer_info?: CustomerInfo | null;
};

export type OrderDetailModalProps = {
  order: OrderRow | null;
  open: boolean;
  onClose: () => void;
  onStatusChange?: (newStatus: string) => void;
};
