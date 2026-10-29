import { FaWhatsapp } from 'react-icons/fa6'

function FloatingWhatsApp({ phone, label, language }) {
  const whatsappNumber = phone.replace(/\D/g, '')
  const positionClass = language === 'en' ? 'right-5' : 'left-5'

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`fixed ${positionClass} bottom-4 z-40 flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-110 focus:outline-none focus-visible:border-2 focus-visible:border-white focus-visible:shadow-xl motion-safe:animate-[growShrink_2.4s_ease-in-out_infinite] sm:bottom-6 sm:size-12`}
    >
      <FaWhatsapp aria-hidden="true" className="size-5 sm:size-6" />
    </a>
  )
}

export default FloatingWhatsApp
