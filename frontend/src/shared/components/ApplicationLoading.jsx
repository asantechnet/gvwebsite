function ApplicationLoading({ contained = false }) {
  return <div role="status" aria-live="polite" aria-busy="true" className={`grid place-items-center bg-background text-accent-text ${contained ? 'min-h-[24rem] rounded-2xl border border-admin-border bg-admin-card' : 'min-h-screen'}`}><span aria-hidden="true" className="size-10 animate-spin rounded-full border-4 border-current/20 border-t-current motion-reduce:animate-none" /><span className="sr-only">Loading</span></div>
}

export default ApplicationLoading
