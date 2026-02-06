export type CrudProps = {
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
  disabled?: boolean;
  productName?: string | null;
};
