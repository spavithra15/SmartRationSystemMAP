import { useState } from 'react';
import { Package, Users, Bell, Store } from 'lucide-react';
import ProductList from './components/ProductList';
import BeneficiaryList from './components/BeneficiaryList';
import NotificationHistory from './components/NotificationHistory';
import StockUpdateModal from './components/StockUpdateModal';
import { Product } from './lib/supabase';

type Tab = 'products' | 'beneficiaries' | 'notifications';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  const handleUpdateSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ration Stock Management</h1>
              <p className="text-sm text-gray-600">Manage stock and notify beneficiaries</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('beneficiaries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'beneficiaries'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Beneficiaries
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
          </div>
        </div>

        <div key={refreshKey}>
          {activeTab === 'products' && (
            <ProductList onUpdateStock={handleUpdateStock} />
          )}
          {activeTab === 'beneficiaries' && <BeneficiaryList />}
          {activeTab === 'notifications' && <NotificationHistory />}
        </div>
      </main>

      {selectedProduct && (
        <StockUpdateModal
          product={selectedProduct}
          onClose={handleModalClose}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}

export default App;
