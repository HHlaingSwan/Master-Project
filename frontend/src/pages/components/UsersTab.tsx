import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Crown,
  Shield,
  Search,
  Eye,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/api";

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface UsersTabProps {
  users: User[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  paginationLoading: boolean;
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (page: number) => void;
  onToggleRole: (userId: string, currentRole: boolean) => void;
}

interface UserOrdersDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeTrigger: number;
}

const UserOrdersDialog: React.FC<UserOrdersDialogProps> = ({
  user,
  open,
  onOpenChange,
  onOpenChangeTrigger,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  React.useEffect(() => {
    setHasLoaded(false);
  }, [onOpenChangeTrigger]);

  React.useEffect(() => {
    if (open && user && !hasLoaded) {
      setLoading(true);
      axiosInstance
        .get(`/orders/user/${user._id}`)
        .then((res) => {
          if (res.data.data) {
            setOrders(res.data.data);
          }
        })
        .catch(console.error)
        .finally(() => {
          setLoading(false);
          setHasLoaded(true);
        });
    }
  }, [open, user, hasLoaded]);

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {user.name}'s Orders
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
              <p className="text-sm text-slate-500">Total Orders</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-sm text-slate-500">Total Spent</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === "delivered").length}
              </p>
              <p className="text-sm text-slate-500">Delivered</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-500">No orders found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Order ID
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Date
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Items
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Total
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-slate-600">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t">
                      <td className="py-2 px-3 font-mono text-xs">
                        {order._id.slice(-8)}
                      </td>
                      <td className="py-2 px-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-3">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                      </td>
                      <td className="py-2 px-3 font-medium">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "shipped"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UsersTab: React.FC<UsersTabProps> = ({
  users,
  loading,
  pagination,
  paginationLoading,
  searchTerm,
  onSearch,
  onPageChange,
  onToggleRole,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [ordersDialogTrigger, setOrdersDialogTrigger] = useState(0);

  const handleViewOrders = (user: User) => {
    setSelectedUser(user);
    setIsOrdersOpen(true);
    setOrdersDialogTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          All Users ({pagination.total})
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={onSearch}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No users found
          </h3>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    User
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Role
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600">
                    Joined
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <Shield className="w-3 h-3" />
                          User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrders(user)}
                          title="View Orders"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={user.isAdmin ? "outline" : "default"}
                          size="sm"
                          onClick={() => onToggleRole(user._id, user.isAdmin)}
                        >
                          {user.isAdmin ? "Remove Admin" : "Make Admin"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div
              className={`flex items-center justify-center gap-2 mt-6 ${
                paginationLoading ? "opacity-50" : ""
              }`}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage || paginationLoading}
                className="h-10 w-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-sm text-slate-600 px-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage || paginationLoading}
                className="h-10 w-10"
              >
                {paginationLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}
        </>
      )}

      <UserOrdersDialog
        user={selectedUser}
        open={isOrdersOpen}
        onOpenChange={setIsOrdersOpen}
        onOpenChangeTrigger={ordersDialogTrigger}
      />
    </div>
  );
};

export default UsersTab;
