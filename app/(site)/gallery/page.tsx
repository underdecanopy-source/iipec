'use client'

import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import Image from 'next/image'

export default function GalleryPage() {
  const imageCount = 30
  const images = Array.from({ length: imageCount }, (_, idx) => ({
    src: `/images/gallery-${idx + 1}.jpg`,
    alt: `Gallery image ${idx + 1}`,
  }))

  return (
    <div className="section-padding">
      <div className="container-custom">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Gallery</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Witness the impact of our work through these moments captured in time.
        </p>

        <PhotoProvider>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <PhotoView key={index} src={image.src}>
                <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              </PhotoView>
            ))}
          </div>
        </PhotoProvider>
      </div>
    </div>
  )
}