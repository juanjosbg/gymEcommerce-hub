// src/components/Modal/LoginRequiredModal.tsx
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Props = { open: boolean; onClose: () => void };

const LoginRequiredModal = ({ open, onClose }: Props) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <img src="/Logo/logo-icon.png" alt="Logo" className="h-10 w-10 rounded-full" />
          <div>
            <DialogTitle>Ups</DialogTitle>
            <DialogDescription>Para guardar este producto como favorito debes iniciar sesión.</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="flex justify-end gap-3 pt-3">
        <button className="rounded-full border px-4 py-2 text-sm" onClick={onClose}>Cerrar</button>
        <a href="/auth/login" className="rounded-full bg-primary px-4 py-2 text-sm text-white">Iniciar sesión</a>
      </div>
    </DialogContent>
  </Dialog>
);
export default LoginRequiredModal;
