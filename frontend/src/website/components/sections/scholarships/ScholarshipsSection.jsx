import {
  CalendarDays,
  ChevronDown,
  GraduationCap,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import Container from "@ui/Container.jsx";
import PostPagination from "@ui/PostPagination.jsx";
import Section from "@ui/Section.jsx";
import { filterScholarships } from "@website/utils/catalog.js";
import { SCHOLARSHIPS_PER_PAGE } from "@website/utils/cardCounts.js";
import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";
import useModalFocus from "@/shared/hooks/useModalFocus.js";
import { getCountries, getCountryCode, normalizeCountrySearch } from "@/shared/utils/countries.js";
import { formatScholarshipDeadline } from "@website/utils/scholarshipDate.js";

const initialFilters = { country: "", degree: "", funding: "", deadline: "" };
function FilterModal({ open, onClose, title, children }) {
  const dialogRef = useModalFocus({ active: open, onClose });
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4 backdrop-blur-[2px] lg:hidden" onMouseDown={onClose}><section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="website-filter-title" className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl dark:border-gray-600 dark:bg-gray-800" onMouseDown={(event) => event.stopPropagation()}><header className="flex items-center gap-3 border-b border-border p-4 dark:border-gray-600"><span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-accent-text"><SlidersHorizontal size={17} /></span><h2 id="website-filter-title" className="min-w-0 flex-1 text-start font-heading text-base font-extrabold text-foreground">{title}</h2><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-xl border border-border text-foreground-muted hover:border-primary hover:text-accent-text dark:border-gray-600" aria-label="Close"><X size={17} /></button></header><div className="grid max-h-[70svh] gap-4 overflow-y-auto p-4">{children}</div></section></div>;
}

function FilterSelect({
  language,
  label,
  value,
  options,
  allLabel,
  onChange,
  icon: Icon,
  isOpen,
  onToggle,
  searchable = false,
  searchPlaceholder = "",
  emptyLabel = "",
}) {
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);
  const optionsRef = useRef(null);
  const [query, setQuery] = useState("");
  const choices = useMemo(() => options.map((option) => typeof option === "string" ? { value: option, label: option } : option), [options]);
  const selectedLabel = choices.find((option) => option.value === value)?.label || allLabel;
  const normalizedQuery = normalizeCountrySearch(query);
  const visibleChoices = choices.filter((option) => !normalizedQuery || normalizeCountrySearch(option.label).includes(normalizedQuery));

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) { onToggle(false); setQuery(""); }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (!isOpen) return;
    window.requestAnimationFrame(() => {
      if (searchable) searchRef.current?.focus({ preventScroll: true });
      optionsRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "center" });
    });
  }, [isOpen, searchable]);

  return (
    <div ref={wrapperRef} className="relative min-w-0 flex-1 text-start">
      <span className={`mb-1 flex items-center gap-1.5 text-[10px] text-foreground-muted ${language === "en" ? "font-medium" : "font-bold"}`}>
        <Icon aria-hidden="true" size={13} className="text-accent-text" />
        {label}
      </span>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => onToggle(!isOpen)}
        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-xl border bg-surface/90 px-2.5 text-start text-[11px] shadow-[0_2px_8px_rgba(54,69,77,0.05)] transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary)_18%,transparent)] ${language === "en" ? "font-medium" : "font-bold"} ${isOpen ? "border-primary" : "border-border"}`}
      >
        <span className={value ? "text-foreground" : "text-foreground-muted"}>
          {selectedLabel}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={15}
          className={`shrink-0 text-accent-text transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        role="listbox"
        aria-label={label}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface p-0 text-start shadow-[0_8px_18px_rgba(54,69,77,0.14)] transition-all duration-200 motion-reduce:transition-none dark:border-gray-600 dark:bg-gray-800 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"}`}
      >
        {searchable && <label className="m-1.5 flex min-h-9 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-foreground-muted focus-within:border-primary dark:border-gray-600 dark:bg-gray-700"><Search aria-hidden="true" size={14} /><input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none" /></label>}
        <div ref={optionsRef} className="max-h-60 overflow-y-auto">
        {[{ value: "", label: allLabel }, ...visibleChoices].map((option) => {
          const optionValue = option.value;
          const selected = value === optionValue;
          return (
            <button
              type="button"
              role="option"
              aria-selected={selected}
              key={optionValue || "all"}
              onClick={() => {
                onChange(optionValue);
                onToggle(false);
              }}
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                minHeight: "32px",
                paddingBlock: "5px",
              }}
                className={`block w-full rounded-md px-2.5 text-start transition-colors ${selected ? `bg-primary/10 ${language === "en" ? "font-semibold" : "font-extrabold"} text-accent-text` : `${language === "en" ? "font-medium" : "font-semibold"} text-foreground hover:bg-primary/10 hover:text-accent-text`}`}
            >
              <span className="inline-flex items-center gap-2">{option.flag && <span aria-hidden="true" className="text-lg">{option.flag}</span>}<span>{option.label}</span></span>
            </button>
          );
        })}
        {visibleChoices.length === 0 && <p className="px-3 py-5 text-center text-xs text-foreground-muted">{emptyLabel}</p>}
        </div>
      </div>
    </div>
  );
}

