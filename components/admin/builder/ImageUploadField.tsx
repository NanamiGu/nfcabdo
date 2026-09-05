"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, RefreshCw } from "lucide-react";
import { uploadProfileMedia } from "@/lib/supabase/storage";

interface ImageUploadFieldProps {
  label: string;
  helperText?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: "avatars" | "covers" | "projects" | "products" | "resources" | "logos";
  aspectRatio?: "square" | "cover" | "wide";
}

export function ImageUploadField({
  label,
  helperText,
  value,
  onChange,
  folder = "avatars",
  aspectRatio = "square",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [inputUrl, setInputUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // 5MB limit check
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const result = await uploadProfileMedia(file, folder);
    setIsUploading(false);

    if (result.error || !result.url) {
      setUploadError(result.error || "Failed to upload image. You can enter an image URL directly instead.");
    } else {
      onChange(result.url);
      setInputUrl(result.url);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (inputUrl.trim()) {
      onChange(inputUrl.trim());
      setUploadError(null);
    }
  };

  const handleRemove = () => {
    onChange("");
    setInputUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const aspectClasses =
    aspectRatio === "cover"
      ? "h-28 sm:h-32 w-full rounded-xl"
      : aspectRatio === "wide"
      ? "h-24 w-36 rounded-xl"
      : "h-20 w-20 rounded-full";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              mode === "upload"
                ? "bg-slate-200 text-slate-800 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Upload
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
              mode === "url"
                ? "bg-slate-200 text-slate-800 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-xs text-slate-500 leading-relaxed">{helperText}</p>
      )}

      {/* Preview or Upload Box */}
      {value ? (
        <div className="relative group p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className={`relative overflow-hidden bg-slate-200 shrink-0 border border-slate-300 ${aspectClasses}`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={() => setUploadError("Failed to load image from URL.")}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">{value}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isUploading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-xs hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : mode === "upload" ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-colors ${
            isUploading
              ? "border-slate-300 bg-slate-50 pointer-events-none"
              : "border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleFileSelect}
            className="sr-only"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="text-xs">
              <span className="font-semibold text-slate-800">
                {isUploading ? "Uploading to storage..." : "Click to upload"}
              </span>
              <span className="text-slate-500"> or drag and drop</span>
            </div>
            <p className="text-[11px] text-slate-400">PNG, JPG, WEBP, or SVG up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or CDN link"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 bg-white"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white cursor-pointer transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input for replace button when value is already set */}
      {value && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          onChange={handleFileSelect}
          className="sr-only"
        />
      )}

      {/* Upload error banner */}
      {uploadError && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
          {uploadError}
        </p>
      )}
    </div>
  );
}
