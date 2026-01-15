import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  User,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useOrderStore, type Order } from "@/store/order";

interface OrdersTabProps {
  isAdmin: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
  order,
  open,
  onOpenChange,
  isAdmin,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details
          </DialogTitle>
          <DialogDescription>
            Order ID: <span className="font-mono">{order._id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Order Date</p>
              <p className="text-sm">
                {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Status</p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  STATUS_COLORS[order.status]
                }`}
              >
                {STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          {isAdmin && order.user && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{order.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{order.user.email}</span>
                </div>
              </div>
            </div>
          )}

          {order.shippingAddress && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Address
              </h4>
              <p className="text-sm text-slate-600">
                {order.shippingAddress.street}
              </p>
              <p className="text-sm text-slate-600">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm text-slate-600">
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </h4>
            <p className="text-sm text-slate-600">
              {order.paymentMethod || "Cash on Delivery"}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Item
                    </th>
                    <th className="text-center py-2 px-3 font-medium text-slate-600">
                      Qty
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-slate-600">
                      Price
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-slate-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {(item.color || item.size) && (
                              <p className="text-xs text-slate-500">
                                {item.color} {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-2 px-3">{item.quantity}</td>
                      <td className="text-right py-2 px-3">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="text-right py-2 px-3 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr className="border-t">
                    <td
                      colSpan={3}
                      className="py-2 px-3 text-right font-semibold"
                    >
                      Total Amount
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-lg">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OrdersTab: React.FC<OrdersTabProps> = ({ isAdmin }) => {
  const {
    orders,
    isLoading: storeLoading,
    statusCounts,
    fetchAllOrders,
    fetchUserOrders,
    updateOrderStatus,
  } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsTabLoading(true);
    try {
      if (isAdmin) {
        const result = await fetchAllOrders(pagination.page, statusFilter);
        if (result) {
          setPagination((prev) => ({
            ...prev,
            total: result.total,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage,
          }));
        }
      } else {
        await fetchUserOrders();
      }
    } finally {
      setIsTabLoading(false);
    }
  }, [isAdmin, pagination.page, statusFilter, fetchAllOrders, fetchUserOrders]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  React.useEffect(() => {
    if (!isAdmin) {
      setPagination((prev) => ({ ...prev, total: orders.length }));
    }
  }, [orders.length, isAdmin]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const displayStatusCounts = isAdmin ? statusCounts : {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const isLoading = storeLoading || (isTabLoading && orders.length === 0);

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {isAdmin ? "All Orders" : "My Orders"} ({pagination.total})
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setStatusFilter(status);
                      setPagination((prev) => ({ ...prev, page: 1 }));
                    }}
                  >
                    {STATUS_LABELS[status]}
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                      {displayStatusCounts[status as keyof typeof displayStatusCounts]}
                    </span>
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {isTabLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {!isTabLoading && filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No orders found
          </h3>
          <p className="text-slate-500">
            {isAdmin
              ? "No orders have been placed yet"
              : "You haven't placed any orders yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Order ID
                  </th>
                  {isAdmin && (
                    <th className="text-left py-3 px-4 font-medium text-slate-600">
                      Customer
                    </th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                        {order._id.slice(-8)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.user?.name}</p>
                          <p className="text-xs text-slate-500">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                    )}
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-900">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[order.status]
                        }`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {isAdmin && order.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(order._id, "processing")
                            }
                          >
                            Process
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-600 px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <OrderDetailDialog
        order={selectedOrder}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default OrdersTab;
