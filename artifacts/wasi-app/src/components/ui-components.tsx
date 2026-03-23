import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 shadow-xl shadow-black/5 border border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5",
      className
    )}>
      {children}
    </div>
  );
}

export function Button({ 
  className, variant = 'primary', isLoading, children, ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive', isLoading?: boolean }) {
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-primary/20 text-primary hover:border-primary hover:bg-primary/5",
    ghost: "text-foreground/70 hover:text-primary hover:bg-primary/10",
    destructive: "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 hover:-translate-y-0.5"
  };

  return (
    <button 
      disabled={isLoading || props.disabled}
      className={cn(
        "px-6 py-3 rounded-xl font-semibold transition-all duration-200 ease-out flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}

export function Input({ className, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium text-foreground/80 block">{label}</label>}
      <input 
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 border-border",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          "transition-all duration-200",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function Select({ className, label, error, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, error?: string, options: {value: string, label: string}[] }) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium text-foreground/80 block">{label}</label>}
      <select 
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 border-border appearance-none",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          "transition-all duration-200",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )}
        {...props}
      >
        <option value="" disabled>اختر...</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function Textarea({ className, label, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, error?: string }) {
  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-sm font-medium text-foreground/80 block">{label}</label>}
      <textarea 
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-background border-2 border-border min-h-[120px] resize-y",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
          "transition-all duration-200",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 overflow-y-auto z-50 pointer-events-none flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border/50 pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/30">
                <h2 className="text-xl font-display font-bold text-primary">{title}</h2>
                <button onClick={onClose} className="p-2 hover:bg-destructive/10 text-foreground/60 hover:text-destructive rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function PageHeader({ title, description, action }: { title: string, description?: string, action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary mb-2 flex items-center gap-3">
          {title}
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' }) {
  const variants = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
    outline: "border border-border text-foreground/70"
  };
  
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1", variants[variant])}>
      {children}
    </span>
  );
}
