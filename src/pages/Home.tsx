import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Dumbbell } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container">
          <div className="flex flex-col items-center text-center space-y-6">
            <Dumbbell className="h-16 w-16 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FitMex Store
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Tu tienda de productos deportivos y equipamiento para gimnasio
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Nuestros Productos</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay productos disponibles aún
            </p>
            <p className="text-sm text-muted-foreground">
              Pronto agregaremos productos increíbles
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;