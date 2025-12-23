import { useState } from 'react'
import { MediaItem, MediaViewerModal } from './media-viewer-modal'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const galleryItems: MediaItem[] = [
  {
    id: 1,
    type: 'image',
    src: '/for-pu/camping.jpg',
    alt: 'Always in my heart',
    caption: 'Always in my heart',
    aspectRatio: 'portrait', // taller than wide
  },
  {
    id: 2,
    type: 'image',
    src: '/for-pu/pu-class.jpg',
    alt: 'Always in my heart',
    caption: 'Always in my heart',
    aspectRatio: 'landscape',
  },
  {
    id: 3,
    type: 'image',
    src: '/for-pu/pu-is-soldier-1.jpg',
    alt: 'Always in my heart',
    caption: 'Always in my heart',
    aspectRatio: 'square',
  },
  {
    id: 4,
    type: 'image',
    src: '/for-pu/pu-is-soldier-2.jpg',
    alt: 'Always in my heart',
    caption: 'Always in my heart',
    aspectRatio: 'portrait',
  },
  {
    id: 5,
    type: 'image',
    src: '/for-pu/avatar.jpg',
    alt: 'Always in my heart',
    caption: 'Always in my heart',
    aspectRatio: 'square',
  },
  {
    id: 6,
    type: 'video',
    src: '/for-pu/pu-party.mp4', // Replace with your video URL
    caption: 'Always in my heart',
    aspectRatio: 'portrait', // taller than wide
  },
  {
    id: 7,
    type: 'video',
    src: '/for-pu/campu-travel.mp4',
    caption: 'Always in my heart',
    aspectRatio: 'landscape', // taller than wide
  },
  {
    id: 8,
    type: 'video',
    src: '/for-pu/pu-on-the-bike.mp4',
    caption: 'Pu on the bike',
    aspectRatio: 'portrait', // taller than wide
  },
]

export default function MasonryGallery() {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  return (
    <div className="masonry-gallery">
      {galleryItems.map(item => (
        <div
          key={item.id}
          className={cn(
            'masonry-item mb-4 break-inside-avoid',
            'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer',
          )}
          onClick={() => setSelectedItem(item)}
        >
          {item.type === 'image' ? (
            <div
              className={cn(
                'relative',
                item.aspectRatio === 'portrait'
                  ? 'aspect-3/4'
                  : item.aspectRatio === 'landscape'
                    ? 'aspect-4/3'
                    : 'aspect-square',
              )}
            >
              <Image
                src={item.src || '/placeholder.svg'}
                alt={item.alt || ''}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div
              className={cn(
                'relative',
                item.aspectRatio === 'portrait'
                  ? 'aspect-3/4'
                  : item.aspectRatio === 'landscape'
                    ? 'aspect-4/3'
                    : 'aspect-square',
              )}
            >
              <video
                src={item.src}
                controls
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm">{item.caption}</p>
          </div>
        </div>
      ))}
      <MediaViewerModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
