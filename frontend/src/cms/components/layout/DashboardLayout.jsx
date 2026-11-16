import { lazy, Suspense, useEffect, useState } from "react";

import PlaceholderPage from "@cms/components/pages/PlaceholderPage.jsx";
import DashboardSidebar from "./DashboardSidebar.jsx";
import DashboardTopbar from "./DashboardTopbar.jsx";
import DeleteConfirmation from "@cms/components/DeleteConfirmation.jsx";
import UnsavedChangesBar from "@cms/components/UnsavedChangesBar.jsx";
import ToastViewport from "@cms/components/ToastViewport.jsx";
import dariContent from "@cms/locales/prs/dashboard.json";
import pashtoContent from "@cms/locales/ps/dashboard.json";
import dariMagazineContent from "@website/locales/prs/magazine.json";
import dariServicesContent from "@website/locales/prs/services.json";
import pashtoServicesContent from "@website/locales/ps/services.json";
import dariMessagesContent from "@cms/locales/prs/messages.json";
import pashtoMessagesContent from "@cms/locales/ps/messages.json";
import dariProfileContent from "@cms/locales/prs/profile.json";
import pashtoProfileContent from "@cms/locales/ps/profile.json";
import dariHomeEditorContent from "@cms/locales/prs/home.json";
import pashtoHomeEditorContent from "@cms/locales/ps/home.json";
import dariHomeContent from "@website/locales/prs/home.json";
import pashtoHomeContent from "@website/locales/ps/home.json";
import dariAboutEditorContent from "@cms/locales/prs/about.json";
import pashtoAboutEditorContent from "@cms/locales/ps/about.json";
import dariAboutContent from "@website/locales/prs/about.json";
import pashtoAboutContent from "@website/locales/ps/about.json";
import dariMagazineEditorContent from "@cms/locales/prs/magazine.json";
import pashtoMagazineEditorContent from "@cms/locales/ps/magazine.json";
import pashtoMagazineContent from "@website/locales/ps/magazine.json";
import dariScholarshipsEditorContent from "@cms/locales/prs/scholarships.json";
import pashtoScholarshipsEditorContent from "@cms/locales/ps/scholarships.json";
import dariScholarshipsContent from "@website/locales/prs/scholarships.json";
import pashtoScholarshipsContent from "@website/locales/ps/scholarships.json";
import dariContactEditorContent from "@cms/locales/prs/contact.json";
import pashtoContactEditorContent from "@cms/locales/ps/contact.json";
import dariContactContent from "@website/locales/prs/contact.json";
import pashtoContactContent from "@website/locales/ps/contact.json";
import dariGuidesContent from "@website/locales/prs/guides.json";
import pashtoGuidesContent from "@website/locales/ps/guides.json";
import dariOpportunitiesContent from "@website/locales/prs/opportunities.json";
import pashtoOpportunitiesContent from "@website/locales/ps/opportunities.json";
import englishContent from "@cms/locales/en/dashboard.json";
import englishMessagesContent from "@cms/locales/en/messages.json";
import englishProfileContent from "@cms/locales/en/profile.json";
import dariDeviceContent from "@cms/locales/prs/device.json";
import pashtoDeviceContent from "@cms/locales/ps/device.json";
import englishDeviceContent from "@cms/locales/en/device.json";
import englishHomeEditorContent from "@cms/locales/en/home.json";
import englishAboutEditorContent from "@cms/locales/en/about.json";
import englishMagazineEditorContent from "@cms/locales/en/magazine.json";
import englishScholarshipsEditorContent from "@cms/locales/en/scholarships.json";
import englishContactEditorContent from "@cms/locales/en/contact.json";
import englishHomeContent from "@website/locales/en/home.json";
import englishAboutContent from "@website/locales/en/about.json";
import englishMagazineContent from "@website/locales/en/magazine.json";
import englishScholarshipsContent from "@website/locales/en/scholarships.json";
import englishContactContent from "@website/locales/en/contact.json";
import englishOpportunitiesContent from "@website/locales/en/opportunities.json";
import englishGuidesContent from "@website/locales/en/guides.json";
import englishServicesContent from "@website/locales/en/services.json";
import dariTourismContent from "@website/locales/prs/tourism.json";
import pashtoTourismContent from "@website/locales/ps/tourism.json";
import englishTourismContent from "@website/locales/en/tourism.json";
import dariMediaContent from "@cms/locales/prs/media.json";
import pashtoMediaContent from "@cms/locales/ps/media.json";
import englishMediaContent from "@cms/locales/en/media.json";
import dariSettingsContent from "@cms/locales/prs/settings.json";
import pashtoSettingsContent from "@cms/locales/ps/settings.json";
import englishSettingsContent from "@cms/locales/en/settings.json";
import { getCmsRouteKey, isCmsPath } from "@cms/routes.js";
import useAuth from "@cms/auth/useAuth.js";
import { canAccessCmsRoute, CMS_PERMISSIONS } from "@cms/auth/permissions.js";
import useMessages from "@cms/hooks/useMessages.js";
import { CmsLanguageProvider } from "@cms/hooks/useCmsLanguage.js";
import AuthPage from "@cms/components/pages/AuthPage.jsx";
import CmsRouteProgress, {
  CmsPageProgress,
  SuperUserSkeleton,
} from "@cms/components/CmsRouteProgress.jsx";
import { applyBrandColors, BRANDING_UPDATED_EVENT, readBrandColors, readBrandIcon, readBrandLogo, readCompanyNames, watchBrowserBrandFavicon } from "@cms/utils/branding.js";
import { dataSource } from "@/shared/services/data/index.js";
import { hasCmsSessionHint } from "@cms/auth/sessionHint.js";
import { navigateCms } from "@cms/navigation.js";
import { lazyWithSkeletonPreview } from "@/shared/utils/loading.js";

