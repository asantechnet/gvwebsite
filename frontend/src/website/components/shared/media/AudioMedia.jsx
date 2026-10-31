import { Gauge, Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function AudioMedia({ media }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const audio = media.audio
  const progress = duration > 0 ? currentTime / duration : 0
  const formatTime = (value) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${Math.floor(value % 60).toString().padStart(2, '0')}`
  const togglePlayback = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(() => setIsPlaying(false))
  }
  const skip = (seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds))
  }
  const seekFromPointer = (event) => {
    if (!audioRef.current || !duration) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const position = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    audioRef.current.currentTime = position * duration
    setCurrentTime(audioRef.current.currentTime)
  }
  const cyclePlaybackSpeed = () => {
    const nextSpeed = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 2 : 1
    setPlaybackSpeed(nextSpeed)
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed
  }
  useEffect(() => {
    const element = audioRef.current
    if (!element) return undefined
    const onLoaded = () => setDuration(element.duration || 0)
    const onTime = () => setCurrentTime(element.currentTime)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    element.addEventListener('loadedmetadata', onLoaded)
    element.addEventListener('timeupdate', onTime)
    element.addEventListener('play', onPlay)
    element.addEventListener('pause', onPause)
    element.addEventListener('ended', onEnded)
    return () => {
      element.removeEventListener('loadedmetadata', onLoaded)
      element.removeEventListener('timeupdate', onTime)
      element.removeEventListener('play', onPlay)
      element.removeEventListener('pause', onPause)
      element.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) return undefined
    let frameId
    let lastUpdate = 0
    const updateProgress = () => {
      const now = performance.now()
      if (audioRef.current && now - lastUpdate >= 80) {
        setCurrentTime(audioRef.current.currentTime)
        lastUpdate = now
      }
      frameId = window.requestAnimationFrame(updateProgress)
    }
    frameId = window.requestAnimationFrame(updateProgress)
    return () => window.cancelAnimationFrame(frameId)
  }, [isPlaying])

  return <div className="relative w-full min-w-0 max-w-full overflow-hidden rounded-[1.4rem] border border-[#d8dce0] bg-[#fffdfa] px-5 py-6 text-[#36454d] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 sm:px-8 sm:py-8">
    <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(100deg,transparent_0,transparent_18px,rgba(244,126,38,0.12)_19px,transparent_20px)]" aria-hidden="true" />
    <div className="relative flex flex-col gap-6 md:flex-row-reverse md:items-center md:gap-8">
      <div className="flex shrink-0 justify-center md:order-2 md:w-32"><img src={audio.avatar || '/assets/images/avatars/avatar-female.png'} alt={audio.speaker || audio.title} className="size-20 rounded-full border-4 border-white object-cover shadow-[0_8px_24px_rgba(54,69,77,0.16)] dark:border-gray-700 sm:size-24" /></div>
      <div className="relative min-w-0 flex-1 text-center md:order-1 md:text-start">
        <h3 className="line-clamp-2 font-heading text-lg font-extrabold leading-tight md:text-xl" title={audio.title}>{audio.title}</h3>
        {audio.speaker && <p className="mt-1 text-[11px] text-foreground-muted">{audio.speakerLabel || 'صدا'}: {audio.speaker}</p>}
        <div className="mt-3 flex items-center gap-2" dir="ltr">
          <button type="button" onClick={togglePlayback} aria-label={isPlaying ? (audio.pauseLabel || 'مکث') : (audio.playLabel || 'پخش')} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ecad24] text-white shadow-sm outline-none transition-colors hover:bg-primary-hover focus-visible:bg-primary-hover">{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button>
          <div className="flex h-8 min-w-0 flex-1 cursor-pointer items-center justify-center gap-1 overflow-hidden" role="slider" tabIndex="0" aria-label="موقعیت پخش صدا" aria-valuemin="0" aria-valuemax={duration || 0} aria-valuenow={currentTime} onPointerDown={seekFromPointer} onKeyDown={(event) => { if (!audioRef.current || !duration) return; if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); const direction = event.key === 'ArrowRight' ? 1 : -1; audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + direction * 5)); setCurrentTime(audioRef.current.currentTime) } }}>
            {Array.from({ length: 64 }, (_, index) => <span key={index} className={`w-0.5 shrink-0 rounded-full transition-colors duration-400 ease-in-out ${index / 64 < progress ? 'bg-[#59636a] dark:bg-[#cbd5e1]' : 'bg-[#cbd2d5] dark:bg-gray-600'}`} style={{ height: `${11 + ((index * 17) % 24)}px` }} />)}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-foreground-muted" dir="ltr">
          <div className="flex items-center gap-1"><button type="button" onClick={() => skip(-5)} aria-label={audio.rewindLabel || '5 ثانیه به عقب'} className="relative flex size-8 items-center justify-center hover:text-primary"><RotateCcw size={20} /><span className="absolute text-[9px] font-bold">5</span></button><button type="button" onClick={() => skip(5)} aria-label={audio.forwardLabel || '5 ثانیه به جلو'} className="relative flex size-8 scale-x-[-1] items-center justify-center hover:text-primary"><RotateCcw size={20} /><span className="absolute scale-x-[-1] text-[9px] font-bold">5</span></button></div>
          <button type="button" onClick={cyclePlaybackSpeed} aria-label={`سرعت پخش ${playbackSpeed.toFixed(1)}x`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover"><Gauge size={15} aria-hidden="true" />{playbackSpeed.toFixed(1)}x</button>
          <div className="flex items-center gap-1 text-xs" dir="ltr"><span>{formatTime(currentTime)}</span><span aria-hidden="true">-</span><span>{formatTime(duration)}</span></div>
        </div>
        <audio ref={audioRef} className="sr-only" preload="metadata"><source src={audio.src} type={audio.type || 'audio/mpeg'} />{audio.unsupportedLabel}</audio>
      </div>
    </div>
  </div>
}

export default AudioMedia
