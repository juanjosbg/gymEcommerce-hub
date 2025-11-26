import { db } from "@/firebase/config";
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";

export const addToWishlist = async (userId: string, product: any) => {
  if (!product || !product.id) {
    throw new Error("El producto no tiene id");
  }
  await setDoc(
    doc(db, "users", userId, "wishlist", product.id),
    {
      id: product.id ?? "",
      nombreProducto: product.nombreProducto ?? product.shoeName ?? "",
      shoeName: product.shoeName ?? "",
      precio: product.precio ?? product.currentPrice ?? 0,
      currentPrice: product.currentPrice ?? 0,
      previousPrice: product.previousPrice ?? 0,
      shoeCategory: product.shoeCategory ?? "",
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      pieces_sold: product.pieces_sold ?? 0,
      justIn: product.justIn ?? false,
      slug: product.slug ?? "",
      overview: product.overview ?? "",
      coverImage: typeof product.coverImage === "string"
        ? product.coverImage
        : product.coverImage?.src || "",
    }
  );
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  await deleteDoc(doc(db, "users", userId, "wishlist", productId));
};

export const subscribeToWishlist = (userId: string, callback: (items: any[]) => void) => {
  return onSnapshot(
    collection(db, "users", userId, "wishlist"),
    (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(items);
    }
  );
};