import { useEffect, useMemo, useRef, useState } from 'react';
import './SymbolSearch.css';

type AssetClass = 'crypto' | 'forex' | 'stocks' | 'indices' | 'commodities';

interface SymbolSearchProps {
  onSelect: (symbol: string, assetClass: AssetClass, pairIndex: number) => void;
  selectedSymbol?: string;
}

type PairIndexMap = Record<string, unknown>;

export function SymbolSearch({ onSelect, selectedSymbol }: SymbolSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<AssetClass | 'all'>('all');
  const [sdkData, setSdkData] = useState<{
    pairs: Record<string, AssetClass>;
    delistedPairIxs: Set<number>;
    PairIndex: PairIndexMap;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSdk() {
      try {
        const [constants, types] = await Promise.all([
          import('@gainsnetwork/sdk/lib/constants'),
          import('@gainsnetwork/sdk/lib/trade/types'),
        ]);

        const delisted = Array.isArray(constants.delistedPairIxs)
          ? new Set<number>(constants.delistedPairIxs as number[])
          : (constants.delistedPairIxs as Set<number>);

        setSdkData({
          pairs: constants.pairs as Record<string, AssetClass>,
          delistedPairIxs: delisted,
          PairIndex: types.PairIndex as PairIndexMap,
        });
      } catch (error) {
        console.error('Failed to load SDK data', error);
        setLoadError('Unable to load Gains Network SDK data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSdk();
  }, []);

  const activePairs = useMemo(() => {
    if (!sdkData) return [];

    const result: Array<{ symbol: string; assetClass: AssetClass; index: number }> = [];

    Object.entries(sdkData.pairs).forEach(([symbol, assetClass]) => {
      const enumKey = symbol.replace(/\//g, '').replace(/_/g, '').replace(/\d+$/, '');
      const pairIndex = sdkData.PairIndex[enumKey];

      if (typeof pairIndex === 'number' && Number.isFinite(pairIndex) && !sdkData.delistedPairIxs.has(pairIndex)) {
        result.push({ symbol, assetClass, index: pairIndex });
      }
    });

    return result.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, [sdkData]);

  const filteredPairs = useMemo(() => {
    let filtered = activePairs;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter((pair) => pair.assetClass === selectedFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((pair) => pair.symbol.toLowerCase().includes(term));
    }

    return filtered;
  }, [activePairs, selectedFilter, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string, assetClass: AssetClass, pairIndex: number) => {
    onSelect(symbol, assetClass, pairIndex);
    setIsOpen(false);
    setSearchTerm('');
  };

  const assetFilters: Array<{ key: AssetClass | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'forex', label: 'Forex' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'indices', label: 'Indices' },
    { key: 'commodities', label: 'Commodities' },
  ];

  return (
    <div ref={dropdownRef} className="symbol-search">
      <div className="symbol-search__input-wrapper">
        <input
          type="text"
          className="symbol-search__input"
          placeholder={selectedSymbol || 'Search symbols (e.g., QQQ, BTC)...'}
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="symbol-search__dropdown">
          {isLoading && <div className="symbol-search__status">Loading symbols…</div>}
          {loadError && <div className="symbol-search__status symbol-search__status--error">{loadError}</div>}

          {!isLoading && !loadError && (
            <>
              <div className="symbol-search__filters">
                {assetFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={
                      filter.key === selectedFilter
                        ? 'symbol-search__filter symbol-search__filter--active'
                        : 'symbol-search__filter'
                    }
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="symbol-search__list">
                {filteredPairs.length === 0 ? (
                  <div className="symbol-search__empty">No symbols found</div>
                ) : (
                  filteredPairs.map((pair) => (
                    <button
                      key={pair.symbol}
                      type="button"
                      className={
                        selectedSymbol === pair.symbol
                          ? 'symbol-search__item symbol-search__item--selected'
                          : 'symbol-search__item'
                      }
                      onClick={() => handleSelect(pair.symbol, pair.assetClass, pair.index)}
                    >
                      <span className="symbol-search__item-symbol">{pair.symbol}</span>
                      <span
                        className="symbol-search__badge"
                        style={{ backgroundColor: getAssetClassColor(pair.assetClass) }}
                      >
                        {pair.assetClass}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function getAssetClassColor(assetClass: AssetClass) {
  switch (assetClass) {
    case 'crypto':
      return '#f59e0b';
    case 'forex':
      return '#3b82f6';
    case 'stocks':
      return '#10b981';
    case 'indices':
      return '#8b5cf6';
    case 'commodities':
      return '#ef4444';
    default:
      return '#6b7280';
  }
}

export type { AssetClass };
