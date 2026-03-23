import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, PageHeader, Modal, Input, Select, Badge } from '@/components/ui-components';
import { useGetDebts, useCreateDebt, useUpdateDebt, useDeleteDebt, getGetDebtsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle, Circle, Edit2, Trash2, Banknote, Landmark, HandHeart, Coins } from 'lucide-react';

export default function Debts() {
  const queryClient = useQueryClient();
  const { data: debts = [], isLoading } = useGetDebts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ type: 'debt', description: '', amount: '', currency: 'SAR', creditorName: '', creditorContact: '' });

  const { mutate: createDebt, isPending: isCreating } = useCreateDebt({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetDebtsQueryKey() }); closeModal(); } }
  });

  const { mutate: updateDebt, isPending: isUpdating } = useUpdateDebt({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetDebtsQueryKey() }); closeModal(); } }
  });

  const { mutate: deleteDebt } = useDeleteDebt({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetDebtsQueryKey() }) }
  });

  const openModal = (debt: any = null) => {
    if (debt) {
      setEditingId(debt.id);
      setFormData({ ...debt, amount: debt.amount || '' });
    } else {
      setEditingId(null);
      setFormData({ type: 'debt', description: '', amount: '', currency: 'SAR', creditorName: '', creditorContact: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      amount: formData.amount ? parseFloat(formData.amount) : null
    };
    if (editingId) {
      updateDebt({ id: editingId, data: submitData });
    } else {
      createDebt({ data: submitData as any });
    }
  };

  const togglePaid = (id: string, currentStatus: boolean) => {
    updateDebt({ id, data: { isPaid: !currentStatus } });
  };

  const typeConfig: Record<string, { label: string, icon: any, color: string }> = {
    debt: { label: 'دين مالي', icon: Banknote, color: 'text-rose-500' },
    zakat: { label: 'زكاة مستحقة', icon: Landmark, color: 'text-amber-500' },
    kaffarah: { label: 'كفارة', icon: HandHeart, color: 'text-emerald-500' },
    other: { label: 'حقوق أخرى', icon: Coins, color: 'text-blue-500' },
  };

  return (
    <Layout>
      <PageHeader 
        title="سجل الديون والواجبات" 
        description="إبراء للذمة، سجل ما عليك من حقوق للعباد ولله سبحانه ليتكفل بها الأوصياء."
        action={
          <Button onClick={() => openModal()}>
            <Plus size={20} />
            إضافة واجب جديد
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : debts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-4 text-amber-500">
            <Wallet size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">لا توجد ديون مسجلة</h3>
          <p className="text-muted-foreground mb-6 max-w-md">أبرئ ذمتك بتسجيل أي ديون، زكوات، كفارات لم تؤدها لتكون واضحة لأوصيائك.</p>
          <Button onClick={() => openModal()}>إضافة سجل جديد</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {debts.map(debt => {
            const config = typeConfig[debt.type] || typeConfig.other;
            const Icon = config.icon;
            
            return (
              <Card key={debt.id} className={`flex flex-col md:flex-row gap-4 items-start md:items-center p-5 transition-all ${debt.isPaid ? 'opacity-60 bg-muted/20' : ''}`}>
                <div className={`p-4 rounded-xl bg-background border ${debt.isPaid ? 'border-border' : 'shadow-md'} shrink-0`}>
                  <Icon size={28} className={debt.isPaid ? 'text-muted-foreground' : config.color} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline" className={debt.isPaid ? '' : config.color.replace('text-', 'bg-').replace('500', '500/10') + ' border-none'}>
                      {config.label}
                    </Badge>
                    <h3 className={`font-bold text-lg truncate ${debt.isPaid ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {debt.description}
                    </h3>
                  </div>
                  
                  {(debt.creditorName || debt.creditorContact) && (
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      لصالح: <span className="font-medium text-foreground/80">{debt.creditorName}</span>
                      {debt.creditorContact && <span>({debt.creditorContact})</span>}
                    </p>
                  )}
                </div>
                
                {debt.amount && (
                  <div className="text-right shrink-0 min-w-[120px]">
                    <p className={`font-display font-bold text-2xl ${debt.isPaid ? 'text-muted-foreground' : 'text-primary'}`} dir="ltr">
                      {debt.amount.toLocaleString()} {debt.currency}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-2 md:pr-6 md:border-r border-border/50 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0">
                  <button 
                    onClick={() => togglePaid(debt.id, debt.isPaid)}
                    className={`flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      debt.isPaid ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    }`}
                  >
                    {debt.isPaid ? <CheckCircle size={18} /> : <Circle size={18} />}
                    {debt.isPaid ? 'تم السداد' : 'تحديد كمسدد'}
                  </button>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" className="p-2 h-auto text-muted-foreground hover:text-primary" onClick={() => openModal(debt)}>
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" className="p-2 h-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => {
                      if(confirm('حذف هذا السجل؟')) deleteDebt({ id: debt.id });
                    }}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'تعديل السجل' : 'إضافة سجل جديد'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select 
            label="نوع الواجب" 
            value={formData.type} 
            onChange={e => setFormData({...formData, type: e.target.value})}
            options={[
              { value: 'debt', label: 'دين مالي لشخص أو جهة' },
              { value: 'zakat', label: 'زكاة متأخرة' },
              { value: 'kaffarah', label: 'كفارات (يمين، صيام...)' },
              { value: 'other', label: 'حقوق أخرى' }
            ]}
          />
          
          <Input label="الوصف والتفاصيل" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="مثال: سلفة من صديقي فلان، أو زكاة سنة 1444..." />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="المبلغ (إن وجد)" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} dir="ltr" />
            <Input label="العملة" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} dir="ltr" />
          </div>

          {formData.type === 'debt' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl border border-border mt-4">
              <Input label="اسم الدائن" value={formData.creditorName} onChange={e => setFormData({...formData, creditorName: e.target.value})} />
              <Input label="وسيلة تواصل" value={formData.creditorContact} onChange={e => setFormData({...formData, creditorContact: e.target.value})} dir="ltr" />
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>حفظ السجل</Button>
            <Button type="button" variant="ghost" onClick={closeModal}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
