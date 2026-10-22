import AudioMedia from './AudioMedia.jsx'
import ImageMedia from './ImageMedia.jsx'
import VideoMedia from './VideoMedia.jsx'

function MediaShowcase({ post, media }) {
  return <div className="mt-9 w-full min-w-0 max-w-full space-y-5 overflow-hidden" aria-label={media.label}>
    <ImageMedia post={post} media={media} />
    {media.audio?.src && <AudioMedia media={media} />}
    {media.video?.youtubeId && <VideoMedia post={post} media={media} />}
  </div>
}

export default MediaShowcase
