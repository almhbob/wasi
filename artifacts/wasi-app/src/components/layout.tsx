import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth-context';
import { 
  LayoutDashboard, 
  ScrollText, 
  Users, 
  Wallet, 
  Fingerprint, 
  ActivitySquare, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { href: '/', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/wills', label: 'خزنة الوصايا', icon: ScrollText },
  { href: '/guardians', label: 'الأوصياء', icon: Users },
  { href: '/debts', label: 'الديون والواجبات', icon: Wallet },
  { href: '/digital-assets', label: 'الإرث الرقمي', icon: Fingerprint },
  { href: '/dead-man-switch', label: 'إثبات الحالة (الضامن)', icon: ActivitySquare },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row rtl overflow-hidden bg-islamic-pattern">
      
      {/* Mobile Header */}
      <header className="md:hidden glass-panel flex items-center justify-between p-4 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-8 w-auto" />
          <span className="font-display font-bold text-lg text-primary">وصي</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-foreground/80 hover:bg-primary/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              fixed md:static inset-y-0 right-0 z-40
              w-72 bg-sidebar text-sidebar-foreground border-l border-sidebar-border
              flex flex-col h-full
            `}
          >
            <div className="p-6 hidden md:flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}images/wasi-logo.png`} alt="وصي" className="h-10 w-auto" />
              <span className="font-display font-bold text-2xl text-sidebar-primary tracking-tight">وصي</span>
            </div>

            <div className="px-6 py-4 flex items-center gap-4 bg-sidebar-primary/5 rounded-2xl mx-4 mb-6 border border-sidebar-primary/10">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent/20 flex items-center justify-center text-sidebar-accent font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm truncate w-32">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate w-32">{user?.email}</p>
              </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md font-medium translate-x-1' 
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-accent hover:translate-x-1'
                      }
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 mt-auto">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto p-4 md:p-8 lg:p-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