function ScholarshipCard({ scholarship, language }) {
  const scholarshipHref = useLocalizedHref(`/scholarships/${scholarship.slug}`);
  const deadline = formatScholarshipDeadline(scholarship.deadline, language, scholarship.slug);

  return (
    <article dir={language === "en" ? "ltr" : "rtl"} className="group rounded-3xl border border-border bg-background p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_12px_28px_rgba(54,69,77,0.1)] dark:border-gray-700 dark:bg-surface md:p-4">
      <a href={scholarshipHref} className="block">
        <div className="grid gap-4 rounded-2xl bg-surface-muted/55 p-4 text-center dark:bg-gray-800/55 md:min-h-32 md:grid-cols-[7rem_minmax(0,1fr)] md:items-stretch md:text-start">
          <div className="flex min-h-28 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-700 md:min-h-0">
            <img
              src={scholarship.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full max-h-40 w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center py-2 md:px-3">
            <h2 className="font-heading text-lg font-extrabold leading-7 text-foreground transition-colors group-hover:text-accent-text md:text-xl">
              {scholarship.title}
            </h2>
            <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-muted ${language === "en" ? "justify-start" : "justify-center md:justify-start"}`}>
              <MapPin aria-hidden="true" size={15} className="text-accent-text" />
              {scholarship.country}
            </p>
            <div className={`mt-3 flex flex-wrap items-center gap-2 ${language === "en" ? "justify-start" : "justify-center md:justify-start"}`}>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-accent-text">
                <GraduationCap aria-hidden="true" size={14} />
                {scholarship.degree}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2.5 py-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">
                <WalletCards aria-hidden="true" size={14} />
                {scholarship.funding}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-foreground-muted">
                <CalendarDays
                  aria-hidden="true"
                  size={14}
                  className="text-accent-text"
                />
                {deadline}
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  );
}

function ScholarshipsSection({ content, language = "dr" }) {
  const [filters, setFilters] = useState(initialFilters);
  const [openFilter, setOpenFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const visibility = content.visibility || {};
  const countryOptions = useMemo(() => {
    const countryLanguage = language === "dr" ? "prs" : language;
    const locale = countryLanguage === "prs" ? "fa-AF" : countryLanguage === "ps" ? "ps-AF" : "en";
    const existingNames = new Map(content.options.countries.map((name) => [getCountryCode(name), name]));
    return getCountries(countryLanguage)
      .map((country) => ({ value: existingNames.get(country.code) || country.name, label: country.name, flag: country.flag }))
      .sort((first, second) => first.label.localeCompare(second.label, locale, { sensitivity: "base" }));
  }, [content.options.countries, language]);

  const filteredScholarships = useMemo(
    () => filterScholarships(content.items, filters),
    [content.items, filters],
  );
  const totalPages = Math.ceil(
    filteredScholarships.length / SCHOLARSHIPS_PER_PAGE,
  );
  const visibleScholarships = filteredScholarships.slice(
    (currentPage - 1) * SCHOLARSHIPS_PER_PAGE,
    currentPage * SCHOLARSHIPS_PER_PAGE,
  );

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setCurrentPage(1);
  };
  const resetFilters = () => {
    setFilters(initialFilters);
    setOpenFilter(null);
    setCurrentPage(1);
  };
  const filterControls = <>
    <FilterSelect searchable searchPlaceholder={content.filters.countrySearch} emptyLabel={content.filters.countryEmpty} language={language} icon={MapPin} label={content.filters.country} value={filters.country} options={countryOptions} allLabel={content.filters.all} onChange={(value) => updateFilter("country", value)} isOpen={openFilter === "country"} onToggle={(isOpen) => setOpenFilter(isOpen ? "country" : null)} />
    <FilterSelect language={language} icon={GraduationCap} label={content.filters.degree} value={filters.degree} options={content.options.degrees} allLabel={content.filters.all} onChange={(value) => updateFilter("degree", value)} isOpen={openFilter === "degree"} onToggle={(isOpen) => setOpenFilter(isOpen ? "degree" : null)} />
    <FilterSelect language={language} icon={WalletCards} label={content.filters.funding} value={filters.funding} options={content.options.funding} allLabel={content.filters.all} onChange={(value) => updateFilter("funding", value)} isOpen={openFilter === "funding"} onToggle={(isOpen) => setOpenFilter(isOpen ? "funding" : null)} />
    <FilterSelect language={language} icon={CalendarDays} label={content.filters.deadline} value={filters.deadline} options={content.options.deadlines} allLabel={content.filters.all} onChange={(value) => updateFilter("deadline", value)} isOpen={openFilter === "deadline"} onToggle={(isOpen) => setOpenFilter(isOpen ? "deadline" : null)} />
    <button type="button" onClick={resetFilters} className={`mt-2 inline-flex h-9 min-h-9 shrink-0 self-center items-center justify-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3 text-[11px] text-accent-text transition-all hover:border-primary/50 hover:bg-primary/15 sm:mt-0 sm:self-end ${language === "en" ? "font-medium" : "font-bold"}`} aria-label={content.filters.reset}><RotateCcw aria-hidden="true" size={13} />{content.filters.reset}</button>
  </>;

  return (
    <div className="relative overflow-x-clip bg-background text-foreground dark:bg-gray-800 dark:text-[#fff8f3]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,color-mix(in_srgb,var(--theme-primary)_20%,transparent),transparent_30%),radial-gradient(circle_at_85%_38%,color-mix(in_srgb,var(--theme-primary)_8%,transparent),transparent_28%)] dark:bg-[radial-gradient(circle_at_15%_8%,color-mix(in_srgb,var(--theme-primary)_22%,transparent),transparent_30%),radial-gradient(circle_at_85%_38%,color-mix(in_srgb,var(--theme-primary)_14%,transparent),transparent_28%)]"
        aria-hidden="true"
      />
      {visibility.hero !== false && <Section
        padded={false}
        className="relative bg-transparent pb-6 pt-12 md:py-8 lg:py-10"
      >
        <Container className="relative max-w-6xl!">
          <div className="mx-auto w-full max-w-6xl text-center">
            <h1 className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-heading text-sm font-bold text-foreground">
              <Sparkles aria-hidden="true" size={17} className="text-accent-text" />
              {content.hero.eyebrow}
            </h1>
            <button type="button" onClick={() => setFilterModalOpen(true)} className="mx-auto mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 text-sm font-bold text-accent-text lg:hidden"><SlidersHorizontal size={16} />{content.filters.title}</button>
            <FilterModal open={filterModalOpen} onClose={() => setFilterModalOpen(false)} title={content.filters.title}><div className="grid gap-4">{filterControls}</div></FilterModal>
            <div className="relative z-30 mx-auto mt-3 hidden w-full rounded-2xl border border-white/90 bg-white/55 p-2 shadow-[0_12px_28px_rgba(54,69,77,0.1)] backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/65 lg:block">
              <h2 className="sr-only">{content.filters.title}</h2>
              <div className="flex flex-col gap-1.5 sm:flex-row">
                {filterControls}
              </div>
            </div>
          </div>
        </Container>
      </Section>}

      {visibility.scholarships !== false && <Section
        padded={false}
        className="relative bg-transparent pb-3 pt-0 md:pb-5 lg:pb-7"
      >
        <Container className="max-w-6xl!">
          {filteredScholarships.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.slug}
                  scholarship={scholarship}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <Search
                aria-hidden="true"
                className="mx-auto text-accent-text"
                size={42}
              />
              <h2 className="mt-4 font-heading text-xl font-extrabold text-foreground">
                {content.results.emptyTitle}
              </h2>
              <p className="mt-2 text-foreground-muted">
                {content.results.emptyDescription}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-[#fff8f3] transition-colors hover:bg-primary-hover"
              >
                <RotateCcw aria-hidden="true" size={16} />
                {content.filters.reset}
              </button>
            </div>
          )}
          <div className="mt-4 flex min-h-9 flex-col items-center justify-between gap-2 border-t border-border px-2 pt-1 md:flex-row md:gap-4">
            <PostPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              labels={content.pagination}
              className="mt-0! justify-center md:justify-start"
              compact
            />
            <p className="flex min-h-9 shrink-0 items-center text-center text-xs font-semibold leading-5 text-foreground-muted md:text-start">
              {content.results.showing}{" "}
              <span className="mx-1 font-extrabold text-foreground">
                {visibleScholarships.length}
              </span>{" "}
              {content.results.of}{" "}
              <span className="mx-1 font-extrabold text-foreground">
                {filteredScholarships.length}
              </span>{" "}
              {content.results.opportunities}
            </p>
          </div>
        </Container>
      </Section>}
    </div>
  );
}

export default ScholarshipsSection;