const delayed = (importer) => lazy(() => lazyWithSkeletonPreview(importer));
const DashboardPage = delayed(
  () => import("@cms/components/pages/DashboardPage.jsx"),
);
const HomePage = delayed(() => import("@cms/components/pages/HomePage.jsx"));
const AboutPage = delayed(() => import("@cms/components/pages/AboutPage.jsx"));
const MagazinePage = delayed(
  () => import("@cms/components/pages/MagazinePage.jsx"),
);
const ScholarshipsPage = delayed(
  () => import("@cms/components/pages/ScholarshipsPage.jsx"),
);
const ContactPage = delayed(
  () => import("@cms/components/pages/ContactPage.jsx"),
);
const OpportunitiesPage = delayed(
  () => import("@cms/components/pages/OpportunitiesPage.jsx"),
);
const MessagesPage = delayed(
  () => import("@cms/components/pages/MessagesPage.jsx"),
);
const ProfilePage = delayed(
  () => import("@cms/components/pages/ProfilePage.jsx"),
);
const MediaLibraryPage = delayed(
  () => import("@cms/components/pages/MediaLibraryPage.jsx"),
);
const SettingsPage = delayed(
  () => import("@cms/components/pages/SettingsPage.jsx"),
);

function cmsDocumentTitle(language, companyName) {
  if (language === "en") return `Managing the ${companyName} website`;
  if (language === "ps") return `د ${companyName} وېب‌سایټ مدیریت`;
  return `مدیریت وبسایت ${companyName}`;
}
const SuperUserPage = delayed(
  () => import("@cms/components/pages/SuperUserPage.jsx"),
);

