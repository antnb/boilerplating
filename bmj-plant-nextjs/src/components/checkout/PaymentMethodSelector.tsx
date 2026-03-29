"use client";



import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Building2, Wallet } from "lucide-react";
import type { PaymentMethod } from "./types";

const getPaymentIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
        case "bank_transfer":
            return <Building2 className="w-5 h-5 text-blue-500" />;
        case "e_wallet":
            return <Wallet className="w-5 h-5 text-emerald-500" />;
        case "credit_card":
            return <CreditCard className="w-5 h-5 text-purple-500" />;
        default:
            return <CreditCard className="w-5 h-5" />;
    }
};

const getPaymentTypeLabel = (type: PaymentMethod["type"]) => {
    switch (type) {
        case "bank_transfer":
            return "Transfer Bank";
        case "e_wallet":
            return "E-Wallet";
        case "credit_card":
            return "Kartu Kredit";
        case "cod":
            return "Bayar di Tempat";
        default:
            return type;
    }
};

interface PaymentMethodSelectorProps {
    methods: PaymentMethod[];
    selected: PaymentMethod | null;
    onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({
    methods,
    selected,
    onSelect,
}: PaymentMethodSelectorProps) {
    // Group payment methods by type
    const groupedMethods = methods.reduce((acc, method) => {
        if (!acc[method.type]) {
            acc[method.type] = [];
        }
        acc[method.type].push(method);
        return acc;
    }, {} as Record<PaymentMethod["type"], PaymentMethod[]>);

    return (
        <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Metode Pembayaran
            </h3>

            <RadioGroup
                value={selected?.id || ""}
                onValueChange={(value) => {
                    const method = methods.find((m) => m.id === value);
                    if (method) onSelect(method);
                }}
            >
                {Object.entries(groupedMethods).map(([type, typeMethods]) => (
                    <div key={type} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {getPaymentIcon(type as PaymentMethod["type"])}
                            <span className="font-medium">{getPaymentTypeLabel(type as PaymentMethod["type"])}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                            {typeMethods.map((method) => (
                                <Card
                                    key={method.id}
                                    className={`p-3 cursor-pointer transition-all hover:border-primary ${selected?.id === method.id
                                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                                        : ""
                                        }`}
                                    onClick={() => onSelect(method)}
                                >
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value={method.id} id={method.id} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{method.icon}</span>
                                                <Label
                                                    htmlFor={method.id}
                                                    className="font-medium cursor-pointer truncate"
                                                >
                                                    {method.name}
                                                </Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {method.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </RadioGroup>

            {/* Development-only payment notice */}
            {process.env.NODE_ENV === "development" && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-sm text-amber-700">
                    <strong>Mode Development:</strong> Pembayaran menggunakan mock gateway.
                    Tidak ada transaksi nyata yang akan diproses.
                </p>
            </div>
            )}
        </div>
    );
}
