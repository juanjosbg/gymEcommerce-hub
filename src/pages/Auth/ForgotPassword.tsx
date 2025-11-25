import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse({ email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
        return;
      }

      setSent(true);
      toast.success('Email de recuperación enviado. Revisa tu correo.');
    } catch (error: any) {
      toast.error('Error al enviar email de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            {sent
              ? 'Revisa tu correo para continuar'
              : 'Ingresa tu email para recibir instrucciones'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de tu cuenta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>

              <div className="mt-4 text-center text-sm">
                <Link
                  to="/auth/login"
                  className="text-primary hover:underline"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Hemos enviado un enlace de recuperación a{' '}
                <strong>{email}</strong>. Revisa tu bandeja de entrada y sigue
                las instrucciones.
              </p>
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full"
              >
                Enviar nuevamente
              </Button>
              <div className="text-center text-sm">
                <Link
                  to="/auth/login"
                  className="text-primary hover:underline"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;