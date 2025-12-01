import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type CartItem as HookCartItem } from "@/hooks/useCart";
import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  CheckCircle2,
  Truck,
  ShieldCheck,
  TruckIcon,
  List,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setSelectedIds(cart.map((item) => item.id));
  }, [cart]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  const estimatedDiscount = 0;
  const total = subtotal - estimatedDiscount;
  const paymentLogos = [
    { key: "visa", src: "/logos-shop/visa.avif", alt: "Visa" },
    { key: "nequi", src: "/logos-shop/nequi.avif", alt: "Nequi" },
    { key: "pse", src: "/logos-shop/pse.avif", alt: "Pse" },
  ];

  const allSelected = cart.length > 0 && selectedIds.length === cart.length;
  const someSelected = selectedIds.length > 0;
  const statusTabs = [
    { key: "all", label: "Todos", count: cart.length },
    { key: "selected", label: "Seleccionado", count: selectedIds.length },
  ];

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map((item) => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderEmptyState = () => (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <TruckIcon className="h-5 w-5" />
          <span className="text-sm font-semibold">
            Envío gratuito (excluidos los artículos enviados por almacenes
            locales)
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-700">
          <div className="h-4 w-4 rounded-full border border-neutral-400" />
          <span>Seleccionar todo (0)</span>
        </div>

        <div className="mt-4 flex flex-col items-center justify-center rounded-lg border bg-white py-12 text-center shadow-sm">
          <ShoppingBag className="h-16 w-16 text-neutral-300 mb-3" />
          <h2 className="text-xl font-semibold text-neutral-700">
            El carrito de compras está vacío
          </h2>
          <p className="text-sm text-neutral-500 mb-5">
            Agrega tus artículos favoritos.
          </p>
          <Link to="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6">
              Ver los artículos en tendencia
            </Button>
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-700">
              Artículos no disponibles (0)
            </h3>
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              Ver todo
            </button>
          </div>
          <div className="flex gap-3 text-xs text-neutral-500">
            <div className="h-24 w-20 rounded-md border bg-neutral-100 flex items-center justify-center">
              Sin artículos
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-orange-200 shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-800">
                Resumen del pedido
              </h2>
              <span className="text-lg font-bold text-neutral-900">$0</span>
            </div>
            <p className="text-sm text-neutral-500">
              Consulta el monto final de tu pago real.
            </p>
            <Button className="w-full rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-5">
              Mín. de $59.000 para hacer el pedido
            </Button>
            <p className="text-xs text-neutral-500">
              La disponibilidad y el precio de los artículos no están
              garantizados hasta que se finalice el pago.
            </p>
            <div className="space-y-2 text-sm text-neutral-600">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                No se te cobrará hasta que revises este pedido en la página
                siguiente
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                Opciones de pago seguro
              </p>
              <p className="text-xs text-neutral-600">
                Seguimos los estándares PCI DSS, utilizamos cifrado sólido y
                revisiones periódicas para proteger tu privacidad.
              </p>
            </div>
            <div className="text-xs text-neutral-500 space-y-1">
              <p className="font-semibold text-neutral-700">
                1. Métodos de pago
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentLogos.map((logo) => (
                  <span
                    key={logo.key}
                    className="rounded border bg-white p-1 flex items-center justify-center"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="h-6 w-auto object-contain"
                    />
                  </span>
                ))}
              </div>
              <p className="font-semibold text-neutral-700">
                2. Certificación de seguridad
              </p>
              <div className="flex flex-wrap gap-2">
                {["SSL", "SafeKey", "3-D Secure"].map((m) => (
                  <span
                    key={m}
                    className="rounded border px-2 py-1 bg-white text-neutral-600"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Carrito de compras</h1>

        {cart.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold">
                    Envío especial gratis para ti
                  </p>
                  <p className="text-xs text-green-900/80">
                    Oferta exclusiva disponible en tu compra actual.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-neutral-800"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      someSelected
                        ? "border-black bg-black"
                        : "border-neutral-400"
                    }`}
                  >
                    {someSelected && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="font-semibold">Seleccionar todo</span>
                </button>
                {someSelected && (
                  <div className="flex items-center gap-3">
                    {statusTabs.map((tab, idx) => (
                      <button
                        key={tab.key}
                        onClick={() => {
                          if (tab.key === "all") {
                            setSelectedIds(cart.map((i) => i.id));
                          }
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                          idx === 1
                            ? "border-black text-black"
                            : "border-neutral-300 text-neutral-700"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="rounded-full border border-neutral-300 p-2 text-neutral-700 hover:bg-neutral-100"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      {menuOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border bg-white shadow-lg text-sm text-neutral-700">
                          <button
                            className="w-full px-3 py-2 text-left hover:bg-neutral-100"
                            onClick={() => {
                              setMenuOpen(false);
                              setManageOpen(true);
                            }}
                          >
                            Administrar carrito
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left hover:bg-neutral-100"
                            onClick={() => {
                              setMenuOpen(false);
                              setShareOpen(true);
                            }}
                          >
                            Compartir carrito
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {cart.map((item) => (
                <Card key={item.id} className="px-2 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative">
                        <button
                          onClick={() => toggleSelectItem(item.id)}
                          className="absolute -left-6 top-12 h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center"
                        >
                          {selectedIds.includes(item.id) && (
                            <span className="h-2.5 w-2.5 rounded-full bg-black" />
                          )}
                        </button>
                        <img
                          src={item.coverImage || "/placeholder.svg"}
                          alt={item.nombreProducto}
                          className="h-28 w-28 object-cover rounded-md bg-gray-50 border"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg leading-tight">
                          {item.nombreProducto}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                          Oferta limitada
                          <span className="inline-block h-1 w-16 rounded-full bg-[#c55252]" />
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Truck className="h-4 w-4" /> Entrega rápida
                          </span>
                          <span>Envío: Gratis</span>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center gap-2  border bg-neutral-50 px-2 rounded-full">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, (item.cantidad || 1) - 1)
                                )
                              }
                              disabled={(item.cantidad || 1) <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-10 text-center font-semibold">
                              {item.cantidad}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  (item.cantidad || 1) + 1
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right min-w-[140px]">
                        <p className="text-sm text-neutral-400 line-through">
                          ${(item.precio * 1.2).toFixed(0)}
                        </p>
                        <p className="text-2xl font-bold text-black">
                          ${(item.precio * (item.cantidad || 1)).toFixed(0)}
                        </p>
                        <p className="text-xs text-orange-600 font-semibold">
                          -20% aplicado
                        </p>
                        <p className="mt-2 text-xs text-neutral-500">
                          Cantidad: {item.cantidad}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Card className="border-primary/80 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-neutral-800">
                    Resumen del pedido
                  </h2>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">
                        Total de artículos:
                      </span>
                      <div className="text-right">
                        <p className="text-neutral-400 line-through">
                          ${(subtotal * 1.1).toFixed(0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">
                        Descuento de artículo(s):
                      </span>
                      <span className="font-semibold text-red-500">
                        -${estimatedDiscount.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-green-600">
                        ${total.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-xs text-green-700 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        Tu compra protegida. Si lo encuentras más barato, te lo
                        igualamos. ¡Compra ya!
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500">
                    Consulta el monto final de tu pago real.
                  </p>

                  <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white text-sm py-5">
                    Pagar ({totalItems}){" "}
                    <span className="text-white/60 ml-2">
                      -33,6% tiempo limitado
                    </span>
                  </Button>

                  <p className="text-xs text-neutral-500 flex items-start gap-2">
                    <span className="text-neutral-400 text-lg">ⓘ</span>
                    La disponibilidad y el precio de los artículos no están
                    garantizados hasta que se finalice el pago.
                  </p>

                  <p className="flex items-start gap-2 text-sm text-neutral-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    No se te cobrará hasta que revises este pedido en la página
                    siguiente
                  </p>

                  <div className="space-y-2 text-sm text-neutral-700">
                    <p className="flex items-start gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4 text-green-600 mt-0.5" />
                      Opciones de pago seguro
                    </p>
                    <p className="text-xs text-neutral-600">
                      Temu se compromete a proteger tu información de pago.
                      Seguimos los estándares PCI DSS, utilizamos un encriptado
                      sólido y realizamos revisiones periódicas del sistema para
                      proteger tu privacidad.
                    </p>
                    <p className="text-xs font-semibold text-neutral-700">
                      1. Métodos de pago
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {paymentLogos.map((logo) => (
                        <span
                          key={logo.key}
                          className="rounded p-1 flex items-center justify-center"
                        >
                          <img
                            src={logo.src}
                            alt={logo.alt}
                            className="h-6 w-auto object-contain"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        </div>
      </div>

      <ManageCartModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        items={cart}
        selectedIds={selectedIds}
        onToggleItem={toggleSelectItem}
        onSelectAll={toggleSelectAll}
      />
      <ShareCartModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        items={cart}
        selectedIds={selectedIds}
        onToggleItem={toggleSelectItem}
        onSelectAll={toggleSelectAll}
      />
    </>
  );
};

export default Cart;

// Modal Administrar carrito
const ManageCartModal: React.FC<{
  open: boolean;
  onClose: () => void;
  items: HookCartItem[];
  selectedIds: string[];
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
}> = ({ open, onClose, items, selectedIds, onToggleItem, onSelectAll }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Administrar carrito</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 px-6 py-4 items-center">
              <button
                onClick={() => onToggleItem(item.id)}
                className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center"
              >
                {selectedIds.includes(item.id) && (
                  <span className="h-2.5 w-2.5 rounded-full bg-black" />
                )}
              </button>
              <img
                src={item.coverImage || "/placeholder.svg"}
                alt={item.nombreProducto}
                className="h-36 w-36 rounded-md border object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm line-clamp-1">
                  {item.nombreProducto}
                </p>
                <p className="text-xs text-neutral-500 line-clamp-1">
                  Cantidad: {item.cantidad || 1}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-neutral-400 line-through">
                    ${(item.precio * 1.2).toFixed(0)}
                  </span>
                  <span className="text-base font-bold text-primary">
                    ${(item.precio * (item.cantidad || 1)).toFixed(0)}
                  </span>
                  <span className="text-xs text-primary border border-primary rounded px-1">
                    -20%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-800"
          >
            <span className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center">
              {selectedIds.length === items.length && items.length > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
              )}
            </span>
            Seleccionar todo
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:bg-neutral-100"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Compartir carrito
const ShareCartModal: React.FC<{
  open: boolean;
  onClose: () => void;
  items: HookCartItem[];
  selectedIds: string[];
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
}> = ({ open, onClose, items, selectedIds, onToggleItem, onSelectAll }) => {
  if (!open) return null;
  const shareItems = items.filter((i) => selectedIds.includes(i.id));
  const count = shareItems.length || items.length;
  const displayItems = shareItems.length ? shareItems : items;

  const shareButtons = [
    { key: "mail", label: "Email" },
    { key: "x", label: "X" },
    { key: "fb", label: "Facebook" },
    { key: "pin", label: "Pinterest" },
    { key: "link", label: "Link" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Compartir carrito</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y">
          {displayItems.map((item) => (
            <div key={item.id} className="flex gap-4 px-6 py-4 items-center">
              <button
                onClick={() => onToggleItem(item.id)}
                className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center"
              >
                {selectedIds.includes(item.id) && (
                  <span className="h-2.5 w-2.5 rounded-full bg-black" />
                )}
              </button>
              <img
                src={item.coverImage || "/placeholder.svg"}
                alt={item.nombreProducto}
                className="h-36 w-36 rounded-md border object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm line-clamp-1">
                  {item.nombreProducto}
                </p>
                <p className="text-xs text-neutral-500 line-clamp-1">
                  Cantidad: {item.cantidad || 1}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-neutral-400 line-through">
                    ${(item.precio * 1.2).toFixed(0)}
                  </span>
                  <span className="text-base font-bold text-primary">
                    ${(item.precio * (item.cantidad || 1)).toFixed(0)}
                  </span>
                  <span className="text-xs text-primary border border-primary rounded px-1">
                    -20%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-800"
          >
            <span className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center">
              {selectedIds.length === items.length && items.length > 0 && (
                <span className="h-2.5 w-2.5 rounded-full bg-black" />
              )}
            </span>
            Seleccionar todo
          </button>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span className="font-semibold text-neutral-700">Compartir en</span>
              <div className="flex items-center gap-2">
                {shareButtons.map((b) => (
                  <span
                    key={b.key}
                    className="h-8 w-8 rounded-full border border-neutral-300 flex items-center justify-center text-[11px] uppercase"
                  >
                    {b.label[0]}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-primary px-4 py-2 text-white text-sm font-semibold hover:bg-orange-600"
            >
              Compartir ahora ({count})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
