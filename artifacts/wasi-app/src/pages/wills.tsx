import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, PageHeader, Modal, Input, Textarea, Badge } from '@/components/ui-components';
import { useGetWills, useCreateWill, useUpdateWill, useDeleteWill, getGetWillsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, FileText, Lock, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function Wills() {
  const queryClient = useQueryClient();
  const { data: wills = [], isLoading } = useGetWills();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWill, setEditingWill] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', content: '', isEncrypted: true });

  const { mutate: createWill, isPending: isCreating } = useCreateWill({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWillsQueryKey() });
        closeModal();
      }
    }
  });

  const { mutate: updateWill, isPending: isUpdating } = useUpdateWill({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWillsQueryKey() });
        closeModal();
      }
    }
  });

  const { mutate: deleteWill } = useDeleteWill({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetWillsQueryKey() })
    }
  });

  const openModal = (will: any = null) => {
    if (will) {
      setEditingWill(will);
      setFormData({ title: will.title, content: will.content, isEncrypted: will.isEncrypted });
    } else {
      setEditingWill(null);
      setFormData({ title: '', content: '', isEncrypted: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWill) {
      updateWill({ id: editingWill.id, data: formData });
    } else {
      createWill({ data: formData });
    }
  };

  return (
    <Layout>
      <PageHeader 
        title="خزنة الوصايا" 
        description="أضف وصاياك وعدلها بثقة، جميع البيانات مشفرة وآمنة."
        action={
          <Button onClick={() => openModal()}>
            <Plus size={20} />
            إضافة وصية جديدة
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : wills.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4 text-primary">
            <Shield size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">الخزنة فارغة</h3>
          <p className="text-muted-foreground mb-6 max-w-md">ابدأ بتوثيق وصيتك الآن. يمكنك كتابة عدة وصايا وتخصيصها لأشخاص مختلفين.</p>
          <Button onClick={() => openModal()}>إنشاء الوصية الأولى</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wills.map(will => (
            <Card key={will.id} className="flex flex-col h-full hover:border-primary/30 transition-colors group relative overflow-hidden">
              {will.isEncrypted && (
                 <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                   <div className="bg-accent text-accent-foreground text-[10px] font-bold py-1 px-8 -rotate-45 -translate-x-6 translate-y-3 flex items-center justify-center gap-1 shadow-md">
                     <Lock size={10} /> مشفر
                   </div>
                 </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground truncate max-w-[150px] sm:max-w-[200px]">{will.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      تحديث: {format(new Date(will.updatedAt), 'yyyy/MM/dd')}
                    </p>
                  </div>
                </div>
                <Badge variant={will.status === 'active' ? 'success' : will.status === 'draft' ? 'warning' : 'default'}>
                  {will.status === 'active' ? 'نشطة' : will.status === 'draft' ? 'مسودة' : 'تم التسليم'}
                </Badge>
              </div>
              
              <div className="flex-1 bg-muted/30 rounded-xl p-4 mb-6 line-clamp-3 text-sm text-foreground/80 leading-relaxed border border-border/50">
                {will.content}
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                <Button variant="outline" className="flex-1 py-2" onClick={() => openModal(will)}>
                  <Edit2 size={16} /> تعديل
                </Button>
                <Button variant="ghost" className="px-3 py-2 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {
                  if(confirm('هل أنت متأكد من حذف هذه الوصية؟')) deleteWill({ id: will.id });
                }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingWill ? 'تعديل الوصية' : 'إضافة وصية جديدة'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="عنوان الوصية"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            required
            placeholder="مثال: وصيتي لأبنائي"
          />
          
          <Textarea
            label="نص الوصية"
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            required
            placeholder="اكتب تفاصيل وصيتك هنا..."
            className="min-h-[200px]"
          />
          
          <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-xl border border-accent/20 text-accent-foreground">
            <Lock className="text-accent" />
            <div>
              <p className="font-semibold text-sm text-foreground">تشفير البيانات</p>
              <p className="text-xs text-muted-foreground mt-1">يتم تشفير نص الوصية بخوارزمية متقدمة ولن يفك تشفيرها إلا للأوصياء المحددين.</p>
            </div>
            <div className="mr-auto">
               <input type="checkbox" checked={formData.isEncrypted} onChange={e => setFormData({...formData, isEncrypted: e.target.checked})} className="w-5 h-5 accent-primary" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>
              {editingWill ? 'حفظ التعديلات' : 'حفظ الوصية'}
            </Button>
            <Button type="button" variant="ghost" onClick={closeModal}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
