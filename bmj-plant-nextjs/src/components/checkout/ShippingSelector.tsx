"use client";



import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, Zap } from "lucide-react";
import type { ShippingOption } from "./types";
import { formatPrice } from "@/lib/utils/format";

const getShippingIcon = (id: string) => {
    switch (id) {
        case "express":
            return <Zap className="w-5 h-5 text-amber-500" />;
        case "same_day":
            return <Clock className="w-5 h-5 text-emerald-500" />;
        default:
            return <Truck className="w-5 h-5 text-primary" />;
    }
};

interface ShippingSelectorProps {
    options: ShippingOption[];
    selected: ShippingOption | null;
    onSelect: (option: ShippingOption) => void;
}

export function ShippingSelector({
    options,
    selected,
    onSelect,
}: ShippingSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Metode Pengiriman
            </h3>

            <RadioGroup
                value={selected?.id || ""}
                onValueChange={(value) => {
                    const option = options.find((o) => o.id === value);
                    if (option) onSelect(option);
                }}
            >
                <div className="space-y-3">
                    {options.map((option) => (
                        <Card
                            key={option.id}
                            className={`p-4 cursor-pointer transition-all hover:border-primary ${selected?.id === option.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : ""
                                }`}
                            onClick={() => onSelect(option)}
                        >
                            <div className="flex items-start gap-3">
                                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getShippingIcon(option.id)}
                                            <Label
                                                htmlFor={option.id}
                                                className="font-medium cursor-pointer"
                                            >
                                                {option.name}
                                            </Label>
                                        </div>
                                        <span className="font-semibold">
                                            IDR {formatPrice(option.price)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {option.description}
                                    </p>
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                        {option.estimatedDays}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </RadioGroup>
        </div>
    );
}
