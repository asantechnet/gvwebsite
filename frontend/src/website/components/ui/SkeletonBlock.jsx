const shimmerClasses = "relative isolate block overflow-hidden rounded-xl bg-foreground/10 after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:animate-[skeletonShimmerSweep_1.55s_ease-in-out_infinite] after:bg-[linear-gradient(105deg,transparent_18%,transparent_38%,rgba(255,255,255,.64)_50%,transparent_62%)] after:content-[''] after:[will-change:transform] motion-reduce:after:[animation-duration:2.8s]"

function SkeletonBlock({ className = '', children = null }) {
  return <span className={`${shimmerClasses} ${className}`.trim()} aria-hidden="true">{children}</span>
}

export default SkeletonBlock
