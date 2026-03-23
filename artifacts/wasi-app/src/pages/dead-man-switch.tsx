import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, PageHeader } from '@/components/ui-components';
import { useAuth } from '@/lib/auth-context';
import { useCheckin, getGetMeQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Clock, ShieldAlert, HeartPulse } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { arSA } from 'date-fns/locale';

export default function DeadManSwitch() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState('');

  const { mutate: doCheckin, isPending } = useCheckin({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        setSuccessMsg('تم تحديث حالة الضامن بنجاح، أطال الله في عمرك على طاعته.');
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    }
  });

  if (!user) return null;

  const intervalDays = user.checkinIntervalDays || 30;
  const lastCheckin = user.lastCheckinAt ? new Date(user.lastCheckinAt) : new Date();
  const nextCheckin = addDays(lastCheckin, intervalDays);
  const daysPassed = differenceInDays(new Date(), lastCheckin);
  const daysRemaining = intervalDays - daysPassed;
  
  const isDanger = daysRemaining <= Math.max(3, intervalDays * 0.1);

  return (
    <Layout>
      <PageHeader 
        title="نظام إثبات الحالة (الضامن)" 
        description="هذا النظام يضمن إرسال وصاياك للأوصياء تلقائياً في حال انقطاعك عن تسجيل الدخول لفترة تحددها أنت."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`relative overflow-hidden p-8 border-2 ${isDanger ? 'border-destructive bg-destructive/5' : 'border-primary/20 bg-background'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
              <ShieldCheck className="w-full h-full text-foreground" />
            </div>

            <div className="text-center mb-10">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${isDanger ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground'}`}>
                {isDanger ? <ShieldAlert size={48} /> : <HeartPulse size={48} />}
              </div>
              
              <h2 className="text-3xl font-display font-bold mb-2">أثبت تواجدك</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                بالضغط على الزر أدناه، أنت تؤكد للنظام أنك بخير لتأجيل إرسال الوصية لدورة قادمة.
              </p>

              {successMsg && (
                <div className="bg-emerald-500/10 text-emerald-600 p-4 rounded-xl mb-6 font-medium border border-emerald-500/20 inline-block">
                  {successMsg}
                </div>
              )}

              <Button 
                onClick={() => doCheckin()} 
                isLoading={isPending}
                className={`w-full max-w-sm h-16 text-xl rounded-2xl mx-auto shadow-2xl ${isDanger ? 'bg-destructive hover:bg-destructive/90 text-white' : ''}`}
              >
                أنا بخير، والحمد لله
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-8">
               <div className="text-center">
                 <p className="text-sm text-muted-foreground mb-1">آخر إثبات حالة</p>
                 <p className="font-bold text-xl">{user.lastCheckinAt ? format(lastCheckin, 'dd MMMM yyyy', { locale: arSA }) : 'الآن'}</p>
               </div>
               <div className="text-center border-r border-border/50">
                 <p className="text-sm text-muted-foreground mb-1">الموعد الأقصى القادم</p>
                 <p className={`font-bold text-xl ${isDanger ? 'text-destructive' : 'text-primary'}`}>
                   {format(nextCheckin, 'dd MMMM yyyy', { locale: arSA })}
                 </p>
               </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-accent/10 border-accent/20">
            <h3 className="font-bold text-lg mb-4 text-accent-foreground flex items-center gap-2">
              <Clock className="text-accent" />
              إعدادات المؤقت
            </h3>
            
            <div className="space-y-4">
              <div className="bg-background p-4 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">المدة المحددة حالياً</p>
                <p className="font-bold text-2xl text-foreground">{intervalDays} يوم</p>
                <p className="text-xs text-muted-foreground mt-2">
                  (إذا لم تضغط "أنا بخير" خلال هذه المدة، ستُرسل الوصية).
                </p>
              </div>
              
              <Button variant="outline" className="w-full" disabled title="سيتم تفعيل تغيير المدة قريباً">
                تغيير المدة المحددة
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3 border-b border-border/50 pb-3">ماذا يحدث عند انتهاء المؤقت؟</h3>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside pr-2">
              <li>يتم تفعيل حالة "تنفيذ الوصية".</li>
              <li>يُرسل بريد إلكتروني تلقائي لجميع الأوصياء المسجلين والمؤكدين.</li>
              <li>يُمنح الأوصياء صلاحية الوصول لمحتوى الوصية المشفر والتعليمات الرقمية.</li>
              <li>لا يتم إرسال أي تفاصيل لغير الأوصياء المحددين.</li>
            </ol>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
