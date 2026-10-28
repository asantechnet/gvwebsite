import {
  CalendarDays,
  ChevronDown,
  GraduationCap,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import Container from "@ui/Container.jsx";
import PostPagination from "@ui/PostPagination.jsx";
import Section from "@ui/Section.jsx";
import { filterScholarships } from "@website/utils/catalog.js";

const initialFilters = { country: "", degree: "", funding: "", deadline: "" };
const scholarshipsPerPage = 10;
const pashtoDeadlineDates = {
  "د ټاکل شوي پروګرام له مخې": "25 لړم 1405",
  "د رسمي غوښتنلیک دورې مطابق": "3 لیندۍ 1405",
  "د کلني اعلان مطابق": "10 مرغومی 1405",
  "د رسمي اعلان مطابق": "18 سلواغه 1405",
  "د څېړنیز اعلان مطابق": "15 وری 1406",
};

function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
  icon: Icon,
  isOpen,
  onToggle,
}) {
  const wrapperRef = useRef(null);
  const selectedLabel = value || allLabel;

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) onToggle(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={wrapperRef} className="relative min-w-0 flex-1 text-right">
      <span className="mb-1 flex items-center gap-1.5 text-[10px] font-bold text-foreground-muted">
        <Icon aria-hidden="true" size={13} className="text-primary" />
        {label}
      </span>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => onToggle(!isOpen)}
        className={`flex min-h-9 w-full items-center justify-between gap-2 rounded-xl border bg-white/90 px-2.5 text-right text-[11px] font-bold shadow-[0_2px_8px_rgba(54,69,77,0.05)] transition-all hover:border-primary/60 hover:shadow-[0_4px_12px_rgba(245,155,34,0.1)] focus:outline-none focus:shadow-[0_0_0_3px_rgba(245,155,34,0.18)] dark:bg-gray-700/90 ${isOpen ? "border-primary" : "border-[#eadfce] dark:border-gray-600"}`}
      >
        <span className={value ? "text-foreground" : "text-foreground-muted"}>
          {selectedLabel}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={15}
          className={`shrink-0 text-primary transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        role="listbox"
        aria-label={label}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`absolute inset-x-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-surface p-0 text-right shadow-[0_8px_18px_rgba(54,69,77,0.14)] transition-all duration-200 motion-reduce:transition-none dark:border-gray-600 dark:bg-gray-800 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-2 opacity-0"}`}
      >
        {[allLabel, ...options].map((option) => {
          const optionValue = option === allLabel ? "" : option;
          const selected = value === optionValue;
          return (
            <button
              type="button"
              role="option"
              aria-selected={selected}
              key={option}
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
              className={`block w-full rounded-md px-2.5 text-right transition-colors ${selected ? "bg-primary/10 font-extrabold text-primary" : "font-semibold text-foreground hover:bg-primary/10 hover:text-primary"}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScholarshipCard({ scholarship }) {
  const deadline =
    pashtoDeadlineDates[scholarship.deadline] || scholarship.deadline;

  return (
    <article className="group rounded-3xl border border-[#eadfce] bg-[#fffaf5] p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-[0_12px_28px_rgba(54,69,77,0.1)] dark:border-gray-700 dark:bg-[#2b3442] md:p-4">
      <a href={`/scholarships/${scholarship.slug}`} className="block">
        <div className="grid gap-4 rounded-2xl bg-surface-muted/55 p-4 text-center dark:bg-gray-800/55 md:min-h-32 md:grid-cols-[7rem_minmax(0,1fr)] md:items-stretch md:text-right">
          <div className="flex min-h-28 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-700 md:min-h-0">
            <img
              src={scholarship.image}
              alt=""
              className="h-full max-h-40 w-full object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-col justify-center py-2 md:px-3">
            <h2 className="font-heading text-lg font-extrabold leading-7 text-foreground transition-colors group-hover:text-primary md:text-xl">
              {scholarship.title}
            </h2>
            <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground-muted md:justify-start">
              <MapPin aria-hidden="true" size={15} className="text-primary" />
              {scholarship.country}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-primary">
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
                  className="text-primary"
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

function ScholarshipsSection({ content }) {
  const [filters, setFilters] = useState(initialFilters);
  const [openFilter, setOpenFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredScholarships = useMemo(
    () => filterScholarships(content.items, filters),
    [content.items, filters],
  );
  const totalPages = Math.ceil(
    filteredScholarships.length / scholarshipsPerPage,
  );
  const visibleScholarships = filteredScholarships.slice(
    (currentPage - 1) * scholarshipsPerPage,
    currentPage * scholarshipsPerPage,
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

  return (
    <div className="relative overflow-x-clip bg-[#fff4e8] text-foreground dark:bg-gray-800 dark:text-[#fff8f3]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(245,155,34,0.2),transparent_30%),radial-gradient(circle_at_85%_38%,rgba(236,31,39,0.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_15%_8%,rgba(245,155,34,0.22),transparent_30%),radial-gradient(circle_at_85%_38%,rgba(236,31,39,0.14),transparent_28%)]"
        aria-hidden="true"
      />
      <Section
        padded={false}
        className="relative bg-transparent pb-6 pt-12 md:py-8 lg:py-10"
      >
        <Container className="relative max-w-6xl!">
          <div className="mx-auto w-full max-w-6xl text-center">
            <h1 className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-heading text-sm font-bold text-foreground">
              <Sparkles aria-hidden="true" size={17} className="text-primary" />
              {content.hero.eyebrow}
            </h1>
            <div className="relative z-30 mx-auto mt-3 w-full rounded-2xl border border-white/90 bg-white/55 p-2 shadow-[0_12px_28px_rgba(54,69,77,0.1)] backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/65">
              <h2 className="sr-only">{content.filters.title}</h2>
              <div className="flex flex-col gap-1.5 sm:flex-row">
                <FilterSelect
                  icon={MapPin}
                  label={content.filters.country}
                  value={filters.country}
                  options={content.options.countries}
                  allLabel={content.filters.all}
                  onChange={(value) => updateFilter("country", value)}
                  isOpen={openFilter === "country"}
                  onToggle={(isOpen) =>
                    setOpenFilter(isOpen ? "country" : null)
                  }
                />
                <FilterSelect
                  icon={GraduationCap}
                  label={content.filters.degree}
                  value={filters.degree}
                  options={content.options.degrees}
                  allLabel={content.filters.all}
                  onChange={(value) => updateFilter("degree", value)}
                  isOpen={openFilter === "degree"}
                  onToggle={(isOpen) => setOpenFilter(isOpen ? "degree" : null)}
                />
                <FilterSelect
                  icon={WalletCards}
                  label={content.filters.funding}
                  value={filters.funding}
                  options={content.options.funding}
                  allLabel={content.filters.all}
                  onChange={(value) => updateFilter("funding", value)}
                  isOpen={openFilter === "funding"}
                  onToggle={(isOpen) =>
                    setOpenFilter(isOpen ? "funding" : null)
                  }
                />
                <FilterSelect
                  icon={CalendarDays}
                  label={content.filters.deadline}
                  value={filters.deadline}
                  options={content.options.deadlines}
                  allLabel={content.filters.all}
                  onChange={(value) => updateFilter("deadline", value)}
                  isOpen={openFilter === "deadline"}
                  onToggle={(isOpen) =>
                    setOpenFilter(isOpen ? "deadline" : null)
                  }
                />
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-2 inline-flex h-9 min-h-9 shrink-0 self-center items-center justify-center gap-1.5 rounded-xl border border-primary/25 bg-primary/10 px-3 text-[11px] font-bold text-primary transition-all hover:border-primary/50 hover:bg-primary/15 sm:mt-0 sm:self-end"
                  aria-label={content.filters.reset}
                >
                  <RotateCcw aria-hidden="true" size={13} />
                  {content.filters.reset}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section
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
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-16 text-center dark:border-gray-700 dark:bg-[#2b3442]">
              <Search
                aria-hidden="true"
                className="mx-auto text-primary"
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
          <div className="mt-4 flex min-h-9 flex-col items-center justify-between gap-2 border-t border-[#eadfce] px-2 pt-1 dark:border-gray-700 md:flex-row md:gap-4">
            <PostPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              labels={content.pagination}
              className="mt-0! justify-center md:justify-start"
              compact
            />
            <p className="flex min-h-9 shrink-0 items-center text-center text-xs font-semibold leading-5 text-foreground-muted md:text-left">
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
      </Section>
    </div>
  );
}

export default ScholarshipsSection;
