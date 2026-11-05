import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function PasswordInput({ className = '', inputClassName = '', showLabel = 'Show password', hideLabel = 'Hide password', ...props }) {
  const [visible, setVisible] = useState(false)
  return <span className={`relative block overflow-hidden ${className}`}><input {...props} type={visible ? 'text' : 'password'} className={`block min-h-11 w-full border-0 bg-transparent px-4 pe-12 text-sm font-normal text-admin-heading outline-none ${inputClassName}`} /><button type="button" onClick={() => setVisible((current) => !current)} className="absolute inset-y-0 end-0 grid w-12 place-items-center border-0 bg-transparent text-admin-muted transition hover:text-admin-brand-text focus:bg-admin-brand-soft focus:text-admin-brand-text" aria-label={visible ? hideLabel : showLabel}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
}

export default PasswordInput
