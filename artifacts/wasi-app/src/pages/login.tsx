import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useLogin } from '@workspace/api-client-react';
import { useAuth } from '@/lib/auth-context';
import { Button, Input, Card } from '@/components/ui-components';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login: authenticate } = useAuth();
  const [, setLocation] = useLocation();

  const { mutate: login, isPending } = useLogin({
    mutation: {
      onSuccess: (data) => {
        authenticate(data.token);
      },
      onError: (err) => {
        setErrorMsg((err as any)?.data?.error || 'بيانات الدخول غير صحيحة');
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    login({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-islamic-pattern p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Islamic Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-4xl font-display font-bold text-foreground mb-3">وصي</h1>
          <p className="text-muted-foreground text-lg">منصتك الآمنة لحفظ وصيتك وإرثك الرقمي</p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-background/90 border-t-4 border-t-accent">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Lock className="text-accent" />
            تسجيل الدخول
          </h2>

          {errorMsg && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm border border-destructive/20 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="البريد الإلكتروني"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              dir="ltr"
            />
            
            <Input
              label="كلمة المرور"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
            />

            <Button type="submit" className="w-full mt-2" isLoading={isPending}>
              الدخول لخزنتك
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              أنشئ حسابك الآن
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
