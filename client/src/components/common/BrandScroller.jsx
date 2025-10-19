import { useRef } from 'react'

const BrandScroller = ({ brands = [], selectedBrand = null, onSelect = () => {} }) => {
  const trackRef = useRef(null)

  const scrollByAmount = (amount) => {
    if (!trackRef.current) return
    trackRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs sm:text-sm font-medium text-neutral-700 uppercase tracking-wider">Markalar</h3>
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            aria-label="Geri"
            onClick={() => scrollByAmount(-300)}
            className="h-8 w-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="İleri"
            onClick={() => scrollByAmount(300)}
            className="h-8 w-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1"
        role="list"
        aria-label="Ayakkabı Markaları"
      >
        {brands.map((brand) => (
          <button
            key={brand.id || brand}
            type="button"
            className={`shrink-0 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-colors ${
              (selectedBrand && (selectedBrand.id ? selectedBrand.id === (brand.id || '') : selectedBrand === (brand.id || brand)))
                ? 'border-neutral-900 bg-neutral-900 text-white'
                : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
            }`}
            role="listitem"
            aria-label={brand.name || brand}
            onClick={() => onSelect(brand)}
          >
            {brand.name || brand}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BrandScroller


