import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart";
import { useOrderStore } from "@/store/order";
import { useAuthStore } from "@/store/auth";
import { toast } from "@/lib/toast";
import { ShoppingCart, Truck, Check } from "lucide-react";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { items, clearCart } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();
  const { authUser } = useAuthStore();

  const [step, setStep] = useState<"shipping" | "confirmation" | "success">(
    "shipping"
  );
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.zipCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("confirmation");
  };

  const handleConfirmOrder = async () => {
    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        productId: String(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        color: item.color,
        size: item.size,
      }));
      await createOrder(orderItems, totalAmount, shippingAddress);
      clearCart();
      setStep("success");
    } catch {
      // Error handled in store
    }
  };

  const handleClose = () => {
    setStep("shipping");
    setShippingAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Checkout
          </DialogTitle>
          <DialogDescription>
            {step === "shipping" && "Enter your shipping address"}
            {step === "confirmation" && "Review your order"}
            {step === "success" && "Your order has been placed!"}
          </DialogDescription>
        </DialogHeader>

        {step === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-slate-500 mb-6">
              Thank you for your purchase, {authUser?.name}!
            </p>
            <p className="text-sm text-slate-400 mb-6">
              You will receive a confirmation email shortly.
            </p>
            <Button onClick={handleClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        ) : step === "confirmation" ? (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-slate-900">Order Summary</h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600">
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
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Shipping Address
              </h4>
              <p className="text-sm text-slate-600">{shippingAddress.street}</p>
              <p className="text-sm text-slate-600">
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zipCode}
              </p>
              <p className="text-sm text-slate-600">
                {shippingAddress.country}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("shipping")}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmOrder}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Order"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={shippingAddress.zipCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      zipCode: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="USA"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mt-4">
              <div className="flex justify-between font-semibold mb-2">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500">
                Payment method: Cash on Delivery
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Continue
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
