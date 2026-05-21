import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

const SHOW_INITIAL = 10;
const PRICE_MAX    = 600;

function FilterSection({ label, activeCount, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stroke last:border-b-0 py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brown">{label}</span>
          {activeCount > 0 && (
            <span className="text-[10px] bg-crimson text-white rounded-full px-1.5 py-0.5 font-bold leading-none">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export default function CatalogFilterSidebar({
  cakeTypes,
  cakeTypeIdParam,
  onSelectCakeType,
  flavors,
  flavorIdParam,
  onSelectFlavor,
  decorations,
  decorationIdsParam,
  onToggleDecoration,
  maxPriceParam,
  onSetMaxPrice,
}) {
  const [showAllCakeTypes, setShowAllCakeTypes]     = useState(false);
  const [showAllFlavors, setShowAllFlavors]         = useState(false);
  const [showAllDecorations, setShowAllDecorations] = useState(false);

  const visibleCakeTypes = showAllCakeTypes ? cakeTypes : cakeTypes.slice(0, SHOW_INITIAL);

  // null = not dragging; falls back to URL param or PRICE_MAX
  const [localMax, setLocalMax] = useState(null);
  const displayMax = localMax ?? (maxPriceParam ? Number(maxPriceParam) : PRICE_MAX);

  function commitMax(value) {
    setLocalMax(null);
    onSetMaxPrice(value >= PRICE_MAX ? null : value);
  }

  const visibleFlavors     = showAllFlavors     ? flavors     : flavors.slice(0, SHOW_INITIAL);
  const visibleDecorations = showAllDecorations ? decorations : decorations.slice(0, SHOW_INITIAL);

  return (
    <Sidebar className="hidden lg:block">
      <ScrollArea className="h-full">
      <div className="p-5">
        <h2 className="font-heading text-lg text-brown mb-1">Filters</h2>

        {/* ── Price ──────────────────────────────────── */}
        <FilterSection label="Price" activeCount={maxPriceParam ? 1 : 0} defaultOpen>
          <div className="px-1 pt-1">
            <input
              type="range"
              min={0}
              max={PRICE_MAX}
              value={displayMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              onMouseUp={(e)   => commitMax(Number(e.target.value))}
              onTouchEnd={(e)  => commitMax(Number(e.currentTarget.value))}
              className="w-full cursor-pointer accent-[#8C031C]"
            />
            <div className="flex items-center justify-between mt-2 gap-2">
              <span className="text-xs text-muted-foreground">$0</span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">Up to</span>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                  <input
                    type="number"
                    min={0}
                    value={displayMax}
                    onChange={(e) => {
                      const v = Math.max(0, Number(e.target.value) || 0);
                      setLocalMax(v);
                      commitMax(v);
                    }}
                    className="w-20 pl-5 pr-2 py-1 text-xs text-right border border-stroke rounded-lg outline-none focus:border-crimson/50 text-brown"
                  />
                </div>
              </div>
            </div>
          </div>
        </FilterSection>

        {/* ── Cake Type ──────────────────────────────── */}
        <FilterSection label="Cake Type" activeCount={cakeTypeIdParam ? 1 : 0} defaultOpen>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button
                type="button"
                onClick={() => onSelectCakeType('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                  !cakeTypeIdParam ? 'bg-muted text-crimson font-semibold' : 'text-brown hover:bg-muted'
                }`}
              >
                All Types
              </button>
            </li>
            {visibleCakeTypes.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onSelectCakeType(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                    String(cakeTypeIdParam) === String(t.id)
                      ? 'bg-muted text-crimson font-semibold'
                      : 'text-brown hover:bg-muted'
                  }`}
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
          {cakeTypes.length > SHOW_INITIAL && (
            <button
              type="button"
              onClick={() => setShowAllCakeTypes((v) => !v)}
              className="mt-1 px-3 text-xs text-crimson font-semibold hover:underline"
            >
              {showAllCakeTypes ? 'Show less' : `Show ${cakeTypes.length - SHOW_INITIAL} more`}
            </button>
          )}
        </FilterSection>

        {/* ── Flavor ─────────────────────────────────── */}
        <FilterSection label="Flavor" activeCount={flavorIdParam ? 1 : 0}>
          <ul className="flex flex-col gap-0.5">
            <li>
              <button
                type="button"
                onClick={() => onSelectFlavor('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                  !flavorIdParam
                    ? 'bg-muted text-crimson font-semibold'
                    : 'text-brown hover:bg-muted'
                }`}
              >
                All Types
              </button>
            </li>
            {visibleFlavors.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => onSelectFlavor(f.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                    String(flavorIdParam) === String(f.id)
                      ? 'bg-muted text-crimson font-semibold'
                      : 'text-brown hover:bg-muted'
                  }`}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
          {flavors.length > SHOW_INITIAL && (
            <button
              type="button"
              onClick={() => setShowAllFlavors((v) => !v)}
              className="mt-1 px-3 text-xs text-crimson font-semibold hover:underline"
            >
              {showAllFlavors ? 'Show less' : `Show ${flavors.length - SHOW_INITIAL} more`}
            </button>
          )}
        </FilterSection>

        {/* ── Decoration ─────────────────────────────── */}
        <FilterSection label="Decoration" activeCount={decorationIdsParam.length}>
          <ul className="flex flex-col gap-0.5">
            {visibleDecorations.map((d) => {
              const active = decorationIdsParam.includes(String(d.id));
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onToggleDecoration(d.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body flex items-center gap-2.5 transition-colors ${
                      active ? 'bg-muted text-crimson font-semibold' : 'text-brown hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        active ? 'bg-crimson border-crimson' : 'border-stroke'
                      }`}
                    >
                      {active && <Check size={9} className="text-white" strokeWidth={3} />}
                    </span>
                    {d.name}
                  </button>
                </li>
              );
            })}
            {decorations.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">No decorations available.</p>
            )}
          </ul>
          {decorations.length > SHOW_INITIAL && (
            <button
              type="button"
              onClick={() => setShowAllDecorations((v) => !v)}
              className="mt-1 px-3 text-xs text-crimson font-semibold hover:underline"
            >
              {showAllDecorations ? 'Show less' : `Show ${decorations.length - SHOW_INITIAL} more`}
            </button>
          )}
        </FilterSection>


      </div>
      </ScrollArea>
    </Sidebar>
  );
}
