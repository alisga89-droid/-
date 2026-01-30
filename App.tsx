
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Settings, Plus, Printer, Trash2, AlertCircle } from 'lucide-react';
import { PerfumeOil, Order, Company } from './types';
import { INITIAL_COMPANIES } from './constants';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'settings'>('dashboard');
  const [oils, setOils] = useState<PerfumeOil[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [shopName, setShopName] = useState('دار اروما للعطور  ');
  const [logoUrl, setLogoUrl] = useState('https://picsum.photos/100/100');

  // Load data from localStorage
  useEffect(() => {
    const savedOils = localStorage.getItem('perfume_oils');
    const savedOrders = localStorage.getItem('perfume_orders');
    const savedCompanies = localStorage.getItem('perfume_companies');
    const savedShopName = localStorage.getItem('perfume_shop_name');

    if (savedOils) setOils(JSON.parse(savedOils));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedCompanies) setCompanies(JSON.parse(savedCompanies));
    if (savedShopName) setShopName(savedShopName);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('perfume_oils', JSON.stringify(oils));
    localStorage.setItem('perfume_orders', JSON.stringify(orders));
    localStorage.setItem('perfume_companies', JSON.stringify(companies));
    localStorage.setItem('perfume_shop_name', shopName);
  }, [oils, orders, companies, shopName]);

  const handleAddOil = (newOil: PerfumeOil) => {
    setOils([...oils, newOil]);
  };

  const handleUpdateOil = (id: string, updatedOil: Partial<PerfumeOil>) => {
    setOils(oils.map(oil => oil.id === id ? { ...oil, ...updatedOil } : oil));
  };

  const handleDeleteOil = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الزيت؟')) {
      setOils(oils.filter(oil => oil.id !== id));
    }
  };

  const handleCreateOrder = (order: Order) => {
    setOrders([order, ...orders]);
    // Deduct weights from inventory
    const updatedOils = [...oils];
    order.items.forEach(item => {
      const idx = updatedOils.findIndex(o => o.id === item.oilId);
      if (idx !== -1) {
        updatedOils[idx].currentWeight -= item.weightSold;
      }
    });
    setOils(updatedOils);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-indigo-900 text-white p-6 no-print">
        <div className="flex flex-col items-center mb-10">
          <img src={logoUrl} alt="Logo" className="w-20 h-20 rounded-full border-4 border-indigo-500 mb-4 shadow-lg object-cover" />
          <h1 className="text-xl font-bold text-center">{shopName}</h1>
        </div>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <LayoutDashboard size={20} />
            <span>لوحة التحكم</span>
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition ${activeTab === 'inventory' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <Package size={20} />
            <span>المخزن والزيوت</span>
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition ${activeTab === 'sales' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <ShoppingCart size={20} />
            <span>المبيعات والطلبيات</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg transition ${activeTab === 'settings' ? 'bg-indigo-700' : 'hover:bg-indigo-800'}`}
          >
            <Settings size={20} />
            <span>إعدادات النظام</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard oils={oils} orders={orders} />}
        {activeTab === 'inventory' && (
          <Inventory 
            oils={oils} 
            companies={companies} 
            onAdd={handleAddOil} 
            onUpdate={handleUpdateOil} 
            onDelete={handleDeleteOil} 
          />
        )}
        {activeTab === 'sales' && (
          <Sales 
            oils={oils} 
            orders={orders} 
            onOrderCreated={handleCreateOrder}
            shopName={shopName}
          />
        )}
        {activeTab === 'settings' && (
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">إعدادات المتجر</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المحل</label>
                <input 
                  type="text" 
                  value={shopName} 
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط الشعار (صورة)</label>
                <input 
                  type="text" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">إضافة شركة جديدة</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="new-company"
                    className="flex-1 border p-2 rounded-lg"
                    placeholder="اسم الشركة"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('new-company') as HTMLInputElement;
                      if (input.value) {
                        setCompanies([...companies, { id: Date.now().toString(), name: input.value }]);
                        input.value = '';
                      }
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    إضافة
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium mb-2">الشركات المسجلة</h3>
                <div className="flex flex-wrap gap-2">
                  {companies.map(c => (
                    <span key={c.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {c.name}
                      <button onClick={() => setCompanies(companies.filter(x => x.id !== c.id))} className="text-red-500 hover:text-red-700">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
