import { Bluetooth, Camera, Images, LocateFixed, Mic, PhoneOff, Lock, LucideIcon } from "lucide-react";

type PermisoItem = {
  title: string;
  icon: LucideIcon;
  desc: string;
};

export const items: PermisoItem[] = [
  {
    title: "Contactos",
    icon: PhoneOff,
    desc:
      "No solicitamos acceso a tus contactos en el navegador. Solo usamos permisos que otorgues explícitamente al navegador.",
  },
  {
    title: "Bluetooth",
    icon: Bluetooth,
    desc:
      "No pedimos conectarnos por Bluetooth. Si tu navegador pide permisos, depende de su configuración local.",
  },
  {
    title: "Micrófono",
    icon: Mic,
    desc:
      "No requerimos tu micrófono en el navegador. El acceso solo ocurre si el navegador lo solicita para alguna acción puntual.",
  },
  {
    title: "Ubicación",
    icon: LocateFixed,
    desc:
      "No solicitamos tu ubicación. En algunos países el navegador podría pedirla para autocompletar direcciones; depende del permiso que otorgues allí.",
  },
  {
    title: "Fotos",
    icon: Images,
    desc:
      "No pedimos acceso a tu galería. Si subes imágenes, el navegador te solicitará permiso y solo usaremos lo que aceptes.",
  },
  {
    title: "Cámara",
    icon: Camera,
    desc:
      "No pedimos usar tu cámara. En acciones como subir una foto, el navegador te pedirá permiso y solo se usará bajo tu aprobación.",
  },
  {
    title: "Otros",
    icon: Lock,
    desc:
      "No accedemos a otros recursos del dispositivo (calendario, recordatorios, etc.). Solo lo que el navegador permita explícitamente.",
  },
];

export default items;
