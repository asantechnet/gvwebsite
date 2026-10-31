import { useEffect, useRef, useState } from "react";
import Container from "@ui/Container.jsx";
import {
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  House,
  Info,
  MapPinned,
  Menu,
  Moon,
  Newspaper,
  Phone,
  Ellipsis,
  Search,
  Sun,
  Wrench,
  X,
} from "lucide-react";

import { headerNavigation } from "@website/data/navigation.js";
import LanguageSwitcher from "@ui/LanguageSwitcher.jsx";
import { localizeHref } from "@website/utils/language.js";

const noFocusOutline = "focus:outline-none focus-visible:outline-none";
const iconButtonClasses =
  "grid size-10 place-items-center rounded-xl border border-border bg-surface-muted text-foreground transition-colors hover:border-primary hover:bg-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500 dark:hover:bg-gray-700";
const navIcons = {
  home: House,
  opportunities: BriefcaseBusiness,
  services: Wrench,
  scholarships: GraduationCap,
  magazine: Newspaper,
  tourism: MapPinned,
  more: Ellipsis,
  about: Info,
  contact: Phone,
};
const navLinkClasses = `relative flex min-h-10 items-center gap-1.5 rounded-xl border border-transparent px-2 text-sm font-bold whitespace-nowrap text-foreground-muted transition-colors after:absolute after:inset-x-2 after:bottom-0.5 after:h-0.5 after:origin-right after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:text-foreground hover:after:scale-x-100 ltr:after:origin-left ltr:font-semibold dark:text-gray-100 rtl:gap-2.5 rtl:px-2 rtl:text-[0.9375rem] 2xl:gap-2 2xl:px-3 2xl:text-base rtl:2xl:gap-3 rtl:2xl:px-3 rtl:2xl:text-base max-xl:text-base max-xl:!font-semibold ltr:max-md:!text-sm ltr:max-md:!font-medium rtl:max-md:!text-sm rtl:max-md:!font-semibold ${noFocusOutline}`;
const activeNavLinkClasses = "text-primary after:scale-x-100";

function NavigationIcon({ id }) {
  const Icon = navIcons[id];
  return <Icon aria-hidden="true" className="hidden size-4 2xl:block" />;
}

function isNavigationItemActive(item, currentPath) {
  if (item.id === 'home') return item.href === currentPath;

  return (
    (item.href && item.href === currentPath) ||
    (item.href && currentPath.startsWith(`${item.href}/`)) ||
    item.children?.some((child) => child.href === currentPath || currentPath.startsWith(`${child.href}/`))
  );
}

