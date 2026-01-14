import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { X, Check, Filter } from "lucide-react";

const HARDCODE_COLORS = [
  { name: "Red", code: "#ef4444" },
  { name: "Blue", code: "#3b82f6" },
  { name: "Green", code: "#22c55e" },
  { name: "Black", code: "#1f2937" },
  { name: "White", code: "#f9fafb" },
  { name: "Yellow", code: "#eab308" },
  { name: "Purple", code: "#a855f7" },
  { name: "Pink", code: "#ec4899" },
  { name: "Orange", code: "#f97316" },
  { name: "Brown", code: "#92400e" },
  { name: "Gray", code: "#6b7280" },
  { name: "Navy", code: "#1e3a8a" },
];

const HARDCODE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

interface FilterState {
  colors: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
}

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onClearAll,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const toggleColor = (color: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const toggleSize = (size: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 10000 },
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearAll();
  };

  const hasActiveFilters =
    localFilters.colors.length > 0 || localFilters.sizes.length > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-100 flex flex-col p-4">
        <SheetHeader className="shrink-0 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </SheetTitle>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
          <SheetDescription>
            Filter products by color, size, and more
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8">
          <div>
            <Label className="text-sm font-semibold text-slate-900 mb-4 block">
              Colors
            </Label>
            <div className="flex flex-wrap gap-3">
              {HARDCODE_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color.name)}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    localFilters.colors.includes(color.name)
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                >
                  {localFilters.colors.includes(color.name) && (
                    <Check
                      className={`absolute inset-0 m-auto w-5 h-5 ${
                        color.name === "White" || color.name === "Yellow"
                          ? "text-slate-900"
                          : "text-white"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
            {localFilters.colors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {localFilters.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => toggleColor(color)}
                      className="hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold text-slate-900 mb-4 block">
              Sizes
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {HARDCODE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`h-10 rounded-lg border-2 text-sm font-medium transition-all ${
                    localFilters.sizes.includes(size)
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {localFilters.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {localFilters.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => toggleSize(size)}
                      className="hover:text-primary/70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 pt-4 border-t space-y-3">
          <Button className="w-full h-11" onClick={handleApply}>
            Apply Filters
          </Button>
          <Button
            variant="outline"
            className="w-full h-11"
            onClick={handleClear}
          >
            Clear All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
export type { FilterState };
