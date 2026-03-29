"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShoppingCart, Package, Loader2, Trash2, Plus, Minus,
  ArrowRight, ArrowLeft, CreditCard, Truck, FileText, CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { SHIPPING_OPTIONS, PAYMENT_METHODS } from "@/lib/constants/checkout";
import { formatPrice } from "@/lib/utils/format";
import { useCart } from "@/hooks/useCart";
import { getAddresses } from "@/lib/actions/address-actions";
import { createOrder } from "@/lib/actions/order-actions";
import type { CheckoutStep, ShippingOption, PaymentMethod, Address } from "./types";
import { AddressSelector } from "./AddressSelector";
import { ShippingSelector } from "./ShippingSelector";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { CheckoutSummary } from "./CheckoutSummary";

import { CouponInput } from "./CouponInput";
import type { Coupon } from "@/types/coupon";

const STEPS: { key: CheckoutStep; label: string; icon: typeof ShoppingCart }[] = [
  { key: "cart", label: "Keranjang", icon: ShoppingCart },
  { key: "shipping", label: "Pengiriman", icon: Truck },
  { key: "payment", label: "Pembayaran", icon: CreditCard },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const CheckoutContent = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    items, isLoading: cartLoading, subtotal, updateQuantity: updateCartQuantity,
    removeItem: removeCartItem, clearCart, isUpdating,
  } = useCart();

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [direction, setDirection] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  useEffect(() => {
    if (step === "shipping" && session?.user) {
      getAddresses().then((addrs) => setAddresses(addrs as unknown as Address[]));
    }
  }, [step, session]);

  // Redirect to standalone confirmation page when order is complete
  useEffect(() => {
    if (step === "success" && createdOrderNumber) {
      const params = new URLSearchParams({ order: createdOrderNumber });
      if (selectedPayment?.id) params.set("payment", selectedPayment.id);
      router.replace(`/checkout/success?${params.toString()}`);
    }
  }, [step, createdOrderNumber, selectedPayment?.id, router]);

  const shippingCost =
    appliedCoupon?.type === "free_shipping" ? 0 : (selectedShipping?.price || 0);
  const total = Math.max(0, subtotal - couponDiscount + shippingCost);
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;
  const canProceedToShipping = items.length > 0;
  const canProceedToPayment = !!selectedAddress && !!selectedShipping;
  const canPlaceOrder = canProceedToPayment && !!selectedPayment;
  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  const handleApplyCoupon = (coupon: Coupon, discount: number) => {
    setAppliedCoupon(coupon);
    setCouponDiscount(discount);
    toast.success(`Kupon ${coupon.code} berhasil dipakai!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    toast.info("Kupon dihapus");
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) await removeCartItem(itemId);
    else await updateCartQuantity(itemId, newQuantity);
  };

  const removeFromCart = async (itemId: string) => {
    await removeCartItem(itemId);
    toast.success("Produk dihapus dari keranjang");
  };

  const goToStep = useCallback((newStep: CheckoutStep) => {
    const newIdx = STEPS.findIndex(s => s.key === newStep);
    const oldIdx = STEPS.findIndex(s => s.key === step);
    setDirection(newIdx > oldIdx ? 1 : -1);
    setStep(newStep);
  }, [step]);

  const goToNextStep = useCallback(() => {
    if (step === "cart" && canProceedToShipping) { setDirection(1); setStep("shipping"); }
    else if (step === "shipping" && canProceedToPayment) { setDirection(1); setStep("payment"); }
  }, [step, canProceedToShipping, canProceedToPayment]);

  const goToPreviousStep = useCallback(() => {
    if (step === "shipping") { setDirection(-1); setStep("cart"); }
    else if (step === "payment") { setDirection(-1); setStep("shipping"); }
  }, [step]);

  const processPayment = async () => {
    if (!selectedAddressId || !selectedShipping || !selectedPayment) return;
    setIsProcessingPayment(true);
    const result = await createOrder({
      addressId: selectedAddressId, shippingMethod: selectedShipping.name,
      shippingCost, paymentMethod: selectedPayment.id, notes: orderNotes || undefined,
      couponCode: appliedCoupon?.code, discount: couponDiscount,
    });
    setIsProcessingPayment(false);
    if (result.error) { toast.error(result.error); return; }
    if (result.orderNumber) {
      // Clear the cart BEFORE redirecting to confirmation page
      await clearCart();
      setCreatedOrderNumber(result.orderNumber);
      setDirection(1);
      setStep("success");
    }
  };

  const resetCheckout = () => {
    setStep("cart");
    setDirection(0);
    setSelectedAddressId(null);
    setSelectedShipping(null);
    setSelectedPayment(null);
    setOrderNotes("");
    setCreatedOrderNumber(null);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  if (cartLoading) {
    return (
      <div className="container-page py-12 text-center">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container-page py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="font-serif text-2xl font-bold mb-2">Login Diperlukan</h1>
          <p className="text-muted-foreground mb-6">Silakan login untuk melanjutkan checkout</p>
          <Button asChild><Link href="/login?callbackUrl=/checkout">Login</Link></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== "success") {
    return (
      <div className="container-page py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="font-serif text-2xl font-bold mb-2">Keranjang Kosong</h1>
          <p className="text-muted-foreground mb-6">Tambahkan produk ke keranjang untuk melanjutkan</p>
          <Button asChild><Link href="/product">Lihat Produk</Link></Button>
        </div>
      </div>
    );
  }

  if (step === "success" && createdOrderNumber) {
    return (
      <div className="container-page py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Mengalihkan ke halaman konfirmasi...</p>
        </div>
      </div>
    );
  }

  const getButtonText = () => {
    if (step === "cart") return "Lanjut ke Pengiriman";
    if (step === "shipping") return "Lanjut ke Pembayaran";
    if (step === "payment") return isProcessingPayment ? "Memproses..." : "Bayar Sekarang";
    return "Lanjut";
  };

  const canProceed = () => {
    if (step === "cart") return canProceedToShipping;
    if (step === "shipping") return canProceedToPayment;
    if (step === "payment") return canPlaceOrder;
    return false;
  };

  const handleNext = async () => {
    if (step === "payment") await processPayment();
    else goToNextStep();
  };

  const summaryItems = items.map((item) => ({
    id: item.id, plant_id: item.plantId, quantity: item.quantity,
    plant: item.plant ? {
      name: item.plant.name, slug: item.plant.slug, price: item.plant.price,
      image_url: item.plant.images?.[0]?.src || null, stock: item.plant.stock,
    } : undefined,
  }));

  return (
    <div className="container-page py-6 pb-32 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 mt-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold">Checkout</h1>
        <div className="hidden md:flex items-center gap-1.5 ml-auto text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          <span>Transaksi aman &amp; terenkripsi</span>
        </div>
      </div>

      {/* ── Enhanced Progress Indicator ── */}
      <div className="mb-10">
        <div className="relative flex items-center justify-between max-w-lg mx-auto">
          {/* Background line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border" />
          {/* Progress line - animated */}
          <motion.div
            className="absolute top-5 left-[10%] h-0.5 bg-primary"
            initial={false}
            animate={{
              width: `${currentStepIndex === 0 ? 0 : currentStepIndex === 1 ? 40 : 80}%`,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />

          {STEPS.map((s, i) => {
            const isActive = step === s.key;
            const isCompleted = i < currentStepIndex;
            const isClickable = i <= currentStepIndex;

            return (
              <button
                key={s.key}
                onClick={() => isClickable && goToStep(s.key)}
                disabled={!isClickable}
                className="relative z-10 flex flex-col items-center gap-2 group"
              >
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isActive
                        ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }
                    ${isClickable && !isActive ? "cursor-pointer group-hover:scale-105" : ""}
                  `}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <s.icon className="w-5 h-5" />
                  )}
                </motion.div>
                <span
                  className={`text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-primary font-semibold"
                      : isCompleted
                        ? "text-primary"
                        : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-6"
            >

              {/* Step: Cart */}
              {step === "cart" && (
                <>
                  <Card className="p-4 md:p-6">
                    <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Keranjang Belanja ({items.length} item)
                    </h2>
                    <div className="space-y-0">
                      <AnimatePresence>
                        {items.map((item) => {
                          const imageUrl = item.plant?.images?.[0]?.src;
                          const lineTotal = (item.plant?.price || 0) * item.quantity;
                          return (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -30, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-3 md:gap-4 py-4 border-b border-border last:border-0"
                            >
                              <Link href={`/product/${item.plant?.slug || item.plantId}`}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 hover:opacity-80 transition-opacity"
                              >
                                {imageUrl ? (
                                  <Image src={imageUrl} alt={item.plant?.name || ""} width={80} height={80} className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground/50" />
                                  </div>
                                )}
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link href={`/product/${item.plant?.slug || item.plantId}`}
                                  className="font-medium text-sm hover:text-primary line-clamp-2 transition-colors"
                                >
                                  {item.plant?.name || "Unknown Plant"}
                                </Link>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  IDR {formatPrice(item.plant?.price || 0)} / item
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center gap-0 border border-border rounded-lg overflow-hidden">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none border-r border-border"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={isUpdating}>
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none border-l border-border"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      disabled={isUpdating}>
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold tabular-nums">
                                      IDR {formatPrice(lineTotal)}
                                    </span>
                                    <Button variant="ghost" size="icon"
                                      className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => removeFromCart(item.id)} disabled={isUpdating}>
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </Card>

                  {/* Coupon Input */}
                  <Card className="p-4 md:p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Kode Kupon / Promo
                    </h3>
                    <CouponInput
                      subtotal={subtotal}
                      appliedCoupon={appliedCoupon}
                      discount={couponDiscount}
                      onApply={handleApplyCoupon}
                      onRemove={handleRemoveCoupon}
                    />
                  </Card>
                </>
              )}

              {/* Step: Shipping */}
              {step === "shipping" && (
                <>
                  <Card className="p-4 md:p-6">
                    <AddressSelector selectedId={selectedAddressId} onSelect={setSelectedAddressId} />
                  </Card>
                  <Card className="p-4 md:p-6">
                    <ShippingSelector options={SHIPPING_OPTIONS} selected={selectedShipping} onSelect={setSelectedShipping} />
                  </Card>
                </>
              )}

              {/* Step: Payment */}
              {step === "payment" && (
                <>
                  <Card className="p-4 md:p-6">
                    <PaymentMethodSelector methods={PAYMENT_METHODS} selected={selectedPayment} onSelect={setSelectedPayment} />
                  </Card>
                  <Card className="p-4 md:p-6">
                    <div className="space-y-3">
                      <Label htmlFor="notes" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Catatan Pesanan (Opsional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Contoh: Tolong packing extra untuk tanaman, kirim pagi hari..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </Card>

                  {/* Order review card */}
                  <Card className="p-4 md:p-6 border-primary/30 bg-primary/5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      Ringkasan Pesanan
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alamat</span>
                        <span className="font-medium text-right max-w-[60%] truncate">
                          {selectedAddress?.label} — {selectedAddress?.city}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pengiriman</span>
                        <span className="font-medium">{selectedShipping?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pembayaran</span>
                        <span className="font-medium">{selectedPayment?.name || "—"}</span>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Desktop Navigation Buttons */}
          <div className="hidden md:flex items-center justify-between pt-4">
            {step !== "cart" ? (
              <Button variant="outline" onClick={goToPreviousStep} disabled={isProcessingPayment}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            ) : (
              <div />
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isProcessingPayment}
              className="min-w-[180px]"
              size="lg"
            >
              {isProcessingPayment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {getButtonText()}
              {step !== "payment" && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Sidebar Summary — desktop only */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <CheckoutSummary
              items={summaryItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              address={step !== "cart" ? selectedAddress : null}
              shippingMethod={step === "payment" ? selectedShipping : null}
              paymentMethod={step === "payment" ? selectedPayment : null}
              showDetails={step === "payment"}
              couponDiscount={couponDiscount}
              appliedCoupon={appliedCoupon}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 bg-background border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 space-y-2">
          {/* Price summary */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-bold tabular-nums">IDR {formatPrice(total)}</span>
          </div>
          {/* CTA buttons */}
          <div className="flex gap-2">
            {step !== "cart" && (
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={isProcessingPayment}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isProcessingPayment}
              className="flex-1 h-11 font-semibold"
            >
              {isProcessingPayment && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {getButtonText()}
              {step !== "payment" && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
