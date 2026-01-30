
import React, { useState } from 'react';
import { ShoppingCart, Plus, Printer, Trash2, User, Search } from 'lucide-react';
import { PerfumeOil, Order, SaleItem } from '../types';

interface SalesProps {
  oils: PerfumeOil[];
  orders: Order[];
  onOrderCreated: (order: Order) => void;
  shopName: string;
}

const Sales: React.FC<SalesProps> = ({ oils, orders, onOrderCreated, shopName }) => {
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedOilId, setSelectedOilId] = useState('');
  const [weight, setWeight] = useState<number>(0);
  const [showInvoice, setShowInvoice] = useState<Order | null>(null);

  const addToCart = () => {
    const oil = oils.find(o => o.id === selectedOilId);
    if (!oil || weight <= 0) return;
    
    if (weight > oil.currentWeight) {
      alert('الكمية المطلوبة أكبر من المخزون المتوفر!');
      return;
    }

    const existing = cart.find(item => item.oilId === oil.id);
    if (existing) {
      setCart(cart.map(item => item.oilId === oil.id ? { ...item, weightSold: item.weightSold + weight } : item));
    } else {
      setCart([...cart, { oilId: oil.id, oilName: oil.name, weightSold: weight, priceAtSale: oil.salePricePerGram }]);
    }
    
    setWeight(0);
    setSelectedOilId('');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.oilId !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.weightSold * item.priceAtSale), 0);

  const submitOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: customerName || 'زبون عام',
      date: new Date().toLocaleString('ar-EG'),
      items: [...cart],
      totalAmount: total
    };
    onOrderCreated(newOrder);
    setCart([]);
    setCustomerName('');
    setShowInvoice(newOrder);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 no-print">
        {/* New Order Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" />
            إنشاء طلبية جديدة
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم الزبون</label>
              <div className="relative">
                <User className="absolute right-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full border pr-10 p-2 rounded-lg" 
                  placeholder="اختياري..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">اختر الزيت</label>
                <select 
                  value={selectedOilId} 
                  onChange={e => setSelectedOilId(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">-- اختر --</option>
                  {oils.map(oil => (
                    <option key={oil.id} value={oil.id} disabled={oil.currentWeight <= 0}>
                      {oil.name} ({oil.currentWeight}غ)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الكمية (غرام)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={weight || ''} 
                    onChange={e => setWeight(Number(e.target.value))}
                    className="w-full border p-2 rounded-lg" 
                  />
                  <button 
                    onClick={addToCart}
                    className="bg-indigo-600 text-white px-3 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Preview */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-bold mb-3">قائمة الزيوت في الطلب:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.oilId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{item.oilName}</p>
                      <p className="text-sm text-gray-500">{item.weightSold} غ × {item.priceAtSale} د.ع</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">{(item.weightSold * item.priceAtSale).toLocaleString()} د.ع</p>
                      <button onClick={() => removeFromCart(item.oilId)} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 && <p className="text-gray-400 text-center py-4">الطلبية فارغة</p>}
              </div>
              <div className="mt-4 flex justify-between items-center border-t pt-4">
                <span className="text-lg font-bold">المجموع الكلي:</span>
                <span className="text-2xl font-black text-indigo-700">{total.toLocaleString()} د.ع</span>
              </div>
              <button 
                onClick={submitOrder}
                disabled={cart.length === 0}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition shadow-lg"
              >
                إتمام الطلبية
              </button>
            </div>
          </div>
        </div>

        {/* Orders History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-xl font-bold mb-6">سجل الطلبيات الأخيرة</h3>
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded-xl p-4 hover:border-indigo-200 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-indigo-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <button 
                    onClick={() => setShowInvoice(order)}
                    className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"
                  >
                    <Printer size={18} />
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  {order.items.map(i => i.oilName).join('، ')}
                </div>
                <div className="mt-2 text-right font-bold text-gray-800">
                  {order.totalAmount.toLocaleString()} د.ع
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoice Modal / Print View */}
      {showInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden">
            <div id="invoice-content" className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-indigo-900">{shopName}</h1>
                <p className="text-gray-500">فاتورة مبيعات عطور زيتية</p>
                <div className="h-1 w-24 bg-indigo-600 mx-auto mt-2"></div>
              </div>
              
              <div className="flex justify-between mb-8 text-sm">
                <div>
                  <p className="font-bold">اسم الزبون: <span className="font-normal">{showInvoice.customerName}</span></p>
                  <p className="font-bold">رقم الطلب: <span className="font-normal">{showInvoice.id}</span></p>
                </div>
                <div className="text-left">
                  <p className="font-bold">التاريخ: <span className="font-normal">{showInvoice.date}</span></p>
                </div>
              </div>

              <table className="w-full text-right mb-8">
                <thead className="border-b-2 border-indigo-900">
                  <tr>
                    <th className="py-2">الزيت</th>
                    <th className="py-2">الوزن</th>
                    <th className="py-2 text-left">السعر</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {showInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3">{item.oilName}</td>
                      <td className="py-3">{item.weightSold} غ</td>
                      <td className="py-3 text-left">{(item.weightSold * item.priceAtSale).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-indigo-900 font-black">
                    <td colSpan={2} className="py-4 text-lg">المجموع الصافي:</td>
                    <td className="py-4 text-left text-lg text-indigo-900">{showInvoice.totalAmount.toLocaleString()} د.ع</td>
                  </tr>
                </tfoot>
              </table>

              <div className="text-center text-xs text-gray-400 mt-10">
                <p>شكراً لزيارتكم، نأمل رؤيتكم مرة أخرى</p>
                <p>صمم بواسطة نظام إدارة العطور الاحترافي</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 flex gap-3">
              <button 
                onClick={handlePrint}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
              >
                <Printer size={20} />
                طباعة الفاتورة
              </button>
              <button 
                onClick={() => setShowInvoice(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actual hidden print-only div for system print */}
      <div className="print-only p-10 bg-white min-h-screen text-black font-serif">
        {showInvoice && (
           <div className="max-w-xl mx-auto border-2 border-black p-6">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black mb-2">{shopName}</h1>
                <p className="border-y-2 border-black py-1">فاتورة مبيعات</p>
              </div>
              <div className="flex justify-between mb-6">
                <p>الزبون: {showInvoice.customerName}</p>
                <p>التاريخ: {showInvoice.date}</p>
              </div>
              <table className="w-full mb-10">
                <thead className="border-b border-black text-right">
                  <tr>
                    <th>الصنف</th>
                    <th>الوزن</th>
                    <th className="text-left">السعر</th>
                  </tr>
                </thead>
                <tbody className="text-right">
                  {showInvoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-100">
                      <td className="py-2">{item.oilName}</td>
                      <td>{item.weightSold} غ</td>
                      <td className="text-left">{(item.weightSold * item.priceAtSale).toLocaleString()} د.ع</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-left text-2xl font-bold border-t-2 border-black pt-4">
                المجموع: {showInvoice.totalAmount.toLocaleString()} د.ع
              </div>
              <p className="mt-10 text-center italic">نشكر اختياركم {shopName}</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
