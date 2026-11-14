import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";
import { getCountryCode, getCountryFlag } from "@/shared/utils/countries.js";

const cardLayoutClasses = {
  wide: "md:col-span-3",
  standard: "md:col-span-2",
};

const focusClasses =
  "focus:outline-none focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-lg";

function DestinationCard({ item }) {
  const href = useLocalizedHref(item.href);
  const countryFlag = getCountryFlag(item.countryCode || getCountryCode(item.name));
  return (
    <a
      href={href}
      className={`group relative block h-56 overflow-hidden rounded-2xl border border-transparent bg-surface shadow-sm transition-all hover:shadow-lg md:h-60 ${cardLayoutClasses[item.layout] || cardLayoutClasses.standard} ${focusClasses}`}
    >
      <img src={item.image} alt={item.imageAlt} width="1400" height="934" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/20" />
      <span className="absolute inset-x-0 top-0 flex items-center gap-3 p-5 text-brand-white">
        {item.flag ? <img src={item.flag} alt="" width="32" height="32" loading="lazy" className="size-8 rounded-full border-2 border-white/80 object-cover shadow-sm" /> : <span aria-hidden="true" className="grid size-8 place-items-center text-2xl drop-shadow-sm">{countryFlag}</span>}
        <span className="font-heading text-xl font-extrabold drop-shadow-md sm:text-2xl">{item.name}</span>
      </span>
    </a>
  );
}

export default DestinationCard;
