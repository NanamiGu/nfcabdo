"use client";

import React, { useState, useEffect, useTransition, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle, X } from "lucide-react";
import { deleteProfileAction } from "@/app/admin/actions";

const emptySubscribe = () => () => {};

interface DeleteProfileButtonProps {
  profileId: string;
  profileName: string;
  variant?: "table" | "header";
  redirectOnDelete?: string;
}

export function DeleteProfileButton({
  profileId,
  profileName,
  variant = "table",
  redirectOnDelete,
}: DeleteProfileButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [isPending, startTransition] = useTransition();

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        setIsOpen(false);
        setError(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending]);

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleDelete = () => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await deleteProfileAction(profileId);

        if (!result.success) {
          setError(result.error || "Failed to delete profile.");
          return;
        }

        setIsOpen(false);
        if (redirectOnDelete) {
          router.push(redirectOnDelete);
        }
        router.refresh();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(message);
      }
    });
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false);
      setError(null);
    }
  };

  return (
    <>
      {variant === "table" ? (
        <button
          type="button"
          onClick={handleOpen}
          className="group inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-[0.98] cursor-pointer"
          title={`Delete ${profileName}`}
        >
          <Trash2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
          <span>Delete</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-300 hover:border-rose-200 shadow-xs transition-colors cursor-pointer"
          title={`Delete ${profileName}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Profile</span>
        </button>
      )}

      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-profile-title-${profileId}`}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon & Details */}
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="space-y-1 pr-6">
                  <h3
                    id={`delete-profile-title-${profileId}`}
                    className="text-base font-semibold text-slate-900 leading-snug"
                  >
                    Delete Profile?
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-slate-900">
                      &ldquo;{profileName}&rdquo;
                    </span>
                    ? This will permanently remove the NFC card and all associated
                    data. This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Deletion failed</p>
                    <p className="mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
