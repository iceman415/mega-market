"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useGlobalSearch } from "@/hooks";
import type { SearchResult } from "@/types";

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { search } = useGlobalSearch();

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearching(true);
    try {
      const data = await search(trimmed);
      setResults(data);
    } catch {
      setResults({ vehicles: [], parts: [] });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") onClose?.();
  };

  const totalResults =
    (results?.vehicles.length ?? 0) + (results?.parts.length ?? 0);

  return (
    <div className="relative w-full bg-white shadow-lg">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search vehicles and parts..."
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-mega-blue focus:ring-1 focus:ring-mega-blue font-inter"
          autoFocus
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="flex items-center justify-center rounded-full bg-mega-blue p-2 text-white transition-colors hover:bg-mega-blue-dark disabled:opacity-50"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {results && query.trim() && totalResults > 0 && (
        <div className="mx-auto max-h-96 max-w-3xl overflow-y-auto border-t border-gray-200 px-4 pb-4">
          {results.vehicles.length > 0 && (
            <div className="py-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 font-oswald">
                Vehicles ({results.vehicles.length})
              </h4>
              <div className="space-y-2">
                {results.vehicles.map((v) => (
                  <Link
                    key={v.id}
                    href={`/vehicle/${v.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                      <Image
                        src={v.images[0] || "/placeholder.svg"}
                        alt={`${v.brand} ${v.model}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1 font-inter">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {v.brand} {v.model}
                      </p>
                      <p className="text-xs text-gray-500">
                        {v.year} &middot; ${Number(v.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.parts.length > 0 && (
            <div className="border-t border-gray-100 py-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 font-oswald">
                Parts ({results.parts.length})
              </h4>
              <div className="space-y-2">
                {results.parts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/part/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                      <Image
                        src={p.images[0] || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1 font-inter">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p.partNumber} &middot; ${Number(p.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {results && query.trim() && totalResults === 0 && !isSearching && (
        <div className="border-t border-gray-200 px-4 py-8 text-center font-inter">
          <p className="text-sm text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
