
import React from 'react';
import { Package, ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';
import { PerfumeOil, Order } from '../types';
import { LOW_STOCK_THRESHOLD } from '../constants';

interface DashboardProps {
  oils: PerfumeOil[];
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ oils, orders }) => {
  const lowStockOils = oils.filter(o => o.currentWeight <= LOW_STOCK_THRESHOLD);
  const totalWeight = oils.reduce((sum, o) => sum + o.currentWeight, 0);
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPurchaseValue = oils.reduce((sum, o) => sum + (o.currentWeight * o.purchasePricePerGram), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-gray-800">نظرة عامة على المتجر</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-indigo-600 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">إجمالي المخزون</p>
            <p className="text-2xl font-black mt-1">{totalWeight.toLocaleString()} غرام</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <Package size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-green-600 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">إجمالي المبيعات</p>
            <p className="text-2xl font-black mt-1">{totalSales.toLocaleString()} د.ع</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <ShoppingBag size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-red-600 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">زيوت تحتاج تعبئة</p>
            <p className="text-2xl font-black mt-1">{lowStockOils.length}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-xl text-red-600">
            <AlertTriangle size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-r-4 border-amber-500 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">قيمة المخزن (شراء)</p>
            <p className="text-2xl font-black mt-1">{totalPurchaseValue.toLocaleString()} د.ع</p>
          </div>
          <div className="bg-amber-100 p-3 rounded-xl text-amber-500">
            <TrendingUp size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border overflow-hidden">
          <h3 className="text-xl font-bold mb-6 text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} />
            تنبيهات النقص (أقل من {LOW_STOCK_THRESHOLD} غ)
          </h3>
          <div className="space-y-3">
            {lowStockOils.map(oil => (
              <div key={oil.id} className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-bold">{oil.name}</p>
                  <p className="text-xs text-gray-500">{oil.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-red-600">{oil.currentWeight} غ</p>
                  <p className="text-xs text-red-400">تحتاج طلبية فورية</p>
                </div>
              </div>
            ))}
            {lowStockOils.length === 0 && (
              <p className="text-center text-gray-400 py-10">جميع الأصناف متوفرة بمخزون جيد</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="text-xl font-bold mb-6">نشاط المبيعات الأخير</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  {order.customerName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{order.totalAmount.toLocaleString()} د.ع</p>
                  <p className="text-[10px] text-gray-400">طلب رقم {order.id.split('-')[1]}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-gray-400 py-10">لا توجد مبيعات مسجلة اليوم</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
