import React from "react";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { Product } from "@/types/profile";
import { sanitizeUrl } from "@/lib/urls";

interface ProductsSectionProps {
  products?: Product[];
  showProducts?: boolean;
}

/**
 * ProductsSection (Server Component)
 */
export function ProductsSection({
  products,
  showProducts = true,
}: ProductsSectionProps) {
  if (!showProducts || !products || products.length === 0) {
    return null;
  }

  const visibleProducts = products.filter((p) => p.visible !== false);
  if (visibleProducts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="products-heading" className="w-full space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-(--profile-primary)" />
          <h2
            id="products-heading"
            className="text-sm font-bold tracking-wider uppercase text-(--profile-muted)"
          >
            Products & Store
          </h2>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-(--profile-surface) text-(--profile-muted) border border-(--profile-border)">
          {visibleProducts.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-1">
        {visibleProducts.map((product, idx) => {
          const productUrl = (product.buyUrl || product.url)
            ? sanitizeUrl(product.buyUrl || product.url || "")
            : "";
          const displayName = product.title || product.name || "Product";

          return (
            <div
              key={product.id || `${displayName}-${idx}`}
              className="p-4 sm:p-5 rounded-(--profile-radius) bg-(--profile-surface) border border-(--profile-border) hover:border-(--profile-primary)/40 transition-all duration-200 shadow-sm flex flex-col justify-between gap-3"
            >
              <div className="flex gap-3.5">
                {product.image && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-(--profile-bg) border border-(--profile-border) shrink-0">
                    <img
                      src={product.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-(--profile-text) truncate">
                      {displayName}
                    </h3>
                    {product.badge && (
                      <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-(--profile-primary) text-black">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-xs sm:text-sm text-(--profile-muted) leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {product.inStock === false && (
                    <span className="inline-block text-[11px] font-semibold text-rose-500">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-3 border-t border-(--profile-border)/60">
                {product.price ? (
                  <span className="text-sm sm:text-base font-bold text-(--profile-primary)">
                    {product.price}
                  </span>
                ) : (
                  <span />
                )}

                {productUrl && (
                  <a
                    href={productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-(--profile-primary)/10 hover:bg-(--profile-primary)/20 text-(--profile-primary) border border-(--profile-primary)/30 transition-all"
                    aria-label={`Get ${displayName}`}
                  >
                    <span>{product.inStock === false ? "View" : "Get Access"}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
