import { useEffect, useState } from "react";
import {
  KeyRound,
  Laptop,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import ContentLanguageSwitcher from "@cms/components/ContentLanguageSwitcher.jsx";
import PageHeading from "@cms/components/PageHeading.jsx";
import PasswordInput from "@cms/components/PasswordInput.jsx";
import useAuth from "@cms/auth/useAuth.js";
import useCmsDraftState from "@cms/hooks/useCmsDraftState.js";
import {
  useCmsContentLanguage,
  useCmsInterfaceLanguage,
} from "@cms/hooks/useCmsLanguage.js";
import { announceCmsDraftChange } from "@cms/utils/draftEvents.js";
import useModalFocus from "@/shared/hooks/useModalFocus.js";
import { validatePasswordChange } from "@/shared/utils/validation.js";
import { BRANDING_UPDATED_EVENT, readBrandIcon, readCompanyNames } from "@cms/utils/branding.js";

function ProfilePage({ content, theme }) {
  const resetAction =
    content.resetAction ||
    (content.resetPassword?.startsWith("Password")
      ? "Reset"
      : content.resetPassword?.startsWith("پټنوم")
        ? "بیا تنظیم"
        : "بازنشانی");
  const resetLabel = content.resetPassword?.startsWith("Password")
    ? "Reset password"
    : content.resetPassword?.startsWith("پټنوم")
      ? "د پټنوم بیا تنظیم"
      : "بازنشانی رمز عبور";
  const auth = useAuth();
  const { refreshSession } = auth;
  useEffect(() => {
    const refreshAccount = () => refreshSession().catch(() => {});
    const refreshVisibleAccount = () => {
      if (document.visibilityState === "visible") refreshAccount();
    };
    refreshAccount();
    window.addEventListener("focus", refreshAccount);
    document.addEventListener("visibilitychange", refreshVisibleAccount);
    return () => {
      window.removeEventListener("focus", refreshAccount);
      document.removeEventListener("visibilitychange", refreshVisibleAccount);
    };
  }, [refreshSession]);
  const [contentLanguage, setContentLanguage] = useCmsContentLanguage();
  const interfaceLanguage = useCmsInterfaceLanguage();
  const [companyNames, setCompanyNames] = useCmsDraftState(
    "profile",
    readCompanyNames,
  );
  const [profileImage, setProfileImage] = useState(
    () => window.localStorage.getItem("globalvision-profile-image") || "",
  );
  const [modal, setModal] = useState(null);
  useEffect(() => {
    const save = () => {
      window.localStorage.setItem(
        "globalvision-company-names",
        JSON.stringify(companyNames),
      );
      window.dispatchEvent(new CustomEvent(BRANDING_UPDATED_EVENT, { detail: companyNames }));
      if (profileImage)
        window.localStorage.setItem("globalvision-profile-image", profileImage);
      else window.localStorage.removeItem("globalvision-profile-image");
    };
    window.addEventListener("cms:changes-saved", save);
    return () => window.removeEventListener("cms:changes-saved", save);
  }, [companyNames, profileImage]);
  const companyName = companyNames[contentLanguage];
  const defaultProfileImage = readBrandIcon(theme);
  const card =
    "profile-card overflow-hidden rounded-2xl border border-admin-border bg-admin-card shadow-[0_1px_2px_rgb(15_23_42_/.04),0_12px_34px_rgb(15_23_42_/.055)]";
  const heading =
    "flex flex-wrap items-center justify-between gap-4 border-b border-admin-border bg-[linear-gradient(100deg,var(--editor-field),var(--admin-card))] px-[1.2rem] py-4 max-[700px]:flex-row max-[700px]:items-center [&>div:first-child>span:first-child]:hidden";
  const input =
    "mt-[.55rem] min-h-[2.5rem] w-full rounded-[.72rem] border border-(--editor-field-border) bg-(--editor-input) px-[.9rem] py-[.4rem] text-[.875rem] font-normal text-admin-heading shadow-[inset_0_1px_2px_rgb(15_23_42_/.035)] outline-none transition focus:border focus:border-admin-brand";
  return (
    <div className="mx-auto grid w-full max-w-312 gap-4 pb-16 sm:gap-[1.65rem]">
      <PageHeading
        className="min-h-0! px-0! pt-0! pb-3!"
        breadcrumbs={[{ label: content.dashboard }, { label: content.title }]}
      />
      <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(17rem,.65fr)] items-start gap-4 max-[700px]:grid-cols-1">
        <form
          className="grid gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <section className={card}>
            <div className={heading}>
              <div className="max-[700px]:order-1 max-[700px]:flex-1">
                <span className="text-[.625rem] font-semibold tracking-[.12em] text-admin-brand-text">
                  {content.company}
                </span>
                <h2 className="mt-[.2rem] mb-0 font-heading text-[.98rem] text-admin-heading">
                  {content.about}
                </h2>
              </div>
              <div className="flex items-center gap-3 max-[700px]:contents">
                <span className="max-[700px]:order-3 max-[700px]:basis-full max-[700px]:pt-2">
                  <ContentLanguageSwitcher
                    label={
                      content.language ||
                      (interfaceLanguage === "en"
                        ? "Content language"
                        : interfaceLanguage === "ps"
                          ? "د منځپانګې ژبه"
                          : "زبان محتوا")
                    }
                    value={contentLanguage}
                    onChange={setContentLanguage}
                  />
                </span>
                <span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text max-[700px]:order-2">
                  <ShieldCheck size={19} />
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[1.3rem] p-5 max-[700px]:grid-cols-1">
              <label className="col-span-full text-[.8125rem] font-semibold text-admin-heading max-[700px]:col-auto">
                <span>{content.companyNameLabel}</span>
                <input
                  dir={contentLanguage === "en" ? "ltr" : "rtl"}
                  className={`${input} ${contentLanguage === "en" ? "text-left" : "text-right"}`}
                  value={companyName}
                  onChange={(event) => {
                    setCompanyNames((current) => ({
                      ...current,
                      [contentLanguage]: event.target.value,
                    }));
                  }}
                />
              </label>
              <label className="text-[.8125rem] font-semibold text-admin-heading">
                <span>{content.email}</span>
                <input
                  className={`${input} min-w-0 cursor-not-allowed opacity-75`}
                  value={auth.session.user.email}
                  readOnly
                  disabled
                />
              </label>
              <label className="text-[.8125rem] font-semibold text-admin-heading">
                <span>{content.roleLabel}</span>
                <input
                  className={`${input} cursor-not-allowed opacity-75`}
                  value={content.role}
                  readOnly
                  disabled
                />
              </label>
            </div>
          </section>
          <section className={card}>
            <div className={heading}>
              <div>
                <span className="text-[.625rem] font-semibold tracking-[.12em] text-admin-brand-text">
                  {content.security}
                </span>
                <h2 className="mt-[.2rem] mb-0 font-heading text-[.98rem] text-admin-heading">
                  {content.passwordSettings}
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text">
                <KeyRound size={19} />
              </span>
            </div>
            <div className="grid gap-[.8rem] p-[1.15rem]">
              <SecurityRow
                icon={ShieldCheck}
                title={content.changePassword}
                action={content.change}
                onClick={() => setModal("password")}
              />
              <SecurityRow
                icon={KeyRound}
                title={resetLabel}
                action={resetAction}
                onClick={() => setModal("reset")}
              />
            </div>
          </section>
        </form>
        <aside className="grid gap-4">
          <section className={`${card} p-[1.3rem] text-center`}>
            <div className="relative mx-auto mb-[.8rem] w-fit">
              <img
                className="block size-14 rounded-2xl border border-admin-border object-contain shadow-[0_8px_20px_rgb(15_23_42_/.12)]"
                src={profileImage || defaultProfileImage}
                alt="Global Vision"
              />
              {profileImage && (
                <button
                  type="button"
                  aria-label={content.delete || "حذف تصویر"}
                  onClick={() => {
                    setProfileImage("");
                    announceCmsDraftChange();
                  }}
                  className="absolute -bottom-2 -left-2 grid size-7 place-items-center rounded-lg border-2 border-admin-card bg-red-600 text-white transition hover:bg-red-700"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <h2 className="font-heading text-[.98rem] text-admin-heading">
              {content.overview}
            </h2>
            <dl className="mt-[1.1rem] grid text-right">
              <Info label={content.roleLabel} value={content.role} />
              <Info label={content.memberSince} value="2026" />
              <Info label={content.status} value={content.active} />
            </dl>
          </section>
          <section className={card}>
            <div className="flex items-start justify-between px-[1.1rem] py-4">
              <div>
                <h2 className="m-0 font-heading text-[.98rem] text-admin-heading">
                  {content.sessions}
                </h2>
              </div>
              <span className="grid size-[1.55rem] place-items-center rounded-lg bg-admin-brand-soft text-[.6875rem] font-semibold text-admin-brand-text">
                1
              </span>
            </div>
            <div className="border-t border-admin-border px-4 py-[.85rem]">
              <div className="flex items-center gap-[.65rem]">
                <span className="grid size-[2.2rem] place-items-center rounded-[.65rem] border border-admin-border bg-admin-control-soft text-admin-muted">
                  <Laptop size={18} />
                </span>
                <div className="grid flex-1 gap-[.15rem]">
                  <strong className="text-[.75rem] text-admin-heading">
                    {content.deviceName}
                  </strong>
                  <small className="text-[.6875rem] leading-[1.45] text-admin-muted">
                    {content.currentDevice}
                    <br />
                    {content.location}
                  </small>
                </div>
                <i className="size-2 rounded-full bg-[#22a06b] shadow-[0_0_0_4px_rgb(34_160_107_/.12)]" />
              </div>
            </div>
          </section>
          <section
            className={`${card} flex items-center justify-start gap-3 px-[1.1rem] py-4 text-end rtl:justify-start ltr:justify-start`}
          >
            <span className="grid size-9 flex-none place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text">
              <KeyRound size={17} />
            </span>
            <div>
              <h2 className="m-0 font-heading text-[.98rem] font-normal! text-admin-heading">
                {content.latestPassword}
              </h2>
            </div>
          </section>
        </aside>
      </div>
      {modal && (
        <ProfileModal
          mode={modal}
          content={content}
          email={auth.session.user.email}
          onChangePassword={auth.changePassword}
          onResetPassword={auth.forgotPassword}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function SecurityRow({ icon: Icon, title, action, onClick }) {
  return (
    <div className="flex items-center gap-[.8rem] rounded-[.82rem] border border-admin-border bg-(--editor-field) px-4 py-[.55rem] max-[700px]:flex-wrap">
      <span className="grid size-8 flex-none place-items-center rounded-[.65rem] bg-admin-brand-soft text-admin-brand-text">
        <Icon size={16} />
      </span>
      <span className="grid flex-1 gap-[.2rem]">
        <strong className="text-[.75rem] text-admin-heading">{title}</strong>
      </span>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-8 items-center justify-center rounded-[.55rem] border border-admin-border bg-admin-control px-[.7rem] py-1 text-[.6875rem] font-semibold text-admin-muted hover:border-admin-brand hover:text-admin-brand-text"
      >
        {action}
      </button>
    </div>
  );
}
function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between border-t border-admin-border py-3">
      <dt className="text-[.6875rem] text-admin-muted">{label}</dt>
      <dd className="m-0 text-[.6875rem] font-semibold text-admin-heading">
        {value}
      </dd>
    </div>
  );
}
function ProfileModal({
  mode,
  content,
  email,
  onChangePassword,
  onResetPassword,
  onClose,
}) {
  const resetLabel = content.resetPassword?.startsWith("Password")
    ? "Reset password"
    : content.resetPassword?.startsWith("پټنوم")
      ? "د پټنوم بیا تنظیم"
      : "بازنشانی رمز عبور";
  const [closing, setClosing] = useState(false);
  const [values, setValues] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 200);
  };
  const dialogRef = useModalFocus({ onClose: close });

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.classList.add("cms-modal-open");
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.documentElement.classList.remove("cms-modal-open");
    };
  }, []);

  return (
    <div
      className={`cms-modal-backdrop fixed inset-0 z-[140] isolate grid place-items-center p-4 ${closing ? "animate-cms-modal-backdrop-out" : "animate-cms-modal-backdrop-in"}`}
      onClick={close}
    >
      <section
        ref={dialogRef}
        data-cms-draft-ignore
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-dialog-title"
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-[1.15rem] border border-admin-border bg-admin-card shadow-[0_30px_90px_rgb(5_10_20_/.35)] ${closing ? "animate-cms-modal-panel-out" : "animate-cms-modal-panel-in"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center gap-3 border-b border-admin-border p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-admin-brand-soft text-admin-brand-text">
            {mode === "reset" ? <KeyRound size={19} /> : <Mail size={19} />}
          </span>
          <div className="flex flex-1 items-center">
            <h2
              id="profile-dialog-title"
              className="m-0 font-heading text-base text-admin-heading"
            >
              {mode === "reset" ? resetLabel : content.changePassword}
            </h2>
          </div>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-admin-border text-admin-muted transition hover:border-admin-brand hover:bg-admin-control-soft hover:text-admin-heading focus-visible:border-admin-brand focus-visible:shadow-[0_0_0_2px_rgb(245_155_34_/.2)]"
            onClick={close}
            aria-label={content.close}
          >
            <X size={18} />
          </button>
        </header>
        {complete ? (
          <div className="grid justify-items-center gap-3 p-7 text-center">
            <ShieldCheck className="text-emerald-600" size={32} />
            <h3 className="font-heading text-base text-admin-heading">
              {content.resetSentTitle || resetLabel}
            </h3>
            <p className="text-xs leading-5 text-admin-muted">
              {content.resetSentDescription || content.resetPasswordDescription}
            </p>
            <strong className="text-xs text-admin-heading" dir="ltr">
              {email}
            </strong>
            <button
              type="button"
              className="min-h-10 rounded-xl bg-admin-brand px-5 text-xs font-semibold text-white"
              onClick={close}
            >
              {content.done}
            </button>
          </div>
        ) : (
          <form
            className="grid gap-4 p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              setValidationError("");
              setSubmitting(true);
              try {
                if (mode === "reset") {
                  await onResetPassword({ email });
                  setComplete(true);
                } else {
                  const result = validatePasswordChange(values);
                  if (!result.valid) {
                    setValidationError(content.passwordValidation);
                    return;
                  }
                  await onChangePassword(values);
                  close();
                }
              } catch (error) {
                setValidationError(
                  error?.message || content.passwordValidation,
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {mode === "reset" ? (
              <div className="rounded-xl border border-admin-border bg-admin-control-soft p-4 text-xs leading-6 text-admin-muted">
                {content.resetPasswordDescription}
                <strong className="mt-2 block text-admin-heading" dir="ltr">
                  {email}
                </strong>
              </div>
            ) : (
              <>
                <label className="text-[.8125rem] font-semibold text-admin-heading">
                  <span>{content.currentPassword}</span>
                  <PasswordInput
                    className={inputClass}
                    name="currentPassword"
                    autoComplete="current-password"
                    showLabel={content.showPassword}
                    hideLabel={content.hidePassword}
                    value={values.currentPassword}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        currentPassword: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <label className="text-[.8125rem] font-semibold text-admin-heading">
                  <span>{content.password}</span>
                  <PasswordInput
                    className={inputClass}
                    name="password"
                    autoComplete="new-password"
                    showLabel={content.showPassword}
                    hideLabel={content.hidePassword}
                    value={values.password}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    minLength={12}
                    required
                  />
                </label>
                <label className="text-[.8125rem] font-semibold text-admin-heading">
                  <span>{content.confirmPassword}</span>
                  <PasswordInput
                    className={inputClass}
                    name="confirmPassword"
                    autoComplete="new-password"
                    showLabel={content.showPassword}
                    hideLabel={content.hidePassword}
                    value={values.confirmPassword}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                    minLength={12}
                    required
                  />
                </label>
              </>
            )}
            {validationError && (
              <p
                role="alert"
                className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-300"
              >
                {validationError}
              </p>
            )}
            <footer className="flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex min-h-9 items-center justify-center rounded-[.55rem] border border-admin-border bg-admin-control px-[.7rem] text-[.6875rem] font-semibold text-admin-muted"
                onClick={close}
              >
                {content.cancel}
              </button>
              <button
                disabled={submitting}
                className="inline-flex min-h-9 items-center justify-center gap-2 rounded-[.55rem] border border-admin-brand bg-admin-brand px-[.7rem] text-[.6875rem] font-semibold text-white disabled:cursor-wait disabled:opacity-70"
              >
                <Save size={14} />
                {mode === "reset" ? resetLabel : content.save}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}
const inputClass =
  "mt-[.55rem] min-h-11 w-full rounded-[.72rem] border border-(--editor-field-border) bg-(--editor-input) px-[.9rem] py-0 text-[.875rem] font-normal text-admin-heading outline-none transition focus:border focus:border-admin-brand";

export default ProfilePage;
