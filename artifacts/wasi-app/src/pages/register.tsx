import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useRegister } from '@workspace/api-client-react';
import { useAuth } from '@/lib/auth-context';
import { Button, Input, Card } from '@/components/ui-components';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { login: authenticate } = useAuth();
  const [, setLocation] = useLocation();

  const { mutate: register, isPending } = useRegister({
    mutation: {
      onSuccess: (data) => {
        authenticate(data.token);
      },
      onError: (err) => {
        setErrorMsg((err as any)?.data?.error || 'حدث خطأ أثناء إنشاء الحساب');
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    register({ data: formData });
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
        className="w-full max-w-md relative z-10 py-8"
      >
        <div className="text-center mb-8">
          <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground">"كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ إِن تَرَكَ خَيْرًا الْوَصِيَّةُ"</p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-background/90 border-t-4 border-t-accent">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <UserPlus className="text-accent" />
            بيانات الحساب
          </h2>

          {errorMsg && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm border border-destructive/20 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="الاسم الكامل"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="أحمد محمد"
            />

            <Input
              label="البريد الإلكتروني"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              dir="ltr"
            />
            
            <Input
              label="رقم الهاتف (اختياري)"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+966 50 000 0000"
              dir="ltr"
            />

            <Input
              label="كلمة المرور"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              dir="ltr"
            />

            <Button type="submit" className="w-full mt-4" isLoading={isPending}>
              تسجيل الحساب
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
              سجل دخولك
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
