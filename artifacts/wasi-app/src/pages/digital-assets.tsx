import React, { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, Button, PageHeader, Modal, Input, Select, Badge, Textarea } from '@/components/ui-components';
import { useGetDigitalAssets, useCreateDigitalAsset, useUpdateDigitalAsset, useDeleteDigitalAsset, getGetDigitalAssetsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Globe, Twitter, Mail, Bitcoin, CreditCard, Lock, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';

export default function DigitalAssets() {
  const queryClient = useQueryClient();
  const { data: assets = [], isLoading } = useGetDigitalAssets();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({ platform: '', accountIdentifier: '', instructions: '', action: 'close', encryptedCredentials: '' });
  const [visibleCreds, setVisibleCreds] = useState<Record<string, boolean>>({});

  const { mutate: createAsset, isPending: isCreating } = useCreateDigitalAsset({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetDigitalAssetsQueryKey() }); closeModal(); } }
  });

  const { mutate: updateAsset, isPending: isUpdating } = useUpdateDigitalAsset({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetDigitalAssetsQueryKey() }); closeModal(); } }
  });

  const { mutate: deleteAsset } = useDeleteDigitalAsset({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetDigitalAssetsQueryKey() }) }
  });

  const openModal = (asset: any = null) => {
    if (asset) {
      setEditingId(asset.id);
      setFormData({ ...asset, accountIdentifier: asset.accountIdentifier || '', encryptedCredentials: asset.encryptedCredentials || '' });
    } else {
      setEditingId(null);
      setFormData({ platform: '', accountIdentifier: '', instructions: '', action: 'close', encryptedCredentials: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAsset({ id: editingId, data: formData });
    } else {
      createAsset({ data: formData });
    }
  };

  const actionMap: Record<string, { label: string, color: string }> = {
    close: { label: 'إغلاق الحساب', color: 'destructive' },
    transfer: { label: 'نقل الملكية', color: 'primary' },
    inherit: { label: 'توارث', color: 'success' },
    donate: { label: 'صدقة جارية', color: 'warning' }
  };

  const toggleVisibility = (id: string) => {
    setVisibleCreds(prev => ({...prev, [id]: !prev[id]}));
  };

  return (
    <Layout>
      <PageHeader 
        title="الإرث الرقمي" 
        description="أدر حساباتك، محافظك الرقمية، وبريدك الإلكتروني. حدد مصيرها بأمان تام."
        action={
          <Button onClick={() => openModal()}>
            <Plus size={20} />
            إضافة أصل رقمي
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      ) : assets.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-500">
            <Globe size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2">لا يوجد إرث رقمي</h3>
          <p className="text-muted-foreground mb-6 max-w-md">أضف حسابات السوشيال ميديا، المحافظ الرقمية، أو البريد الإلكتروني وحدد ما يجب فعله بها.</p>
          <Button onClick={() => openModal()}>إضافة أول حساب</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assets.map(asset => {
            const actionInfo = actionMap[asset.action] || actionMap.close;
            return (
              <Card key={asset.id} className="flex flex-col h-full hover:border-primary/30 group">
                <div className="flex justify-between items-start mb-4 border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" dir="ltr">{asset.platform}</h3>
                      <p className="text-sm text-muted-foreground" dir="ltr">{asset.accountIdentifier}</p>
                    </div>
                  </div>
                  <Badge variant={actionInfo.color as any}>{actionInfo.label}</Badge>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold mb-1 text-foreground/80">التعليمات للأوصياء:</p>
                  <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50">{asset.instructions}</p>
                </div>

                {asset.encryptedCredentials && (
                  <div className="mt-auto mb-4 bg-accent/5 border border-accent/20 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-accent-foreground">
                      <Lock size={16} className="text-accent" />
                      <span className="text-sm font-mono tracking-widest">
                        {visibleCreds[asset.id] ? asset.encryptedCredentials : '••••••••••••••••'}
                      </span>
                    </div>
                    <button onClick={() => toggleVisibility(asset.id)} className="text-muted-foreground hover:text-primary">
                      {visibleCreds[asset.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-auto">
                  <Button variant="outline" className="flex-1 py-2 text-sm" onClick={() => openModal(asset)}>
                    <Edit2 size={16} /> تعديل
                  </Button>
                  <Button variant="ghost" className="px-3 py-2 text-destructive hover:bg-destructive/10" onClick={() => {
                    if(confirm('حذف هذا الأصل؟')) deleteAsset({ id: asset.id });
                  }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? 'تعديل بيانات الأصل' : 'إضافة أصل رقمي جديد'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="المنصة / الخدمة" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} required placeholder="Google, Twitter, Binance..." dir="ltr" />
          
          <Input label="معرف الحساب (اسم المستخدم أو البريد)" value={formData.accountIdentifier} onChange={e => setFormData({...formData, accountIdentifier: e.target.value})} dir="ltr" placeholder="@username" />
          
          <Select 
            label="الإجراء المطلوب تنفيذه" 
            value={formData.action} 
            onChange={e => setFormData({...formData, action: e.target.value})}
            options={[
              { value: 'close', label: 'إغلاق وحذف الحساب نهائياً' },
              { value: 'transfer', label: 'نقل الإدارة لشخص آخر' },
              { value: 'inherit', label: 'توارث الأصول (محافظ مالية)' },
              { value: 'donate', label: 'تحويل لصدقة جارية (تطبيقات دعوية)' }
            ]}
          />

          <Textarea label="تعليمات التنفيذ للأوصياء" value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} required placeholder="اكتب الخطوات بوضوح ليتبعها الوصي..." />
          
          <div className="p-4 bg-muted/40 border border-border rounded-xl">
             <div className="flex items-center gap-2 mb-3 text-primary font-semibold">
               <Lock size={18} /> بيانات الدخول المشفرة (اختياري)
             </div>
             <Input label="كلمة المرور / المفتاح الخاص" value={formData.encryptedCredentials} onChange={e => setFormData({...formData, encryptedCredentials: e.target.value})} dir="ltr" type="password" placeholder="يتم تشفيره قبل الحفظ في القاعدة" />
          </div>

          <div className="flex gap-3 pt-6">
            <Button type="submit" className="flex-1" isLoading={isCreating || isUpdating}>حفظ الأصل الرقمي</Button>
            <Button type="button" variant="ghost" onClick={closeModal}>إلغاء</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
