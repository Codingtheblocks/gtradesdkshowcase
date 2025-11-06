import { useMemo, useState } from 'react';
import { SymbolSearch, type AssetClass, getAssetClassColor } from './components/SymbolSearch';
import './App.css';

interface SelectedSymbol {
  symbol: string;
  assetClass: AssetClass;
  pairIndex: number;
}

function App() {
  const [selected, setSelected] = useState<SelectedSymbol | null>(null);

  const assetBadgeStyle = useMemo(() => {
    if (!selected) return {};
    return { backgroundColor: getAssetClassColor(selected.assetClass) } as const;
  }, [selected]);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow">Gains Network SDK Showcase</span>
          <h1 className="hero__title">PairIndex Token Explorer</h1>
          <p className="hero__subtitle">
            Browse the live instruments available on gTrade. Powered by the official Gains Network SDK
            with PairIndex mapping, asset-class filters, and status-aware UX.
          </p>
        </div>
        <div className="hero__gradient" aria-hidden />
      </header>

      <main className="content">
        <section className="card card--search">
          <h2 className="card__title">Instrument Search</h2>
          <p className="card__description">
            Start typing to locate any supported market. We filter out delisted instruments automatically using the SDK.
          </p>

          <SymbolSearch
            selectedSymbol={selected?.symbol}
            onSelect={(symbol, assetClass, pairIndex) => setSelected({ symbol, assetClass, pairIndex })}
          />
        </section>

        <section className="card card--details">
          <h2 className="card__title">Instrument Details</h2>
          {!selected ? (
            <p className="card__empty-state">Select a symbol from the search panel to view its details.</p>
          ) : (
            <dl className="details">
              <div className="details__row">
                <dt>Symbol</dt>
                <dd>{selected.symbol}</dd>
              </div>
              <div className="details__row">
                <dt>PairIndex</dt>
                <dd className="details__badge">#{selected.pairIndex}</dd>
              </div>
              <div className="details__row">
                <dt>Asset Class</dt>
                <dd>
                  <span className="details__asset-badge" style={assetBadgeStyle}>
                    {selected.assetClass}
                  </span>
                </dd>
              </div>
              <div className="details__row">
                <dt>Description</dt>
                <dd>
                  This instrument is sourced directly from the Gains Network SDK `pairs` map. Use the PairIndex value to
                  query candles, open positions, or historical data across the rest of the SDK.
                </dd>
              </div>
            </dl>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          Built with <a href="https://vite.dev" target="_blank" rel="noreferrer">Vite</a> and the{' '}
          <a href="https://docs.gains.trade/" target="_blank" rel="noreferrer">Gains Network SDK</a>.
        </p>
      </footer>
    </div>
  );
}

export default App;
