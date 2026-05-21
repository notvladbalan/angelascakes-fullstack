import api from "@/api/axios";
import CakeCard from "@/components/catalog/CakeCard";
import CatalogFilterSidebar from "@/components/catalog/CatalogFilterSidebar";
import Navbar from "@/components/layout/Navbar";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_SIZE = 9;

function pagesToShow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = new Set([0, total - 1, current]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 0 && i < total) pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const nameParam        = searchParams.get("name")         || "";
  const flavorIdParam    = searchParams.get("flavorId")     || "";
  const cakeTypeIdParam  = searchParams.get("cakeTypeId")   || "";
  const decorationIdsRaw = searchParams.get("decorationIds") || "";
  const maxPriceParam    = searchParams.get("maxPrice")      || "";
  const pageParam        = Math.max(0, parseInt(searchParams.get("page") || "0", 10));

  const decorationIdsParam = decorationIdsRaw.split(",").filter(Boolean);

  const [cakes, setCakes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [fetchedKey, setFetchedKey] = useState(null);
  const [flavors, setFlavors]           = useState([]);
  const [decorations, setDecorations]   = useState([]);
  const [cakeTypes, setCakeTypes]       = useState([]);

  const queryKey = `${nameParam}|${flavorIdParam}|${cakeTypeIdParam}|${decorationIdsRaw}|${maxPriceParam}|${pageParam}`;
  const loading = fetchedKey !== queryKey;

  useEffect(() => {
    Promise.all([api.get("/flavors"), api.get("/decorations"), api.get("/cake-types")])
      .then(([fRes, dRes, tRes]) => {
        setFlavors(fRes.data);
        setDecorations(dRes.data);
        setCakeTypes(tRes.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const key = `${nameParam}|${flavorIdParam}|${cakeTypeIdParam}|${decorationIdsRaw}|${maxPriceParam}|${pageParam}`;

    const params = new URLSearchParams();
    params.set("page", String(pageParam));
    params.set("size", String(PAGE_SIZE));
    if (nameParam)        params.set("name", nameParam);
    if (flavorIdParam)    params.set("flavorId", flavorIdParam);
    if (cakeTypeIdParam)  params.set("cakeTypeId", cakeTypeIdParam);
    if (maxPriceParam)    params.set("maxPrice", maxPriceParam);
    decorationIdsRaw.split(",").filter(Boolean).forEach((id) => params.append("decorationIds", id));

    api
      .get(`/cakes?${params.toString()}`)
      .then((r) => {
        setCakes(r.data.content);
        setTotalPages(r.data.totalPages);
        setTotalElements(r.data.totalElements);
      })
      .catch(() => {
        setCakes([]);
        setTotalPages(0);
        setTotalElements(0);
      })
      .finally(() => setFetchedKey(key));
  }, [nameParam, flavorIdParam, cakeTypeIdParam, decorationIdsRaw, maxPriceParam, pageParam]);

  function setCakeType(id) {
    const next = new URLSearchParams(searchParams);
    if (id) next.set("cakeTypeId", String(id));
    else next.delete("cakeTypeId");
    next.delete("page");
    setSearchParams(next);
  }

  function setFlavor(id) {
    const next = new URLSearchParams(searchParams);
    if (id) next.set("flavorId", String(id));
    else next.delete("flavorId");
    next.delete("page");
    setSearchParams(next);
  }

  function setMaxPrice(value) {
    const next = new URLSearchParams(searchParams);
    if (value == null) next.delete("maxPrice");
    else next.set("maxPrice", String(value));
    next.delete("page");
    setSearchParams(next);
  }

  function toggleDecoration(id) {
    const next    = new URLSearchParams(searchParams);
    const current = decorationIdsParam;
    const strId   = String(id);
    const updated = current.includes(strId)
      ? current.filter((d) => d !== strId)
      : [...current, strId];
    if (updated.length) next.set("decorationIds", updated.join(","));
    else next.delete("decorationIds");
    next.delete("page");
    setSearchParams(next);
  }

  function goToPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p === 0) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const selectedFlavor = flavors.find((f) => String(f.id) === flavorIdParam);
  const hasFilters = !!(nameParam || flavorIdParam || cakeTypeIdParam || decorationIdsParam.length || maxPriceParam);

  return (
    <div className="min-h-screen bg-[#FFF5EC] flex flex-col">
      <Navbar />

      <div className="flex-1 flex w-full">
        {/* ── Filter sidebar ─────────────────────────────── */}
        <CatalogFilterSidebar
          cakeTypes={cakeTypes}
          cakeTypeIdParam={cakeTypeIdParam}
          onSelectCakeType={setCakeType}
          flavors={flavors}
          flavorIdParam={flavorIdParam}
          onSelectFlavor={setFlavor}
          decorations={decorations}
          decorationIdsParam={decorationIdsParam}
          onToggleDecoration={toggleDecoration}
          maxPriceParam={maxPriceParam}
          onSetMaxPrice={setMaxPrice}
        />

        {/* ── Main content ───────────────────────────────── */}
        <main className="flex-1 min-w-0 px-8 py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="font-heading text-2xl text-brown">
                {nameParam
                  ? `Results for "${nameParam}"`
                  : selectedFlavor
                    ? selectedFlavor.name
                    : "Our Cakes"}
              </h1>
              {!loading && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {totalElements} cake{totalElements !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="shrink-0 flex items-center gap-1.5 text-xs text-crimson border border-crimson/40 rounded-full px-3 py-1.5 hover:bg-crimson/5 transition-colors"
              >
                <X size={12} />
                Clear filters
              </button>
            )}
          </div>

          {/* States */}
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 size={32} className="animate-spin text-crimson" />
            </div>
          ) : cakes.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="font-heading text-xl text-brown mb-2">
                No cakes found
              </p>
              <p className="text-sm text-muted-foreground mb-5">
                Try adjusting your search or clearing the filters.
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-crimson font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {cakes.map((cake) => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center items-center gap-1.5 mt-10">
              <button
                onClick={() => goToPage(pageParam - 1)}
                disabled={pageParam === 0}
                className="px-4 py-2 rounded-lg border border-stroke text-sm font-body text-brown hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>

              {pagesToShow(pageParam, totalPages).map((entry, i) =>
                entry === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-9 text-center text-muted-foreground select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={entry}
                    onClick={() => goToPage(entry)}
                    className={`w-9 h-9 rounded-lg text-sm font-body transition-colors ${
                      entry === pageParam
                        ? "bg-crimson text-white font-semibold"
                        : "border border-stroke text-brown hover:bg-white"
                    }`}
                  >
                    {entry + 1}
                  </button>
                ),
              )}

              <button
                onClick={() => goToPage(pageParam + 1)}
                disabled={pageParam >= totalPages - 1}
                className="px-4 py-2 rounded-lg border border-stroke text-sm font-body text-brown hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
