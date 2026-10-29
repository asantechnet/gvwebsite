function ImageMedia({ post, media }) {
  const images = media.gallery?.length ? media.gallery : [{ src: post.image, alt: media.imageAlt, label: media.imageLabel }]
  return <div className="w-full min-w-0 max-w-full"><div className="grid gap-3 sm:grid-cols-3">
    {images.map((image, index) => <figure key={image.src} className={`relative overflow-hidden rounded-2xl border border-border dark:border-gray-600 ${images.length > 1 && index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}>
      <img src={image.src} alt={image.alt} className={`block h-full w-full object-cover ${images.length > 1 && index === 0 ? 'aspect-[16/9]' : 'aspect-[16/8]'}`} />
      <figcaption className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold leading-4 text-white backdrop-blur-sm">{image.label}</figcaption>
    </figure>)}
  </div></div>
}

export default ImageMedia
