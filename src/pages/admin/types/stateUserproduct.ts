export type StateUserproductProps = {
  orderId: string;
  status?: string | null;
  onUpdated?: (newStatus: string) => void;
  disabled?: boolean;
};
