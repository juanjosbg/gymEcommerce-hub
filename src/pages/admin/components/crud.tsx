import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

type CrudProps = {
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
  disabled?: boolean;
  productName?: string | null;
};

const CrudActions = ({
  onEdit,
  onDelete,
  disabled,
  productName,
}: CrudProps) => {
  const handleDelete = async () => {
    if (disabled) return;
    const nameLabel = productName ? `${productName}` : "este producto";
    const result = await Swal.fire({
      title: `¿Estas seguro de que quieres eliminar ${nameLabel}?`,
      html: "Si lo eliminas, se borrará toda su información. ¿Estás seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
      showClass: {
        popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
    `,
      },
      hideClass: {
        popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
    `,
      },
    });

    if (result.isConfirmed) {
      await onDelete();
      await Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto eliminado exitosamente",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        className="hover:border hover:border-neutral-200 hover:rounded-full hover:shadow-sm p-2 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        title="Editar"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={disabled}
        className="hover:border hover:border-neutral-200 hover:rounded-full hover:shadow-sm p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
        title="Eliminar"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CrudActions;
