import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrdersTab from "./components/OrdersTab";

const OrdersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Store
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
              <p className="text-sm text-slate-500">View and track your orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersTab isAdmin={false} />
      </div>
    </div>
  );
};

export default OrdersPage;
