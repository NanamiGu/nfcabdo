"use client";

import React, { useState } from "react";
import { Product } from "@/types/profile";
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
} from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface ProductsManagerProps {
  products: Product[];
  onChange: (products: Product[]) => void;
}

export function ProductsManager({ products, onChange }: ProductsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Product>>({});

  const handleStartAdd = () => {
    setDraft({
      id: `prod-${Date.now()}`,
      title: "",
      description: "",
      price: "",
      badge: "",
      buyUrl: "",
      image: "",
      inStock: true,
      visible: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (product: Product, index: number) => {
    setDraft({
      ...product,
      id: product.id || `prod-${index}`,
      title: product.title || product.name || "",
      buyUrl: product.buyUrl || product.purchaseUrl || product.url || "",
      inStock: product.inStock !== false,
      visible: product.visible !== false,
    });
    setEditingId(product.id || `prod-${index}`);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (!draft.title?.trim()) return;

    const cleanProduct: Product = {
      id: draft.id || `prod-${Date.now()}`,
      title: draft.title.trim(),
      name: draft.title.trim(),
      description: draft.description?.trim() || "",
      price: draft.price?.trim() || undefined,
      badge: draft.badge?.trim() || undefined,
      buyUrl: draft.buyUrl?.trim() || undefined,
      purchaseUrl: draft.buyUrl?.trim() || undefined,
      image: draft.image || undefined,
      inStock: draft.inStock !== false,
      visible: draft.visible !== false,
    };

    if (isAdding) {
      onChange([...products, cleanProduct]);
      setIsAdding(false);
    } else if (editingId) {
      onChange(
        products.map((p, idx) =>
          (p.id || `prod-${idx}`) === editingId ? cleanProduct : p
        )
      );
      setEditingId(null);
    }
    setDraft({});
  };

  const handleDelete = (index: number) => {
    onChange(products.filter((_, idx) => idx !== index));
    if (editingId) setEditingId(null);
  };

  const handleToggleVisibility = (index: number) => {
    onChange(
      products.map((p, idx) =>
        idx === index ? { ...p, visible: p.visible === false } : p
      )
    );
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {products.map((product, index) => {
          const isItemEditing = (product.id || `prod-${index}`) === editingId;
          const isVisible = product.visible !== false;
          const displayName = product.title || product.name || "Untitled Product";

          return (
            <div
              key={product.id || `${displayName}-${index}`}
              className={`rounded-xl border transition-all ${
                isItemEditing
                  ? "border-slate-900 bg-slate-50/50 p-4 shadow-sm"
                  : isVisible
                  ? "border-slate-200 bg-white p-3.5 hover:border-slate-300"
                  : "border-slate-200 bg-slate-50/60 p-3.5 opacity-70"
              }`}
            >
              {!isItemEditing ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex flex-col items-center gap-0.5 text-slate-400">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === products.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-slate-800 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {product.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img
                          src={product.image}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                          {displayName}
                        </h4>
                        {product.price && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {product.price}
                          </span>
                        )}
                        {product.badge && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-900 text-white">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {product.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(index)}
                      title={isVisible ? "Hide product" : "Show product"}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isVisible
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                      }`}
                    >
                      {isVisible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStartEdit(product, index)}
                      title="Edit Product"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      title="Delete Product"
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 text-rose-600 text-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ProductEditorForm
                  draft={draft}
                  setDraft={setDraft}
                  onSave={handleSave}
                  onCancel={() => {
                    setEditingId(null);
                    setDraft({});
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {isAdding ? (
        <div className="rounded-xl border border-slate-900 bg-slate-50/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
            Add New Product
          </h4>
          <ProductEditorForm
            draft={draft}
            setDraft={setDraft}
            onSave={handleSave}
            onCancel={() => {
              setIsAdding(false);
              setDraft({});
            }}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleStartAdd}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product or Digital Good</span>
        </button>
      )}
    </div>
  );
}

interface ProductEditorProps {
  draft: Partial<Product>;
  setDraft: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  onSave: () => void;
  onCancel: () => void;
}

function ProductEditorForm({
  draft,
  setDraft,
  onSave,
  onCancel,
}: ProductEditorProps) {
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Product Name *
          </label>
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="e.g. Enterprise Cloud Audit Suite"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Price
          </label>
          <input
            type="text"
            value={draft.price || ""}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            placeholder="e.g. $299 or $49/mo"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Buy / Checkout URL
          </label>
          <input
            type="url"
            value={draft.buyUrl || ""}
            onChange={(e) => setDraft({ ...draft, buyUrl: e.target.value })}
            placeholder="https://..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-700 uppercase">
            Badge Tag (Optional)
          </label>
          <input
            type="text"
            value={draft.badge || ""}
            onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
            placeholder="e.g. Popular, New, Sale"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-700 uppercase">
          Description
        </label>
        <textarea
          rows={2}
          value={draft.description || ""}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="What's included in this product and why clients need it."
          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        />
      </div>

      <ImageUploadField
        label="Product Thumbnail"
        value={draft.image || ""}
        onChange={(url) => setDraft({ ...draft, image: url })}
        folder="products"
        aspectRatio="square"
      />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.title?.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-lg cursor-pointer transition-colors"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
