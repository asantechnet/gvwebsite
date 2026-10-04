import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronDown,
  House,
  Info,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Search,
  Sun,
  Wrench,
  X,
} from "lucide-react";

import { headerNavigation } from "@/data/navigation.js";

const noFocusOutline = "focus:outline-none focus-visible:outline-none";
const iconButtonClasses =
  "grid size-10 place-items-center rounded-xl border border-border bg-surface-muted text-foreground transition-colors hover:border-primary hover:bg-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700";
const navIcons = {
  home: House,
  opportunities: BriefcaseBusiness,
  services: Wrench,
  magazine: Newspaper,
  about: Info,
  contact: Phone,
};
const navLinkClasses = `relative flex min-h-10 items-center gap-1.5 rounded-xl border border-transparent px-2 text-sm font-bold text-foreground-muted transition-colors after:absolute after:inset-x-2 after:bottom-0.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 dark:text-gray-100 xl:px-3 ${noFocusOutline}`;
const activeNavLinkClasses = "text-primary after:scale-x-100";

function NavigationIcon({ id }) {
  const Icon = navIcons[id];
  return <Icon aria-hidden="true" className="size-4" />;
}

function isNavigationItemActive(item, currentPath) {
  return (
    item.href === currentPath ||
    item.children?.some((child) => child.href === currentPath)
  );
}

function SearchPanel({ id, content, query, onQueryChange, onSubmit }) {
  return (
    <form
      id={id}
      role="search"
      data-search-popover
      onSubmit={onSubmit}
      className="absolute end-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-2.5 shadow-[0_12px_30px_rgba(41,23,18,0.14)] dark:border-gray-600 dark:bg-gray-800 dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
    >
      <label htmlFor={`${id}-input`} className="sr-only">
        {content.searchLabel}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-muted p-1.5 transition-colors focus-within:border-primary dark:border-gray-600 dark:bg-gray-700 dark:focus-within:border-gray-400">
        <input
          id={`${id}-input`}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={content.searchPlaceholder}
          autoComplete="off"
          className="search-field min-w-0 flex-1 appearance-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
        />
        <button
          type="submit"
          aria-label={content.searchSubmitLabel}
          className={`grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:border-primary hover:bg-primary/20 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-400 dark:hover:bg-gray-700 ${noFocusOutline}`}
        >
          <Search aria-hidden="true" className="size-4" />
        </button>
      </div>
    </form>
  );
}

