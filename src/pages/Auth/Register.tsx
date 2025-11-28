import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';

import HeroPort from "../../../public/Logo/apple-icon.png"

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registerSchema.safeParse({ fullName, email, password, confirmPassword });
    if (!validation.success) {
      const message = validation.error.errors[0]?.message ?? 'Revisa los datos ingresados.';
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message,
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);

      if (error) {
        const message = error.message.includes('already registered')
          ? 'Este email ya está registrado'
          : error.message;
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: message,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        return;
      }

      const result = await Swal.fire({
        background: '#0f0f0f',
        color: '#ffffff',
        title: `HOLA ${fullName.trim() ? fullName.trim().toUpperCase() : 'AMIGO'}!`,
        html: `
          Bienvenido a <span style="color:#ef4444;font-weight:800;">FITMEX STORE</span>.<br/>
          ¿Deseas recibir mensajes de productos en descuento y nuestras promociones?
        `,
        imageUrl: HeroPort,
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showCancelButton: true,
        confirmButtonText: '¡Acepto!',
        cancelButtonText: 'No aceptar',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        padding: '1.5rem',
      });

      const consent = result.isConfirmed ? 'accepted' : 'declined';
      localStorage.setItem('marketingConsent', consent);
      navigate('/');
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al crear la cuenta',
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Regístrate para comenzar a comprar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link
              to="/auth/login"
              className="text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
