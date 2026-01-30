
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, AlertCircle } from 'lucide-react';
import { PerfumeOil, Company } from '../types';
import { CATEGORIES, LOW_STOCK_THRESHOLD } from '../constants';

interface InventoryProps {
  oils: PerfumeOil[];
  companies: Company[];
  onAdd: (oil: PerfumeOil) => void;
  onUpdate: (id: string, oil: Partial<PerfumeOil>) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ oils, companies, onAdd, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<PerfumeOil>>({
    name: '',
    company: companies[0]?.name || '',
    category: CATEGORIES[0],
    currentWeight: 0,
    purchasePricePerGram: 0,
    salePricePerGram: 0,
    macerationPercentage: 0,
    macerationDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;
    
    onAdd({
      ...formData as PerfumeOil,
      id: Date.now().toString(),
      addedDate: new Date().toISOString()
    });
    
    setShowAddForm(false);
    setFormData({
      name: '',
      company: companies[0]?.name || '',
      category: CATEGORIES[0],
      currentWeight: 0,
      purchasePricePerGram: 0,
      salePricePerGram: 0,
      macerationPercentage: 0,
      macerationDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">إدارة المخزون</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <Plus size={20} />
          إضافة زيت جديد
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <label className="block text-sm font-medium mb-1">اسم العطر</label>
            <input 
              required
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الشركة المصنعة</label>
            <select 
              value={formData.company} 
              onChange={e => setFormData({...formData, company: e.target.value})}
              className="w-full border p-2 rounded-lg"
            >
              {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الصنف</label>
            <select 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full border p-2 rounded-lg"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الوزن الحالي (غرام)</label>
            <input 
              required
              type="number" 
              value={formData.currentWeight} 
              onChange={e => setFormData({...formData, currentWeight: Number(e.target.value)})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">سعر الشراء / غرام</label>
            <input 
              type="number" 
              value={formData.purchasePricePerGram} 
              onChange={e => setFormData({...formData, purchasePricePerGram: Number(e.target.value)})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">سعر البيع / غرام</label>
            <input 
              type="number" 
              value={formData.salePricePerGram} 
              onChange={e => setFormData({...formData, salePricePerGram: Number(e.target.value)})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">تاريخ التعتيق</label>
            <input 
              type="date" 
              value={formData.macerationDate} 
              onChange={e => setFormData({...formData, macerationDate: e.target.value})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نسبة التعتيق (%)</label>
            <input 
              type="number" 
              value={formData.macerationPercentage} 
              onChange={e => setFormData({...formData, macerationPercentage: Number(e.target.value)})}
              className="w-full border p-2 rounded-lg" 
            />
          </div>
          <div className="md:col-span-3 flex justify-end gap-2 mt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-500 px-4 py-2 hover:bg-gray-100 rounded-lg">إلغاء</button>
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700">حفظ الزيت</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">اسم الزيت</th>
              <th className="p-4 font-semibold text-gray-600">الشركة</th>
              <th className="p-4 font-semibold text-gray-600 text-center">الوزن (غرام)</th>
              <th className="p-4 font-semibold text-gray-600">سعر البيع</th>
              <th className="p-4 font-semibold text-gray-600">التعتيق (%)</th>
              <th className="p-4 font-semibold text-gray-600">الحالة</th>
              <th className="p-4 font-semibold text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {oils.map(oil => (
              <tr key={oil.id} className={`${oil.currentWeight <= LOW_STOCK_THRESHOLD ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                <td className="p-4 font-medium">{oil.name}</td>
                <td className="p-4 text-gray-600">{oil.company}</td>
                <td className={`p-4 text-center font-bold ${oil.currentWeight <= LOW_STOCK_THRESHOLD ? 'text-red-600' : ''}`}>
                  {oil.currentWeight} غ
                </td>
                <td className="p-4">{oil.salePricePerGram.toLocaleString()} د.ع</td>
                <td className="p-4">{oil.macerationPercentage}% <span className="text-xs text-gray-400 block">{oil.macerationDate}</span></td>
                <td className="p-4">
                  {oil.currentWeight <= LOW_STOCK_THRESHOLD ? (
                    <span className="flex items-center gap-1 text-red-600 text-sm font-bold animate-pulse">
                      <AlertCircle size={14} />
                      نقص حاد
                    </span>
                  ) : (
                    <span className="text-green-600 text-sm">متوفر</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => onDelete(oil.id)} className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {oils.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-gray-500 italic">لا توجد عطور مضافة حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
