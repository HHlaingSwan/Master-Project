import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Mail, Lock, Save, ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useOrderStore, type Order } from "@/store/order";
import { toast } from "@/lib/toast";

const Profile: React.FC = () => {
  const { authUser, updateNameAndEmail, changePassword } = useAuthStore();
  const { orders, isLoading, fetchUserOrders, cancelOrder } = useOrderStore();
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const canChangePassword = useMemo(() => {
    if (!authUser?.lastPasswordChange) return true;
    const timeSinceLastChange = Date.now() - new Date(authUser.lastPasswordChange).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    return timeSinceLastChange >= fortyEightHours;
  }, [authUser?.lastPasswordChange]);

  const passwordHoursRemaining = useMemo(() => {
    if (!authUser?.lastPasswordChange) return 0;
    const timeSinceLastChange = Date.now() - new Date(authUser.lastPasswordChange).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const remaining = fortyEightHours - timeSinceLastChange;
    return remaining > 0 ? Math.ceil(remaining / (1000 * 60 * 60)) : 0;
  }, [authUser?.lastPasswordChange]);

  const canUpdateProfile = useMemo(() => {
    if (!authUser?.lastProfileUpdate) return true;
    const timeSinceLastUpdate = Date.now() - new Date(authUser.lastProfileUpdate).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    return timeSinceLastUpdate >= fortyEightHours;
  }, [authUser?.lastProfileUpdate]);

  const profileHoursRemaining = useMemo(() => {
    if (!authUser?.lastProfileUpdate) return 0;
    const timeSinceLastUpdate = Date.now() - new Date(authUser.lastProfileUpdate).getTime();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    const remaining = fortyEightHours - timeSinceLastUpdate;
    return remaining > 0 ? Math.ceil(remaining / (1000 * 60 * 60)) : 0;
  }, [authUser?.lastProfileUpdate]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNameAndEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);

    try {
      await updateNameAndEmail(formData);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);

    try {
      await changePassword(passwordData);
      toast.success("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to update password");
    } finally {
      setIsLoadingState(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
    } catch {
      // Error handled in store
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const STATUS_ICONS: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3.5 h-3.5" />,
    processing: <Clock className="w-3.5 h-3.5" />,
    shipped: <Truck className="w-3.5 h-3.5" />,
    delivered: <CheckCircle className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Store
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
              <p className="text-sm text-slate-500">
                Manage your account settings
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canUpdateProfile ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800">
                    You can update your profile again in {profileHoursRemaining} hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNameAndEmail} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoadingState}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoadingState ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order History
              </CardTitle>
              <CardDescription>
                View and track your orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {order._id}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_COLORS[order.status]
                          }`}
                        >
                          {STATUS_ICONS[order.status]}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600 truncate max-w-[70%]">
                              {item.name}
                              {item.color && ` (${item.color})`}
                              {item.size && ` (${item.size})`}
                              {" x "}
                              {item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-slate-500">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="font-semibold text-slate-900">
                          Total: ${order.totalAmount.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!canChangePassword ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800">
                    You can change your password again in {passwordHoursRemaining} hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoadingState}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoadingState ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order ID: <span className="font-mono">{selectedOrder?._id}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Order Date</p>
                  <p className="text-sm">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()} at{" "}
                    {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[selectedOrder.status]
                    }`}
                  >
                    {STATUS_ICONS[selectedOrder.status]}
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </span>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Shipping Address
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.shippingAddress.street}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-slate-600">
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              )}

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Item</th>
                        <th className="text-center py-2 px-3 font-medium text-slate-600">Qty</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Price</th>
                        <th className="text-right py-2 px-3 font-medium text-slate-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
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
                          <td className="text-right py-2 px-3">${item.price.toFixed(2)}</td>
                          <td className="text-right py-2 px-3 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr className="border-t">
                        <td colSpan={3} className="py-2 px-3 text-right font-semibold">Total Amount</td>
                        <td className="py-2 px-3 text-right font-bold text-lg">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
