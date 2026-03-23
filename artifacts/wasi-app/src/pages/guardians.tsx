import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, PageHeader, Modal, Input, Badge } from '@/components/ui-components';
import { useGetGuardians, useCreateGuardian, useUpdateGuardian, useDeleteGuardian, getGetGuardiansQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Mail, Phone, Edit2, Trash2, UserCheck, ShieldAlert } from 'lucide-react';

export default function Guardians() {
  const queryClient = useQueryClient();
  const { data: guardians = [], isLoading } = useGetGuardians();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', relationship: '' });

  const { mutate: createGuardian, isPending: isCreating } = useCreateGuardian({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetGuardiansQueryKey() }); closeModal(); } }
  });

  const { mutate: updateGuardian, isPending: isUpdating } = useUpdateGuardian({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetGuardiansQueryKey() }); closeModal(); } }
  });

  const { mutate: deleteGuardian } = useDeleteGuardian({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetGuardiansQueryKey() }) }
  });

  const openModal = (guardian: any = null) => {
    if (guardian) {
      setEditingId(guardian.id);
      setFormData({ name: guardian.name, email: guardian.email, phone: guardian.phone || '', relationship: guardian.relationship });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', relationship: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateGuardian({ id: editingId, data: formData });
    } else {
      createGuardian({ data: formData });
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="الأوصياء المؤتمنون" 
        description="الأشخاص الذين تثق بهم لتسلم وصيتك وتصفية حساباتك وتنفيذ إرادتك."
        action={
          <Button onClick={() => openModal()}>
            <Plus size={20} />
            إضافة وصي
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : guardians.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
            <UserCheck size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">لم تقم بتعيين أوصياء</h3>
          <p className="text-muted-foreground mb-6 max-w-md">الوصي هو الشخص الذي يتلقى بياناتك ووصاياك بعد تأكيد غيابك. يفضل تعيين شخصين على الأقل.</p>
          <Button onClick={() => openModal()}>إضافة الوصي الأول</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardians.map(guardian => (
            <Card key={guardian.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100px] -z-10"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-xl shadow-inner border border-border">
                    {guardian.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{guardian.name}</h3>
                    <Badge variant="outline">{guardian.relationship}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6 bg-background rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-3 text-sm text-foreground/80">
                  <Mail size={16} className="text-primary/60" />
                  <span className="truncate block" dir="ltr">{guardian.email}</span>
                </div>
                {guardian.phone && (
                  <div className="flex items-center gap-3 text-sm text-foreground/80">
                    <Phone size={16} className="text-primary/60" />
                    <span dir="ltr">{guardian.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border/50 text-xs font-medium">
                  {guardian.isConfirmed ? (
                     <><ShieldAlert size={14} className="text-emerald-500" /><span className="text-emerald-600">أكد قبوله للوصاية</span></>
                  ) : (
                     <><ShieldAlert size={14} className="text-amber-500" /><span className="text-amber-600">بانتظار تأكيد الوصي</span></>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="flex-1 py-2 text-sm" onClick={() => openModal(guardian)}>
                  <Edit2 size={16} /> تعديل
                </Button>
                <Button variant="ghost" className="px-3 py-2 text-destructive hover:bg-destructive/10" onClick={() => {
                  if(confirm('إزالة هذا الوصي؟')) deleteGuardian({ id: guardian.id });
                }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'تعديل بيانات الوصي' : 'إضافة وصي جديد'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="الاسم الكامل" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input label="البريد الإلكتروني (سيتم إرسال دعوة له)" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required dir="ltr" />
          <Input label="رقم الهاتف" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} dir="ltr" />
          <Input label="صلة القرابة" value={formData.relationship} onChange={e => setFormData({...formData, relationship: e.target.value})} required placeholder="أخ، زوجة، صديق..." />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>حفظ الوصي</Button>
            <Button type="button" variant="ghost" onClick={closeModal}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