function SearchPanel({ id, content, query, onQueryChange, onSubmit }) {
  return (
    <form
      id={id}
      role="search"
      data-search-popover
      onSubmit={onSubmit}
      className="absolute inset-e-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-2.5 shadow-[0_12px_30px_rgba(41,23,18,0.14)] dark:border-gray-600 dark:bg-gray-800 dark:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
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
  onLanguageChange,
  className = "",
}) {
  const navigation = headerNavigation.map((item) => ({
    ...item,
    href: item.href ? localizeHref(item.href, language) : item.href,
    children: item.children?.map((child) => ({
      ...child,
      href: localizeHref(child.href, language),
    })),
  }));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState(() => {
    const activeSection = navigation.find((item) =>
      item.children?.some((child) => window.location.pathname === child.href || window.location.pathname.startsWith(`${child.href}/`)),
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
      const scrollDifference =
        currentScrollPosition - previousScrollPosition.current;

      if (currentScrollPosition < 16 || scrollDifference < -8 || isMenuOpen) {
        setIsHeaderVisible(true);
      } else if (scrollDifference > 8) {
        setIsHeaderVisible(false);
      }

      previousScrollPosition.current = currentScrollPosition;
    };

    window.addEventListener("scroll", updateHeaderVisibility, {
      passive: true,
    });
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
        (target.closest("[data-search-control]") ||
          target.closest("[data-search-popover]"))
      ) {
        return;
      }
      setIsSearchOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isSearchOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
    window.location.assign(localizeHref(`/search?q=${encodeURIComponent(trimmedQuery)}`, language));
  };

  const currentPath = window.location.pathname;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 w-full ${className}`.trim()}>
      <div
        className={`w-full border-b border-border/70 bg-surface shadow-[0_8px_30px_rgba(41,23,18,0.04)] transition-transform duration-300 ease-out dark:border-gray-600 dark:bg-gray-700 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Container className="flex min-h-18 items-center justify-between gap-3 py-1.5 max-md:min-h-15 md:max-xl:min-h-15 ltr:xl:px-0 ltr:2xl:px-2 2xl:max-w-[96rem] ltr:2xl:max-w-none 2xl:gap-5">
          <a
            href={localizeHref('/', language)}
            aria-label={content.homeLabel}
            className={`m-0 shrink-0 rounded-2xl border border-transparent p-0 transition-colors ${noFocusOutline}`}
          >
            <img
              src={theme === "dark" ? "/assets/branding/new%20logo%20white.webp" : "/assets/branding/new%20logo.webp"}
              alt={content.logoAlt}
              width="1431"
              height="974"
              className="m-0 h-10 w-auto p-0 object-contain md:max-xl:h-11 xl:h-12 2xl:h-15"
            />
          </a>

          <nav
            aria-label={content.primaryNavigationLabel}
            className="hidden min-w-0 items-center gap-0.5 xl:flex xl:gap-2 2xl:gap-3"
          >
            {navigation.map((item) => (
              <div key={item.id} className="group relative">
                {item.children?.length > 0 ? (
                  <span
                    className={`${navLinkClasses} cursor-default ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                  >
                    <NavigationIcon id={item.id} />
                    {content.navigation[item.id]}
                    <ChevronDown aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:rotate-180" />
                  </span>
                ) : (
                  <a
                    href={item.href}
                    aria-current={
                      isNavigationItemActive(item, currentPath)
                        ? "page"
                        : undefined
                    }
                    className={`${navLinkClasses} ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                  >
                    <NavigationIcon id={item.id} />
                    {content.navigation[item.id]}
                  </a>
                )}
                {item.children?.length > 0 && (
                  <div className="invisible absolute inset-s-0 top-full z-50 grid min-w-48 translate-y-2 gap-1 rounded-2xl border border-border bg-surface p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 dark:border-gray-600 dark:bg-gray-800">
                    {item.children.map((child) => (
                      <a
                        key={child.id}
                        href={child.href}
                        aria-current={
                          currentPath === child.href || currentPath.startsWith(`${child.href}/`) ? "page" : undefined
                        }
                        className={`rounded-lg px-3 py-2 text-start text-sm transition-colors hover:bg-surface-muted hover:text-foreground dark:hover:bg-gray-700 ${currentPath === child.href || currentPath.startsWith(`${child.href}/`) ? "font-extrabold text-primary" : "font-medium text-foreground-muted dark:text-gray-100"}`}
                      >
                        {content.subNavigation[item.id][child.id]}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 2xl:gap-2">
            <div className="flex shrink-0 items-center gap-1.5 2xl:gap-2">
              <LanguageSwitcher language={language} onChange={onLanguageChange} />
              <button
                type="button"
                aria-label={content.themeToggleLabel}
                aria-pressed={theme === "dark"}
                onClick={onThemeToggle}
                className={`${iconButtonClasses} ${noFocusOutline}`}
              >
                {theme === "dark" ? (
                  <Sun aria-hidden="true" className="size-4" />
                ) : (
                  <Moon aria-hidden="true" className="size-4" />
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
                  <Search aria-hidden="true" className="size-4" />
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
                href={localizeHref('/contact', language)}
                className={`hidden h-10 min-h-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary bg-primary px-3 text-xs font-semibold leading-none whitespace-nowrap text-brand-white shadow-[0_8px_20px_rgba(244,126,38,0.2)] transition-colors hover:border-primary-hover hover:bg-primary-hover dark:hover:border-[#d96512] dark:hover:bg-[#d96512] xl:inline-flex 2xl:px-5 2xl:text-sm ${noFocusOutline}`}
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
        </Container>
      </div>

      <button
        type="button"
        aria-label={content.closeMenuLabel}
        onClick={() => setIsMenuOpen(false)}
        className={`${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"} fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden`}
      />
      <div
        id="mobile-navigation"
        className={`${isMenuOpen ? "translate-x-0" : "pointer-events-none translate-x-full ltr:-translate-x-full"} fixed inset-y-0 right-0 z-50 grid w-3/4 grid-rows-[auto_1fr] border-l border-border bg-surface p-5 shadow-[0_20px_60px_rgba(41,23,18,0.16)] transition-transform duration-300 ease-out ltr:left-0 ltr:right-auto ltr:border-l-0 ltr:border-r md:w-1/2 xl:hidden dark:border-gray-600 dark:bg-gray-800 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-foreground/10 pb-4">
          <a
            href={localizeHref('/', language)}
            onClick={() => setIsMenuOpen(false)}
            aria-label={content.homeLabel}
            className={`flex justify-start ${noFocusOutline}`}
          >
            <img
              src={theme === "dark" ? "/assets/branding/new%20logo%20white.webp" : "/assets/branding/new%20logo.webp"}
              alt={content.logoAlt}
              width="1431"
              height="974"
              className="h-9 w-auto object-contain md:h-10"
            />
          </a>
          <button
            type="button"
            aria-label={content.closeMenuLabel}
            onClick={() => setIsMenuOpen(false)}
            className={`${iconButtonClasses} size-8! md:size-10! ${noFocusOutline}`}
          >
            <X aria-hidden="true" className="size-4 md:size-5" />
          </button>
        </div>
        <nav
          aria-label={content.mobileNavigationLabel}
          className="min-h-0 w-full overflow-y-auto overscroll-contain pb-2 text-start"
        >
          <div className="grid content-start justify-items-start gap-2 max-md:gap-1">
            {navigation.map((item) => {
              const hasChildren = item.children?.length > 0;
              const isSectionOpen = openMobileSection === item.id;

              return (
                <div
                  key={item.id}
                  className="grid w-full justify-items-start gap-1"
                >
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
                      className={`${navLinkClasses} w-auto justify-start px-3 text-start ${isSectionOpen ? activeNavLinkClasses : ""}`}
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
                      aria-current={
                        isNavigationItemActive(item, currentPath)
                          ? "page"
                          : undefined
                      }
                      className={`${navLinkClasses} w-auto justify-start px-3 text-start ${isNavigationItemActive(item, currentPath) ? activeNavLinkClasses : ""}`}
                    >
                      <NavigationIcon id={item.id} />
                      {content.navigation[item.id]}
                    </a>
                  )}
                  {hasChildren && isSectionOpen && (
                    <div
                      id={`mobile-${item.id}-submenu`}
                      className="mr-5 grid justify-items-start gap-1 border-r border-border/60 pr-3 ltr:mr-0 ltr:ml-5 ltr:border-r-0 ltr:border-l ltr:pr-0 ltr:pl-3 dark:border-gray-600"
                    >
                      {item.children.map((child) => (
                        <a
                          key={child.id}
                          href={child.href}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={
                            currentPath === child.href || currentPath.startsWith(`${child.href}/`) ? "page" : undefined
                          }
                          className={`rounded-lg px-3 py-1.5 text-start text-sm transition-colors hover:text-foreground dark:hover:text-white ${currentPath === child.href || currentPath.startsWith(`${child.href}/`) ? "font-extrabold text-primary dark:text-primary" : "text-foreground-muted dark:text-gray-300"}`}
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
