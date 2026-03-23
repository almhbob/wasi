import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Users,
  Wallet,
  Fingerprint,
  ActivitySquare,
  Scale,
  UserPlus,
  FileText,
  Check,
  CheckCircle2,
  ChevronLeft,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui-components';

export default function Landing() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const features = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "خزنة الوصية المشفرة",
      description: "احفظ وصيتك بتشفير AES-256، لا يصل إليها أحد إلا من تختار"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "نظام الأوصياء",
      description: "حدّد الأشخاص الموثوقين الذين سيتلقون إرشاداتك بعد رحيلك"
    },
    {
      icon: <Wallet className="w-6 h-6 text-primary" />,
      title: "سجل الديون والزكاة",
      description: "سجّل ديونك وزكاتك وكفاراتك لضمان أدائها"
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-primary" />,
      title: "الإرث الرقمي",
      description: "وثّق حساباتك الرقمية وقرر مصيرها: إغلاق أو نقل أو توارث"
    },
    {
      icon: <ActivitySquare className="w-6 h-6 text-primary" />,
      title: "نظام الضامن",
      description: "آلية ذكية تتحقق من نشاطك وتُرسل الوصية تلقائيًا عند الحاجة"
    },
    {
      icon: <Scale className="w-6 h-6 text-primary" />,
      title: "استشارة شرعية",
      description: "تواصل مع فقهاء متخصصين للتحقق من صحة وصيتك شرعًا"
    }
  ];

  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-primary" />,
      title: "أنشئ حسابك",
      description: "سجّل بياناتك بأمان تام"
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "اكتب وصيتك",
      description: "وثّق إرادتك بكل تفاصيلها"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "حدّد أوصياءك",
      description: "اختر من تثق بهم لتنفيذ وصيتك"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "نم مطمئنًا",
      description: "نظامنا يرعى بقية الأمور"
    }
  ];

  const faqs = [
    {
      q: "هل يمكن لموظفي وصي الاطلاع على وصيتي؟",
      a: "لا، وصيتك مشفرة بمفتاحك الخاص. لا أحد يستطيع الاطلاع عليها، بما في ذلك فريق عمل وصي."
    },
    {
      q: "ما الذي يحدث إذا لم أسجل نشاطي؟",
      a: "نظام الضامن يُرسل تنبيهات لأوصيائك المحددين للتحقق من حالك عبر وسائل اتصال متعددة قبل اتخاذ أي إجراء."
    },
    {
      q: "هل وصيتي معتمدة قانونيًا؟",
      a: "نوفر إرشادات للتوثيق القانوني والصيغ المعتمدة، لكن يُنصح دائمًا بمراجعة محامٍ مختص في بلدك لضمان التوافق التام مع القوانين المحلية."
    },
    {
      q: "هل التطبيق متوافق مع الشريعة الإسلامية؟",
      a: "نعم، تعمل معنا لجنة شرعية متخصصة للمراجعة والإرشاد لضمان توافق جميع الخدمات مع أحكام الشريعة الإسلامية."
    },
    {
      q: "ماذا يحدث لبياناتي إذا أغلقت الخدمة؟",
      a: "يمكنك تصدير بياناتك في أي وقت بصيغ متعددة. كما نلتزم بتوفير فترة سماح كافية تتيح لجميع المستخدمين حفظ بياناتهم في حال حدوث أي تغييرات جوهرية."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground rtl" dir="rtl">
      {/* 1. Navbar */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-10 w-auto" />
            <span className="font-display font-bold text-2xl text-primary">وصي</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/80 hover:text-primary font-medium transition-colors">المميزات</a>
            <a href="#how-it-works" className="text-foreground/80 hover:text-primary font-medium transition-colors">كيف يعمل؟</a>
            <a href="#security" className="text-foreground/80 hover:text-primary font-medium transition-colors">الأمان</a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary font-medium transition-colors">الأسعار</a>
            <a href="#faq" className="text-foreground/80 hover:text-primary font-medium transition-colors">الأسئلة الشائعة</a>
            <a href="#about" className="text-accent hover:text-accent/80 font-semibold transition-colors">عن المنشئ</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" onClick={() => setLocation('/login')}>
              تسجيل الدخول
            </Button>
            <Button onClick={() => setLocation('/register')}>
              ابدأ مجانًا
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border p-4 shadow-lg"
          >
            <nav className="flex flex-col gap-4 mb-6">
              <a href="#features" className="text-lg font-medium p-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>المميزات</a>
              <a href="#how-it-works" className="text-lg font-medium p-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>كيف يعمل؟</a>
              <a href="#security" className="text-lg font-medium p-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>الأمان</a>
              <a href="#pricing" className="text-lg font-medium p-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>الأسعار</a>
              <a href="#faq" className="text-lg font-medium p-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>الأسئلة الشائعة</a>
              <a href="#about" className="text-lg font-semibold p-2 rounded-lg hover:bg-accent/10 text-accent" onClick={() => setIsMobileMenuOpen(false)}>عن المنشئ</a>
            </nav>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-center" onClick={() => setLocation('/login')}>
                تسجيل الدخول
              </Button>
              <Button className="w-full justify-center" onClick={() => setLocation('/register')}>
                ابدأ مجانًا
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[90vh]">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0"></div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                <Shield size={16} />
                <span>المنصة الإسلامية الأولى للإرث الرقمي</span>
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 text-foreground">
                <span className="block text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent mb-2">أمِّن إرثك الرقمي</span>
                <span className="block">قبل فوات الأوان</span>
              </motion.h1>
              
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                منصة وصي الإسلامية تُتيح لك كتابة وصيتك، إدارة ديونك، وحماية إرثك الرقمي بتشفير عالي المستوى — لتنام مطمئنًا أن حقوقك محفوظة.
              </motion.p>
              
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" className="text-lg h-14 px-8" onClick={() => setLocation('/register')}>
                  ابدأ مجانًا الآن <ArrowLeft className="ml-2 w-5 h-5 mr-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-background/50 backdrop-blur-sm" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                  تعرّف أكثر
                </Button>
              </motion.div>
              
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-6 text-sm font-medium text-foreground/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>تشفير AES-256</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>خصوصية تامة</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>متوافق مع الشريعة</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex justify-center items-center h-full"
            >
              {/* Animated Floating Graphic */}
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
                  <div className="w-64 h-80 bg-gradient-to-br from-sidebar to-sidebar-border rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-islamic-pattern opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-50"></div>
                    
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 relative z-10 p-4"
                    >
                      <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="w-full h-full object-contain" />
                    </motion.div>
                    
                    <div className="space-y-3 w-full z-10">
                      <div className="h-3 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-3 bg-white/20 rounded-full w-1/2 mx-auto"></div>
                      <div className="h-3 bg-white/20 rounded-full w-5/6 mx-auto"></div>
                    </div>
                    
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
                    <div className="absolute -left-4 -top-4 w-32 h-32 bg-primary/30 rounded-full blur-2xl"></div>
                  </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute top-10 right-0 glass-panel p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">حالة الأمان</div>
                    <div className="text-sm font-bold">مشفر بالكامل</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
                  className="absolute bottom-20 -left-4 glass-panel p-4 rounded-2xl shadow-xl z-20 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">الضامن</div>
                    <div className="text-sm font-bold">نشط وفعال</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Quran Verse Banner */}
      <section className="bg-gradient-to-r from-[#1A3D4D] via-[#2A657A] to-[#1A3D4D] py-12 relative overflow-hidden text-white border-y border-primary/20">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center items-center gap-4 mb-6 opacity-60">
              <div className="h-px w-16 bg-white/50"></div>
              <span className="text-2xl text-accent">﷽</span>
              <div className="h-px w-16 bg-white/50"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-relaxed mb-6 px-4">
              "كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ إِن تَرَكَ خَيْرًا الْوَصِيَّةُ"
            </h2>
            
            <div className="inline-block border border-white/20 rounded-full px-6 py-2 bg-white/5 backdrop-blur-sm text-white/80 font-medium">
              سورة البقرة: 180
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
            >
              كل ما تحتاجه في مكان واحد
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground"
            >
              صممنا منصة وصي لتلبي كافة احتياجات المسلم في توثيق إرثه المادي والرقمي بأعلى معايير الأمان والخصوصية
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <div className="group-hover:text-white transition-colors text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-24 bg-muted/50 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              كيف يعمل وصي؟
            </h2>
            <p className="text-lg text-muted-foreground">
              خطوات بسيطة تضمن لك راحة البال وحفظ حقوقك وحقوق من تعول
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-border -z-10"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 bg-background border-4 border-muted rounded-full flex items-center justify-center mb-6 shadow-sm z-10 relative">
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold text-lg border-2 border-background">
                      {index + 1}
                    </div>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button size="lg" onClick={() => setLocation('/register')} className="px-8">
              ابدأ خطوتك الأولى
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Security Section */}
      <section id="security" className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6 border border-accent/20">
                <Lock size={16} />
                <span>أمان لا مساومة فيه</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                أمانك أولويتنا
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                في وصي، ندرك تمامًا حساسية وأهمية البيانات التي تأتمننا عليها. لذلك، بنينا بنية تحتية أمنية متطورة تضمن خصوصية معلوماتك بالكامل.
              </p>
              
              <div className="space-y-6">
                {[
                  "تشفير AES-256 من الدرجة العسكرية من طرف إلى طرف",
                  "لا نستطيع نحن أنفسنا الاطلاع على وصيتك (Zero-Knowledge)",
                  "خوادم مُعتمدة ومحمية وفق أعلى معايير الأمان العالمية",
                  "نسخ احتياطية مشفرة متعددة لضمان عدم فقدان البيانات"
                ].map((point, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3rem] transform rotate-3 blur-2xl"></div>
              <div className="bg-sidebar rounded-[2rem] p-8 md:p-12 relative border border-sidebar-border shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-sidebar-primary rounded-full flex items-center justify-center mb-8 shadow-xl border-4 border-white/10">
                    <Shield className="w-16 h-16 text-white" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                      <Lock className="text-primary w-8 h-8" />
                      <div className="text-right">
                        <div className="text-white font-bold">تشفير كامل</div>
                        <div className="text-white/60 text-sm">بياناتك مشفرة قبل مغادرة جهازك</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm flex items-center gap-4">
                      <Fingerprint className="text-accent w-8 h-8" />
                      <div className="text-right">
                        <div className="text-white font-bold">خصوصية تامة</div>
                        <div className="text-white/60 text-sm">المفتاح الخاص بك لا يتم تخزينه لدينا</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section id="pricing" className="py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              خطط تناسب احتياجاتك
            </h2>
            <p className="text-lg text-muted-foreground">
              اختر الخطة التي تناسبك للبدء في تأمين إرثك
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">مجاني</h3>
                <p className="text-muted-foreground mb-6">الميزات الأساسية للبدء</p>
                <div className="text-4xl font-bold">
                  0 <span className="text-xl text-muted-foreground font-normal">ر.س / دائمًا</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {[
                  "وصية واحدة",
                  "وصي واحد",
                  "سجل ديون أساسي",
                  "تذكيرات شهرية"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" size="lg" className="w-full" onClick={() => setLocation('/register')}>
                ابدأ مجانًا
              </Button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-sidebar border-2 border-primary rounded-3xl p-8 shadow-xl relative flex flex-col text-sidebar-foreground"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                الأكثر اختيارًا
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2 text-white">مميز</h3>
                <p className="text-sidebar-foreground/70 mb-6">حماية شاملة لك ولعائلتك</p>
                <div className="text-4xl font-bold text-white">
                  29 <span className="text-xl text-sidebar-foreground/70 font-normal">ر.س / شهريًا</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {[
                  "وصايا غير محدودة",
                  "أوصياء متعددون",
                  "تشفير متقدم وخزنة آمنة",
                  "إرث رقمي كامل",
                  "دعم وتوجيه شرعي",
                  "تذكيرات ذكية ونظام الضامن"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white border-none" onClick={() => setLocation('/register')}>
                اشترك الآن
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-lg text-muted-foreground">
              كل ما تحتاج معرفته عن منصة وصي
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="text-right font-bold text-lg hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 9. CTA Section */}
      <section className="py-24 bg-[#1A3D4D] relative overflow-hidden text-center border-b-8 border-accent">
        <div className="absolute inset-0 bg-islamic-pattern opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
              ابدأ رحلتك نحو الأمان الرقمي اليوم
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              انضم إلى آلاف المسلمين الذين يثقون في وصي لحماية إرثهم وضمان تنفيذ وصاياهم وفق الشريعة الإسلامية.
            </p>
            <Button size="lg" className="bg-white text-[#1A3D4D] hover:bg-white/90 text-lg h-14 px-10 rounded-full font-bold shadow-xl" onClick={() => setLocation('/register')}>
              أنشئ حسابك مجانًا
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 10. About & Dedication Section */}
      <section id="about" className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-20 z-0"></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">

          {/* Waqf Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/30 mb-8">
              <span className="text-2xl">🕌</span>
              <span className="text-accent font-bold text-lg">وقفٌ لوجه الله تعالى</span>
              <span className="text-2xl">🕌</span>
            </div>
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-accent/5 to-primary/5 rounded-3xl border border-accent/20 p-10 shadow-lg">
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground leading-relaxed mb-4">
                هذا التطبيق وقفٌ خالصٌ لوجه الله الكريم
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                تقدّمةً مني لكل مسلم يريد تأمين إرثه وصون حقوق ذويه، أسأل الله تعالى أن يجعله في ميزان الحسنات، وأن ينفع به الأمة الإسلامية في مشارق الأرض ومغاربها.
              </p>
              <div className="mt-8 pt-8 border-t border-accent/20">
                <p className="text-muted-foreground text-base italic">
                  "إِذَا مَاتَ الإِنسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: إِلَّا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ"
                </p>
                <p className="text-accent font-semibold mt-2 text-sm">— رواه مسلم</p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* About the Creator */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">عن المنشئ</h2>
              <div className="w-16 h-1 bg-gradient-to-l from-primary to-accent rounded-full mb-8"></div>

              <div className="flex items-start gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center shadow-lg">
                  <span className="text-white font-display font-bold text-3xl">ع</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">عاصم عبدالرحمن محمد عمر</h3>
                  <p className="text-primary font-medium text-sm mt-1">متخصص في الأمن السيبراني وتحليل البيانات</p>
                  <a
                    href="https://www.credly.com/users/asim-abdulrahman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm mt-1 block"
                  >
                    credly.com/users/asim-abdulrahman ↗
                  </a>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                مهتم بتوظيف التقنية في خدمة المجتمع الإسلامي، وحامل لشهادات احترافية من كبرى المؤسسات العالمية في مجالات الأمن السيبراني وتحليل البيانات وعلم الحاسوب، من بينها:
              </p>

              <ul className="space-y-3 mb-6">
                {[
                  { org: "Google & Coursera", cert: "Google Advanced Data Analytics Professional Certificate" },
                  { org: "IBM & Coursera",    cert: "IBM Cybersecurity Specialist Professional Certificate" },
                  { org: "IBM SkillsBuild",   cert: "Cybersecurity Fundamentals" },
                  { org: "Cisco",             cert: "Introduction to Data Science & Packet Tracer" },
                  { org: "Fortinet",          cert: "Introduction to the Threat Landscape 2.0" },
                  { org: "Intel",             cert: "Cloud DevOps" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">{item.org}</span>
                      <span className="text-muted-foreground text-sm"> — {item.cert}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground leading-relaxed text-sm">
                آمنتُ بأن الأمة الإسلامية بحاجة إلى حلول تقنية تُحافظ على حقوقها وإرثها في عالم رقمي متسارع، فكان تطبيق <span className="text-primary font-bold">وصي</span> ثمرةً لهذا الإيمان.
              </p>
            </motion.div>

            {/* Dedication */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">الإهداء</h2>
              <div className="w-16 h-1 bg-gradient-to-l from-accent to-primary rounded-full mb-8"></div>

              {/* Family Dedication */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👨‍👩‍👧‍👦</span>
                  <h3 className="text-xl font-bold text-foreground">إلى عائلتي الكريمة</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  أُهدي هذا العمل المتواضع إلى أحبّ الناس إلى قلبي — عائلتي الكريمة — عامةً، الذين كانوا سنداً وعوناً في مسيرة الحياة. جعل الله هذا العمل صدقةً جاريةً تعود بالخير عليهم جميعاً.
                </p>
              </div>

              {/* Memorial Dedication */}
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-2xl p-8 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary"></div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <span className="text-2xl">🌹</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">إلى روح خالي</h3>
                    <p className="text-accent font-bold text-lg">عاطف حسن</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  تغمده الله بواسع رحمته، وأسكنه فسيح جناته. رحل — رحمه الله — وترك في القلب أثراً لا يُمحى. أُهدي إليه هذا العمل الصالح، وأسأل الله أن يكون في ميزان حسناته، وأن يجمعنا به في الفردوس الأعلى.
                </p>
                <div className="bg-white/50 rounded-xl p-5 border border-accent/20">
                  <p className="text-foreground/80 text-center text-lg font-display leading-relaxed">
                    اللهم اغفر له وارحمه وعافه واعفُ عنه، وأكرم نُزُله ووسّع مُدخله، واغسله بالماء والثلج والبرَد.
                  </p>
                </div>
                <div className="text-center mt-4">
                  <span className="text-muted-foreground text-sm">الفاتحة على روحه الطاهرة 🤲</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-sidebar pt-20 pb-10 border-t border-sidebar-border text-sidebar-foreground">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-12 w-auto filter brightness-0 invert" />
                <span className="font-display font-bold text-3xl text-white">وصي</span>
              </div>
              <p className="text-sidebar-foreground/70 leading-relaxed mb-6">
                منصة وصي للإرث الرقمي الإسلامي. نوفر بيئة آمنة وموثوقة لحفظ وصيتك وتأمين مستقبلك ومستقبل من تحب.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">روابط سريعة</h4>
              <ul className="space-y-4">
                <li><a href="/" className="text-sidebar-foreground/70 hover:text-primary transition-colors">الرئيسية</a></li>
                <li><a href="#features" className="text-sidebar-foreground/70 hover:text-primary transition-colors">المميزات</a></li>
                <li><a href="#how-it-works" className="text-sidebar-foreground/70 hover:text-primary transition-colors">كيف نعمل</a></li>
                <li><a href="#pricing" className="text-sidebar-foreground/70 hover:text-primary transition-colors">الأسعار</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">الخدمات</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">خزنة الوصايا</a></li>
                <li><a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">سجل الديون</a></li>
                <li><a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">الإرث الرقمي</a></li>
                <li><a href="#" className="text-sidebar-foreground/70 hover:text-primary transition-colors">الاستشارات الشرعية</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">تواصل معنا</h4>
              <ul className="space-y-4">
                <li className="text-sidebar-foreground/70">البريد الإلكتروني:<br/><a href="mailto:info@wasi.app" className="text-primary hover:underline">info@wasi.app</a></li>
                <li className="text-sidebar-foreground/70">الدعم الفني:<br/><a href="mailto:support@wasi.app" className="text-primary hover:underline">support@wasi.app</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/50">
            <p>© 2026 وصي - جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">الشروط والأحكام</a>
              <a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