function Header({
  content,
  theme,
  language,
  onThemeToggle,
  onLanguageToggle,
  className = "",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(() => {
    const activeSection = headerNavigation.find((item) =>
      item.children?.some((child) => child.href === window.location.pathname),
    );
    return activeSection?.id ?? null;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const menuButtonRef = useRef(null);
  const previousScrollPosition = useRef(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    const updateHeaderVisibility = () => {
      const currentScrollPosition = window.scrollY;
      const scrollDifference = currentScrollPosition - previousScrollPosition.current;

      if (currentScrollPosition < 16 || scrollDifference < -8 || isMenuOpen) {
        setIsHeaderVisible(true);
      } else if (scrollDifference > 8) {
        setIsHeaderVisible(false);
      }

      previousScrollPosition.current = currentScrollPosition;
    };

    window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderVisibility);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen && !isSearchOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        if (isMenuOpen) menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      const target = event.target;
      if (
        target instanceof Element &&
        (target.closest("[data-search-control]") || target.closest("[data-search-popover]"))
      ) {
        return;
      }
      setIsSearchOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isSearchOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    window.location.assign(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const currentPath = window.location.pathname;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 w-full ${className}`.trim()}
    >
      <div className={`w-full border-b border-border/70 bg-surface shadow-[0_8px_30px_rgba(41,23,18,0.04)] transition-transform duration-300 ease-out dark:border-gray-600 dark:bg-gray-700 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-6 px-4 py-1.5 max-md:min-h-16 max-md:py-1 sm:px-6 md:max-xl:min-h-16 md:max-xl:py-1 xl:px-8">
        <a
          href="/"
          aria-label={content.homeLabel}
          className={`m-0 shrink-0 rounded-2xl border border-transparent p-0 transition-colors ${noFocusOutline}`}
        >
          <img
            src="/icon.webp"
            alt={content.logoAlt}
            width="1431"
            height="974"
            className="m-0 h-12 w-auto p-0 object-contain lg:h-14 md:max-xl:h-12"
          />
        </a>

        <nav
          aria-label={content.primaryNavigationLabel}
          className="hidden items-center gap-1 xl:flex xl:gap-2"
        >
          {headerNavigation.map((item) => (
            <div key={item.id} className="group relative">
              {item.children?.length > 0 ? (
                <span
                  className={`${navLinkClasses} cursor-default ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                >
                  <NavigationIcon id={item.id} />
                  {content.navigation[item.id]}
                </span>
              ) : (
                <a
                  href={item.href}
                  aria-current={isNavigationItemActive(item, currentPath) ? "page" : undefined}
                  className={`${navLinkClasses} ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                >
                  <NavigationIcon id={item.id} />
                  {content.navigation[item.id]}
                </a>
              )}
              {item.children?.length > 0 && (
                <div className="invisible absolute start-0 top-full z-50 grid min-w-48 translate-y-2 gap-1 rounded-2xl border border-border bg-surface p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-600 dark:bg-gray-800">
                  {item.children.map((child) => (
                    <a
                      key={child.id}
                      href={child.href}
                      aria-current={currentPath === child.href ? "page" : undefined}
                      className={`rounded-lg px-3 py-2 text-right text-sm transition-colors hover:bg-surface-muted hover:text-foreground dark:hover:bg-gray-700 ${currentPath === child.href ? "font-extrabold text-primary" : "font-medium text-foreground-muted dark:text-gray-100"}`}
                    >
                      {content.subNavigation[item.id][child.id]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex shrink-0 items-center gap-2 xl:gap-3">
          <button
            type="button"
            aria-label={content.languageToggleLabel}
            onClick={onLanguageToggle}
            className={`inline-grid h-10 place-items-center rounded-xl border border-border bg-surface-muted px-4 text-center text-sm font-bold leading-none text-foreground transition-colors hover:border-primary hover:bg-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700 ${noFocusOutline}`}
          >
            <span lang={language}>{content.languageName}</span>
          </button>
          <button
            type="button"
            aria-label={content.themeToggleLabel}
            aria-pressed={theme === "dark"}
            onClick={onThemeToggle}
            className={`${iconButtonClasses} ${noFocusOutline}`}
          >
            {theme === "dark" ? (
              <Sun aria-hidden="true" className="size-5" />
            ) : (
              <Moon aria-hidden="true" className="size-5" />
            )}
          </button>
          <div className="relative">
            <button
              type="button"
              data-search-control
              aria-label={content.searchLabel}
              aria-expanded={isSearchOpen}
              aria-controls="desktop-search-panel"
              onClick={() => setIsSearchOpen((isOpen) => !isOpen)}
              className={`${iconButtonClasses} ${noFocusOutline}`}
            >
              <Search aria-hidden="true" className="size-5" />
            </button>
            {isSearchOpen && (
              <SearchPanel
                id="desktop-search-panel"
                content={content}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSubmit={handleSearchSubmit}
              />
            )}
          </div>
          <a
            href="/contact"
            className={`hidden min-h-10 items-center justify-center rounded-xl border-2 border-primary bg-primary px-5 text-sm font-semibold text-brand-white shadow-[0_8px_20px_rgba(245,155,34,0.2)] transition-colors hover:border-primary-hover hover:bg-primary-hover dark:hover:border-[#db7f0e] dark:hover:bg-[#db7f0e] xl:inline-flex xl:px-6 xl:text-base ${noFocusOutline}`}
          >
            {content.consultationLabel}
          </a>
          </div>

          <button
          ref={menuButtonRef}
          type="button"
          aria-label={
            isMenuOpen ? content.closeMenuLabel : content.openMenuLabel
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setIsHeaderVisible(true);
            setIsMenuOpen((isOpen) => !isOpen);
          }}
          className={`grid size-10 place-items-center rounded-xl border border-border bg-surface-muted text-foreground transition-colors hover:border-primary hover:bg-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-600 xl:hidden ${noFocusOutline}`}
        >
          {isMenuOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
          </button>
        </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={content.closeMenuLabel}
        onClick={() => setIsMenuOpen(false)}
        className={`${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"} fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden`}
      />
      <div
        id="mobile-navigation"
        className={`${isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full"} fixed inset-y-0 right-0 z-50 grid w-3/4 grid-rows-[auto_1fr] border-l border-border bg-surface p-5 shadow-[0_20px_60px_rgba(41,23,18,0.16)] transition-transform duration-300 ease-out md:w-1/2 xl:hidden dark:border-gray-600 dark:bg-gray-800 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-foreground/10 pb-4">
          <a
            href="/"
            onClick={() => setIsMenuOpen(false)}
            aria-label={content.homeLabel}
            className={`flex justify-start ${noFocusOutline}`}
          >
            <img
              src="/horizontal%20logo.webp"
              alt={content.logoAlt}
              width="1946"
              height="490"
            className="h-9 w-auto object-contain md:h-10"
            />
          </a>
          <button
            type="button"
            aria-label={content.closeMenuLabel}
            onClick={() => setIsMenuOpen(false)}
            className={`${iconButtonClasses} !size-8 md:!size-10 ${noFocusOutline}`}
          >
            <X aria-hidden="true" className="size-4 md:size-5" />
          </button>
        </div>
        <nav
          aria-label={content.mobileNavigationLabel}
          className="min-h-0 w-full overflow-y-auto overscroll-contain pb-2 text-right"
        >
          <div className="grid content-start justify-items-start gap-2">
            {headerNavigation.map((item) => {
              const hasChildren = item.children?.length > 0;
              const isSectionOpen = openMobileSection === item.id;

              return (
                <div key={item.id} className="grid w-full justify-items-start gap-1">
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={isSectionOpen}
                      aria-controls={`mobile-${item.id}-submenu`}
                      onClick={() =>
                        setOpenMobileSection((section) =>
                          section === item.id ? null : item.id,
                        )
                      }
                      className={`${navLinkClasses} w-auto justify-start px-3 text-right ${isSectionOpen ? activeNavLinkClasses : ""}`}
                    >
                      <NavigationIcon id={item.id} />
                      {content.navigation[item.id]}
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform ${isSectionOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isNavigationItemActive(item, currentPath) ? "page" : undefined}
                      className={`${navLinkClasses} w-auto justify-start px-3 text-right ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                    >
                      <NavigationIcon id={item.id} />
                      {content.navigation[item.id]}
                    </a>
                  )}
                  {hasChildren && isSectionOpen && (
                    <div
                      id={`mobile-${item.id}-submenu`}
                      className="mr-5 grid justify-items-start gap-1 border-r border-border/60 pr-3 dark:border-gray-600"
                    >
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={child.href}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={
                            currentPath === child.href ? "page" : undefined
                          }
                          className={`rounded-lg px-3 py-1.5 text-right text-sm transition-colors hover:text-foreground dark:hover:text-white ${currentPath === child.href ? "font-extrabold text-primary dark:text-primary" : "text-foreground-muted dark:text-gray-300"}`}
                        >
                          {content.subNavigation[item.id][child.id]}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
