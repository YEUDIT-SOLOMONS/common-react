import { useState } from 'react'

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="gallery">
      <div className="gallery-main">
        {images.length > 0 ? <img src={images[selected]} alt={alt} /> : <span className="item-card-noimage">אין תמונה</span>}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={index === selected ? 'thumb thumb-active' : 'thumb'}
              onClick={() => setSelected(index)}
              aria-label={`תמונה ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