function DashboardLayout() {
  const auth = useAuth();
  const [companyNames, setCompanyNames] = useState(readCompanyNames);
  const isMockDataSource = dataSource.mode === "mock";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () =>
      window.localStorage.getItem("globalvision-cms-sidebar-collapsed") ===
      "true",
  );
  const [theme, setTheme] = useState(
    () => window.localStorage.getItem("globalvision-theme") || "light",
  );
  const [language, setLanguage] = useState(() => {
    const savedLanguage = window.sessionStorage.getItem(
      "globalvision-language",
    );
    return ["prs", "ps", "en"].includes(savedLanguage) ? savedLanguage : "prs";
  });
  useEffect(() => {
    const syncCompanyNames = (event) => {
      setCompanyNames(event.detail?.companyNames || event.detail || readCompanyNames());
      applyBrandColors(readBrandColors());
    };
    const syncStoredCompanyNames = (event) => {
      if (event.key === "globalvision-company-names" || event.key?.startsWith("globalvision-brand-")) syncCompanyNames(event);
    };
    window.addEventListener(BRANDING_UPDATED_EVENT, syncCompanyNames);
    window.addEventListener("storage", syncStoredCompanyNames);
    return () => {
      window.removeEventListener(BRANDING_UPDATED_EVENT, syncCompanyNames);
      window.removeEventListener("storage", syncStoredCompanyNames);
    };
  }, []);
  useEffect(() => {
    applyBrandColors(readBrandColors());
    if (auth.status !== "authenticated") return undefined;
    let active = true;
    dataSource.snapshots.get("settings").then((snapshot) => {
      const colors = snapshot?.payload?.branding;
      if (!active || !colors) return;
      if (colors.primary) window.localStorage.setItem("globalvision-brand-primary", colors.primary);
      if (colors.secondary) window.localStorage.setItem("globalvision-brand-secondary", colors.secondary);
      applyBrandColors(readBrandColors());
    }).catch(() => {});
    return () => { active = false; };
  }, [auth.status]);
  const select = (dari, pashto, english) =>
    language === "en" ? english : language === "ps" ? pashto : dari;
  const content = select(dariContent, pashtoContent, englishContent);
  const messagesContent = select(
    dariMessagesContent,
    pashtoMessagesContent,
    englishMessagesContent,
  );
  const deviceContent = select(
    dariDeviceContent,
    pashtoDeviceContent,
    englishDeviceContent,
  );
  const profileContent = {
    ...select(dariProfileContent, pashtoProfileContent, englishProfileContent),
    ...deviceContent,
  };
  const tourismContent = select(
    dariTourismContent,
    pashtoTourismContent,
    englishTourismContent,
  );
  const homeEditorContent = select(
    dariHomeEditorContent,
    pashtoHomeEditorContent,
    englishHomeEditorContent,
  );
  const aboutEditorContent = select(
    dariAboutEditorContent,
    pashtoAboutEditorContent,
    englishAboutEditorContent,
  );
  const magazineEditorContent = select(
    dariMagazineEditorContent,
    pashtoMagazineEditorContent,
    englishMagazineEditorContent,
  );
  const scholarshipsEditorContent = select(
    dariScholarshipsEditorContent,
    pashtoScholarshipsEditorContent,
    englishScholarshipsEditorContent,
  );
  const contactEditorContent = select(
    dariContactEditorContent,
    pashtoContactEditorContent,
    englishContactEditorContent,
  );
  const opportunitiesContent = select(
    dariOpportunitiesContent,
    pashtoOpportunitiesContent,
    englishOpportunitiesContent,
  );
  const guidesContent = select(
    dariGuidesContent,
    pashtoGuidesContent,
    englishGuidesContent,
  );
  const servicesContent = select(
    dariServicesContent,
    pashtoServicesContent,
    englishServicesContent,
  );
  const mediaContent = select(
    dariMediaContent,
    pashtoMediaContent,
    englishMediaContent,
  );
  const settingsContent = select(
    dariSettingsContent,
    pashtoSettingsContent,
    englishSettingsContent,
  );
  const companyName = companyNames[language];
  const brandIcon = readBrandIcon(theme);
  const brandLogo = readBrandLogo(theme);
  const lightFavicon = readBrandIcon("light");
  const darkFavicon = readBrandIcon("dark");
  const canManageMessages =
    auth.status === "authenticated" &&
    auth.can(CMS_PERMISSIONS.MANAGE_MESSAGES);
  const messageState = useMessages(canManageMessages);
  const serviceSources = {
    prs: dariServicesContent.services,
    ps: pashtoServicesContent.services,
    en: englishServicesContent.services,
  };
  const opportunitySources = {
    prs: dariOpportunitiesContent,
    ps: pashtoOpportunitiesContent,
    en: englishOpportunitiesContent,
  };
  const localizedOpportunities = Object.fromEntries(
    Object.entries(opportunitiesContent).map(([type, section]) => [
      type,
      !section?.post
        ? section
        : {
            ...section,
            post: {
              ...section.post,
              translations: Object.fromEntries(
                Object.entries(opportunitySources).map(([locale, source]) => {
                  const localized = source[type]?.post || {};
                  return [
                    locale,
                    {
                      title: localized.title || localized.category || "",
                      excerpt: localized.description || "",
                      content: localized.content || "",
                      tags: localized.tags || [],
                      seoTitle: localized.seoTitle || localized.title || "",
                      metaDescription:
                        localized.metaDescription ||
                        localized.description ||
                        "",
                      imageAlt: localized.imageAlt || "",
                    },
                  ];
                }),
              ),
            },
          },
    ]),
  );
  const localizedServices = servicesContent.services.map((service) => ({
    ...service,
    translations: Object.fromEntries(
      Object.entries(serviceSources).map(([locale, records]) => {
        const localized =
          records.find((record) => record.slug === service.slug) || {};
        return [
          locale,
          {
            title: localized.title || "",
            excerpt: localized.description || "",
            content: localized.content || "",
            audience: localized.audience || "",
            included: localized.included || [],
            process: localized.process || [],
            prepare: localized.prepare || [],
            tags: localized.tags || [],
            seoTitle: localized.seoTitle || localized.title || "",
            metaDescription:
              localized.metaDescription || localized.description || "",
            imageAlt: localized.imageAlt || "",
          },
        ];
      }),
    ),
  }));
  const counts = {
    posts: dariMagazineContent.news.items.length,
    scholarships: dariScholarshipsContent.items.length,
    countries: dariGuidesContent.countries.length,
    services: dariServicesContent.services.length,
    guides: dariGuidesContent.countries.length + dariGuidesContent.exams.length,
    messages: messageState.records.length,
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.dataset.application = "cms";
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.documentElement.dir = language === "en" ? "ltr" : "rtl";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0a1019" : "#edf1f6");
    document.title = cmsDocumentTitle(language, companyName);
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow, noarchive";
    window.localStorage.setItem("globalvision-theme", theme);
    window.sessionStorage.setItem("globalvision-language", language);
  }, [companyName, language, theme]);

  useEffect(() => watchBrowserBrandFavicon(lightFavicon, darkFavicon), [darkFavicon, lightFavicon]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (auth.status !== "authenticated" || isMockDataSource) return;
    const isAuthenticationPath = [
      "/dashboard/login",
      "/dashboard/forgot-password",
      "/dashboard/reset-password",
    ].includes(window.location.pathname);
    if (
      auth.session.user.role === "super_user" &&
      window.location.pathname !== "/dashboard/super"
    )
      navigateCms("/dashboard/super", { replace: true });
    else if (auth.session.user.role !== "super_user" && isAuthenticationPath)
      navigateCms("/dashboard", { replace: true });
  }, [auth.session, auth.status, isMockDataSource]);

  useEffect(() => {
    const pathname = window.location.pathname;
    const isAuthenticationPath = [
      "/dashboard/login",
      "/dashboard/forgot-password",
      "/dashboard/reset-password",
    ].includes(pathname);

    if (auth.status !== "unauthenticated" || isAuthenticationPath || !isCmsPath(pathname)) return;

    const destination = `${pathname}${window.location.search}${window.location.hash}`;
    navigateCms(`/dashboard/login?redirect=${encodeURIComponent(destination)}`, { replace: true });
  }, [auth.status]);

  const toggleSidebar = () =>
    setSidebarCollapsed((current) => {
      window.localStorage.setItem(
        "globalvision-cms-sidebar-collapsed",
        String(!current),
      );
      return !current;
    });
  const authPath = [
    "/dashboard/login",
    "/dashboard/forgot-password",
    "/dashboard/reset-password",
  ].includes(window.location.pathname);
  const routeKey =
    authPath && auth.status === "authenticated"
      ? "overview"
      : getCmsRouteKey(window.location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [routeKey]);

  if (auth.status === "loading") {
    return (
      <div
        className="cms-root"
        data-theme={theme}
        dir={language === "en" ? "ltr" : "rtl"}
      >
        <CmsRouteProgress authenticationPending={!authPath && !hasCmsSessionHint()} standalone={!authPath && hasCmsSessionHint()} />
      </div>
    );
  }

  if (auth.status === "unauthenticated" && !authPath) {
    return <div className="cms-root" data-theme={theme}><CmsRouteProgress authenticationPending /></div>;
  }

  const routePages = {
    overview: <DashboardPage content={content} counts={counts} />,
    home: (
      <HomePage
        key={language}
        content={homeEditorContent}
        initialTranslations={{
          prs: dariHomeContent,
          ps: pashtoHomeContent,
          en: englishHomeContent,
        }}
        interfaceLanguage={language}
      />
    ),
    about: (
      <AboutPage
        key={language}
        content={aboutEditorContent}
        initialTranslations={{
          prs: dariAboutContent,
          ps: pashtoAboutContent,
          en: englishAboutContent,
        }}
      />
    ),
    contact: (
      <ContactPage
        key={language}
        content={contactEditorContent}
        initialTranslations={{
          prs: dariContactContent,
          ps: pashtoContactContent,
          en: englishContactContent,
        }}
      />
    ),
    magazine: (
      <MagazinePage
        key={language}
        content={magazineEditorContent}
        initialTranslations={{
          prs: dariMagazineContent,
          ps: pashtoMagazineContent,
          en: englishMagazineContent,
        }}
      />
    ),
    scholarships: (
      <ScholarshipsPage
        key={language}
        content={scholarshipsEditorContent}
        initialTranslations={{
          prs: dariScholarshipsContent,
          ps: pashtoScholarshipsContent,
          en: englishScholarshipsContent,
        }}
      />
    ),
    opportunities: (
      <OpportunitiesPage
        key={language}
        content={content}
        opportunities={localizedOpportunities}
        exams={guidesContent.exams}
      />
    ),
    tourism: (
      <OpportunitiesPage
        key={language}
        content={content}
        tourism={tourismContent}
      />
    ),
    services: (
      <OpportunitiesPage
        key={language}
        content={content}
        services={localizedServices}
        serviceUi={{
          prs: dariServicesContent.ui,
          ps: pashtoServicesContent.ui,
          en: englishServicesContent.ui,
        }}
      />
    ),
    messages: (
      <MessagesPage
        content={{ ...messagesContent, dashboard: content.overview }}
        language={language}
        messageState={messageState}
      />
    ),
    media: <MediaLibraryPage key={language} content={mediaContent} />,
    settings: (
      <SettingsPage
        key={language}
        content={settingsContent}
        language={language}
      />
    ),
    profile: <ProfilePage content={profileContent} brandIcon={brandIcon} />,
  };
  const accessLabels = content.auth || {};
  if (auth.status === "unauthenticated" || (isMockDataSource && authPath))
    return (
      <div
        className="cms-root"
        data-theme={theme}
        dir={language === "en" ? "ltr" : "rtl"}
      >
        <AuthPage
          key={window.location.pathname}
          auth={auth}
          content={accessLabels}
          language={language}
          theme={theme}
          companyName={companyName}
          brandIcon={brandIcon}
          themeLabel={content.topbar?.theme}
          onThemeToggle={() => setTheme((current) => current === "light" ? "dark" : "light")}
          onLanguageChange={setLanguage}
        />
      </div>
    );
  if (
    auth.status === "authenticated" &&
    auth.session.user.role === "super_user"
  )
    return (
      <Suspense
        fallback={
          <div className="cms-root">
            <SuperUserSkeleton />
          </div>
        }
      >
        <SuperUserPage auth={auth} content={content} language={language} theme={theme} logo={brandLogo} onThemeToggle={() => setTheme((current) => current === "light" ? "dark" : "light")} onLanguageChange={setLanguage} />
      </Suspense>
    );

  const activePage =
    auth.status === "error" ? (
      <CmsAccessState
        title={accessLabels.error || "The account could not be loaded."}
        action={accessLabels.retry || "Retry"}
        onAction={auth.retry}
      />
    ) : !canAccessCmsRoute(auth.session, routeKey) ? (
      <CmsAccessState
        title={accessLabels.forbidden || "You do not have access to this page."}
      />
    ) : (
      routePages[routeKey] || (
        <PlaceholderPage
          content={content}
          pageKey={window.location.pathname.split("/")[2]}
        />
      )
    );
  const canAccess = (key) => canAccessCmsRoute(auth.session, key);

  return (
    <CmsLanguageProvider language={language}>
      <DeleteConfirmation>
        <div
          className="cms-root min-h-screen w-full max-w-full overflow-x-clip"
          data-theme={theme}
          data-dashboard-shell="true"
          data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}
          dir={language === "en" ? "ltr" : "rtl"}
        >
          <ToastViewport theme={theme} language={language} />
          <a
            href="#dashboard-content"
            className="fixed inset-s-3 top-3 z-70 -translate-y-20 rounded-xl bg-admin-heading px-4 py-3 text-white transition-transform focus:translate-y-0"
          >
            {content.overview}
          </a>
          <DashboardSidebar
            content={content}
            companyName={companyName}
            theme={theme}
            brandIcon={brandIcon}
            open={sidebarOpen}
            collapsed={sidebarCollapsed}
            canAccess={canAccess}
            onCollapseToggle={toggleSidebar}
            onClose={() => setSidebarOpen(false)}
            onLogout={auth.logout}
          />
          <div
          className={`admin-shell min-h-screen min-w-0 max-w-full transition-[padding] duration-300 ease-in-out rtl:lg:pr-(--sidebar-width) ltr:lg:pl-(--sidebar-width) ${sidebarCollapsed ? "rtl:lg:pr-16 ltr:lg:pl-16" : ""}`}
          >
            <DashboardTopbar
              content={content.topbar}
              searchItems={content.groups.flatMap((group) => group.items)}
              language={language}
              theme={theme}
              brandIcon={brandIcon}
              unreadCount={messageState.unreadCount}
              canAccessMessages={canManageMessages}
              onMenuOpen={() => setSidebarOpen(true)}
              onThemeToggle={() =>
                setTheme((current) => (current === "light" ? "dark" : "light"))
              }
              onLanguageChange={setLanguage}
            />
            <main
              id="dashboard-content"
              className="min-h-[calc(100vh-5rem)] px-4 pt-3 pb-28 sm:px-8 sm:pt-4"
            >
              <Suspense key={routeKey} fallback={<CmsPageProgress routeKey={routeKey} />}>
                {activePage}
              </Suspense>
            </main>
            <UnsavedChangesBar
              key={routeKey}
              language={language}
              sidebarCollapsed={sidebarCollapsed}
            />
          </div>
        </div>
      </DeleteConfirmation>
    </CmsLanguageProvider>
  );
}

function CmsAccessState({ title, action, onAction }) {
  return (
    <section className="grid min-h-96 place-items-center rounded-2xl border border-admin-border bg-admin-card p-6 text-center">
      <div>
        <h1 className="font-heading text-lg text-admin-heading">{title}</h1>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 min-h-10 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white"
          >
            {action}
          </button>
        )}
      </div>
    </section>
  );
}

export default DashboardLayout;
