import { Gauge, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function AudioMedia({ media, compact = false }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const audio = media.audio
  const progress = duration > 0 ? currentTime / duration : 0
  const formatTime = (value) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`
  const togglePlayback = () => { if (!audioRef.current) return; if (isPlaying) audioRef.current.pause(); else audioRef.current.play().catch(() => setIsPlaying(false)) }
  const skip = (seconds) => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds)) }
  const seekFromPointer = (event) => { if (!audioRef.current || !duration) return; const bounds = event.currentTarget.getBoundingClientRect(); const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)); audioRef.current.currentTime = position * duration; setCurrentTime(audioRef.current.currentTime) }
  const cyclePlaybackSpeed = () => { const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1; setPlaybackSpeed(nextSpeed); if (audioRef.current) audioRef.current.playbackRate = nextSpeed }
  useEffect(() => {
    const element = audioRef.current
    if (!element) return undefined
    const onLoaded = () => setDuration(element.duration || 0); const onTime = () => setCurrentTime(element.currentTime); const onPlay = () => setIsPlaying(true); const onPause = () => setIsPlaying(false)
    element.addEventListener('loadedmetadata', onLoaded); element.addEventListener('timeupdate', onTime); element.addEventListener('play', onPlay); element.addEventListener('pause', onPause); element.addEventListener('ended', onPause)
    return () => { element.removeEventListener('loadedmetadata', onLoaded); element.removeEventListener('timeupdate', onTime); element.removeEventListener('play', onPlay); element.removeEventListener('pause', onPause); element.removeEventListener('ended', onPause) }
  }, [])
  useEffect(() => {
    if (!isPlaying) return undefined
    let frameId; let lastUpdate = 0
    const updateProgress = () => { const now = performance.now(); if (audioRef.current && now - lastUpdate >= 80) { setCurrentTime(audioRef.current.currentTime); lastUpdate = now } frameId = window.requestAnimationFrame(updateProgress) }
    frameId = window.requestAnimationFrame(updateProgress)
    return () => window.cancelAnimationFrame(frameId)
  }, [isPlaying])

  if (compact) return <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#d8dce0] bg-[#fffdfa] p-4 text-center text-[#36454d] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100">
    <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(100deg,transparent_0,transparent_18px,rgba(244,126,38,0.12)_19px,transparent_20px)]" aria-hidden="true" />
    <img src={audio.avatar || '/assets/images/team/erfan.webp'} alt={audio.speaker || audio.title} className="relative size-14 shrink-0 rounded-full border-2 border-white object-cover shadow-md dark:border-gray-700" />
    <div className="relative min-w-0 max-w-full"><h3 className="line-clamp-2 [font-family:var(--font-heading)] text-sm font-extrabold leading-tight" title={audio.title}>{audio.title}</h3>{audio.speaker && <p className="mt-1 truncate text-[10px] text-admin-muted">{audio.speaker}</p>}</div>
    <div className="relative flex w-full items-center gap-2" dir="ltr"><button type="button" onClick={togglePlayback} aria-label={isPlaying ? (audio.pauseLabel || 'مکث') : (audio.playLabel || 'پخش')} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ecad24] text-white shadow-sm transition-colors hover:bg-orange-500">{isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button><div className="grid h-7 min-w-0 flex-1 grid-cols-[repeat(24,minmax(0,1fr))] items-center gap-x-1 overflow-hidden" role="slider" tabIndex="0" aria-label="موقعیت پخش صدا" aria-valuemin="0" aria-valuemax={duration || 0} aria-valuenow={currentTime} onPointerDown={seekFromPointer}>{Array.from({ length: 24 }, (_, index) => <span key={index} className={`w-0.5 justify-self-center rounded-full ${index / 24 < progress ? 'bg-[#59636a] dark:bg-[#cbd5e1]' : 'bg-[#cbd2d5] dark:bg-gray-600'}`} style={{ height: `${8 + ((index * 13) % 18)}px` }} />)}</div></div>
    <audio ref={audioRef} className="sr-only" preload="metadata"><source src={audio.src} type={audio.type || 'audio/mpeg'} />{audio.unsupportedLabel}</audio>
  </div>

  return <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[1.4rem] border border-[#d8dce0] bg-[#fffdfa] px-5 py-6 text-[#36454d] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:px-8 sm:py-8">
    <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(100deg,transparent_0,transparent_18px,rgba(244,126,38,0.12)_19px,transparent_20px)]" aria-hidden="true" />
    <div className="relative flex flex-col gap-6 md:flex-row-reverse md:items-center md:gap-8">
      <div className="flex shrink-0 justify-center md:order-2 md:w-32"><img src={audio.avatar || '/assets/images/team/erfan.webp'} alt={audio.speaker || audio.title} className="size-20 rounded-full border-4 border-white object-cover shadow-[0_8px_24px_rgba(54,69,77,0.16)] dark:border-gray-700 sm:size-24" /></div>
      <div className="relative min-w-0 flex-1 text-center md:order-1 md:text-start">
        <h3 className="line-clamp-2 [font-family:var(--font-heading)] text-lg font-extrabold leading-tight md:text-xl" title={audio.title}>{audio.title}</h3>
        {audio.speaker && <p className="mt-1 text-[11px] text-admin-muted">{audio.speakerLabel || 'صدا'}: {audio.speaker}</p>}
        <div className="mt-3 flex items-center gap-2" dir="ltr"><button type="button" onClick={togglePlayback} aria-label={isPlaying ? (audio.pauseLabel || 'مکث') : (audio.playLabel || 'پخش')} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ecad24] text-white shadow-sm outline-none transition-colors hover:bg-orange-500 focus-visible:bg-orange-500">{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button><div className="grid h-8 min-w-0 flex-1 grid-cols-[repeat(64,minmax(0,1fr))] items-center gap-x-1 overflow-hidden" role="slider" tabIndex="0" aria-label="موقعیت پخش صدا" aria-valuemin="0" aria-valuemax={duration || 0} aria-valuenow={currentTime} onPointerDown={seekFromPointer}>{Array.from({ length: 64 }, (_, index) => <span key={index} className={`w-0.5 justify-self-center rounded-full ${index / 64 < progress ? 'bg-[#59636a] dark:bg-[#cbd5e1]' : 'bg-[#cbd2d5] dark:bg-gray-600'}`} style={{ height: `${11 + ((index * 17) % 24)}px` }} />)}</div></div>
        <div className="mt-3 flex items-center justify-between text-sm text-admin-muted" dir="ltr"><div className="flex items-center gap-1"><button type="button" onClick={() => skip(-5)} aria-label={audio.rewindLabel || '5 ثانیه به عقب'} className="relative flex size-8 items-center justify-center hover:text-admin-brand"><RotateCcw size={20} /><span className="absolute text-[9px] font-bold">5</span></button><button type="button" onClick={() => skip(5)} aria-label={audio.forwardLabel || '5 ثانیه به جلو'} className="relative flex size-8 scale-x-[-1] items-center justify-center hover:text-admin-brand"><RotateCcw size={20} /><span className="absolute scale-x-[-1] text-[9px] font-bold">5</span></button></div><button type="button" onClick={cyclePlaybackSpeed} className="inline-flex items-center gap-1 text-xs font-bold text-admin-brand hover:text-orange-500"><Gauge size={15} />{playbackSpeed.toFixed(1)}x</button><div className="flex items-center gap-1 text-xs" dir="ltr"><span>{formatTime(currentTime)}</span><span>-</span><span>{formatTime(duration)}</span></div></div>
        <audio ref={audioRef} className="sr-only" preload="metadata"><source src={audio.src} type={audio.type || 'audio/mpeg'} />{audio.unsupportedLabel}</audio>
      </div>
    </div>
  </div>
}

export default AudioMedia
