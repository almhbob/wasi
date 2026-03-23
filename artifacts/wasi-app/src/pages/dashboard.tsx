import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Layout } from '@/components/layout';
import { Card, Button } from '@/components/ui-components';
import { useGetWills, useGetGuardians, useGetDebts, useGetDigitalAssets } from '@workspace/api-client-react';
import { ScrollText, Users, Wallet, Fingerprint, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: wills = [] } = useGetWills();
  const { data: guardians = [] } = useGetGuardians();
  const { data: debts = [] } = useGetDebts();
  const { data: digitalAssets = [] } = useGetDigitalAssets();

  const stats = [
    { title: 'الوصايا المسجلة', value: wills.length, icon: ScrollText, color: 'text-emerald-500', bg: 'bg-emerald-500/10', link: '/wills' },
    { title: 'الأوصياء', value: guardians.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', link: '/guardians' },
    { title: 'الديون والواجبات', value: debts.length, icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-500/10', link: '/debts' },
    { title: 'الأصول الرقمية', value: digitalAssets.length, icon: Fingerprint, color: 'text-purple-500', bg: 'bg-purple-500/10', link: '/digital-assets' },
  ];

  return (
    <Layout>
      <div className="mb-10 text-center relative py-12 rounded-3xl overflow-hidden glass-panel border-primary/20">
        <div className="absolute inset-0 z-0 opacity-5">
           <img src={`${import.meta.env.BASE_URL}images/quran-ornament.png`} alt="Ornament" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-primary mb-4">
            أهلاً بك في خزنتك يا {user?.name.split(' ')[0]}
          </h1>
          <p className="text-xl text-accent font-display max-w-2xl mx-auto leading-relaxed px-4">
            "كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ إِن تَرَكَ خَيْرًا الْوَصِيَّةُ"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.title}
            >
              <Link href={stat.link}>
                <Card className="group cursor-pointer hover:border-primary/30 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <Icon size={28} />
                    </div>
                    <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-muted-foreground group-hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg">{stat.title}</h3>
                    <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="relative overflow-hidden border-accent/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10"></div>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-full bg-accent/10 text-accent">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">حالة الضامن (Dead Man Switch)</h2>
              <p className="text-muted-foreground mt-1">يضمن تسليم وصيتك في الوقت المناسب</p>
            </div>
          </div>
          
          <div className="bg-background rounded-xl p-5 border border-border mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">آخر إثبات حالة</p>
              <p className="font-semibold text-lg">
                {user?.lastCheckinAt ? new Date(user.lastCheckinAt).toLocaleDateString('ar-SA') : 'لم يتم الإثبات بعد'}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm text-muted-foreground mb-1">المدة المحددة</p>
              <p className="font-semibold text-lg">{user?.checkinIntervalDays} يوم</p>
            </div>
          </div>
          
          <Link href="/dead-man-switch">
             <Button variant="outline" className="w-full">إدارة نظام الضامن</Button>
          </Link>
        </Card>

        <Card className="bg-primary text-primary-foreground border-none">
          <h2 className="text-xl font-bold mb-4 text-accent">كيف تعمل منصة وصي؟</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">1</div>
              <p className="text-primary-foreground/90">اكتب وصيتك وسجل ديونك وأصولك الرقمية بأمان تام، مع تشفير البيانات الحساسة.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">2</div>
              <p className="text-primary-foreground/90">عيّن الأوصياء الموثوقين الذين ترغب بتسليمهم الوصية عند الحاجة.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">3</div>
              <p className="text-primary-foreground/90">قم بإثبات حالتك دورياً عبر نظام الضامن. في حال الانقطاع الطويل، يتم إرسال الوصية تلقائياً للأوصياء.</p>
            </li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
