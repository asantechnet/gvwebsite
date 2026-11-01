import { Play } from 'lucide-react'
import { useState } from 'react'

function VideoMedia({ post, media, fill = false }) {
  const [isStarted, setIsStarted] = useState(false)
  const video = media.video
  const preview = video.poster || post.image
  return <div className={`w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-border bg-[#171717] dark:border-gray-600 ${fill ? 'h-full' : ''}`}>
    {isStarted ? video.src ? <video className={`${fill ? 'h-full' : 'aspect-video'} w-full bg-black object-contain`} src={video.src} title={video.title} controls autoPlay playsInline /> : <iframe className={`${fill ? 'h-full' : 'aspect-video'} w-full`} src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&modestbranding=1&rel=0&playsinline=1`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <button type="button" onClick={() => setIsStarted(true)} className={`group relative block w-full cursor-pointer overflow-hidden text-white outline-none ${fill ? 'h-full' : 'aspect-video'}`} aria-label={video.playLabel || 'پخش ویدیو'}>
      {video.src && !preview ? <video className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-80" src={video.src} muted preload="metadata" /> : <img src={preview} alt={video.title} className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-80" />}
      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20"><span className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors group-hover:bg-primary-hover"><Play size={24} fill="currentColor" aria-hidden="true" /></span><span className="px-4 text-center font-bold">{video.title}</span></span>
    </button>}
  </div>
}

export default VideoMedia
