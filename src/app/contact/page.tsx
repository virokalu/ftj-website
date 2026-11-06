import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { AccentDivider } from "@/components/ui/accent-divider";
import { RequestCallSection } from "@/components/contact/request-call-section";
import { Parallax } from "@/components/animations/parallax";
import { Stagger, StaggerItem } from "@/components/animations/stagger";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.fullName} — ${siteConfig.addressLocality}, ${siteConfig.addressCountry}.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [th, ti, tf] = await Promise.all([
    getTranslations("contact.hero"),
    getTranslations("contact.info"),
    getTranslations("contact.form"),
  ]);

  return (
    <>
      <section className="relative flex h-[60vh] min-h-[420px] items-end overflow-hidden bg-ink pt-20">
        <Parallax className="absolute inset-0" start="top top" amount={15}>
          <div className="absolute inset-0 animate-ken-burns">
            <Image
              src="/images/office/hq-tower.jpg"
              alt="FTJ Exports headquarters, a modern glass office tower against a blue sky"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Parallax>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10"
        />

        <Container className="relative pb-14 sm:pb-20">
          <h1
            className="animate-fade-up max-w-2xl text-2xl font-semibold tracking-[0.08em] text-foreground uppercase text-balance sm:text-3xl lg:text-4xl"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
          >
            {th("heading")}
          </h1>
          <p
            className="animate-fade-up mt-4 max-w-xl text-lg font-medium tracking-[0.06em] text-foreground-muted uppercase [animation-delay:150ms] sm:text-xl"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {th("address")}
          </p>
        </Container>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <Container>
          <Stagger className="grid gap-10 sm:grid-cols-2 sm:gap-16">
            <StaggerItem>
              <h2 className="text-xs font-semibold tracking-[0.15em] text-foreground-muted uppercase">
                {ti("phoneLabel")}
              </h2>
              <p className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">{siteConfig.phone}</p>
            </StaggerItem>
            <StaggerItem>
              <h2 className="text-xs font-semibold tracking-[0.15em] text-foreground-muted uppercase">
                {ti("emailLabel")}
              </h2>
              <p className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl">{siteConfig.email}</p>
            </StaggerItem>
          </Stagger>

          <p className="mt-10 max-w-2xl text-xs leading-relaxed tracking-wide text-foreground-muted uppercase">
            {ti("hours")}
          </p>

          <div className="mt-12">
            <Suspense fallback={<GetInTouchFallback label={ti("getInTouch")} />}>
              <RequestCallSection
                triggerLabel={ti("getInTouch")}
                labels={{
                  heading: tf("heading"),
                  close: tf("close"),
                  name: tf("name"),
                  email: tf("email"),
                  phone: tf("phone"),
                  country: tf("country"),
                  message: tf("message"),
                  website: tf("website"),
                  submit: tf("submit"),
                  privacyNotice: tf("privacyNotice"),
                  privacyLink: tf("privacyLink"),
                  errors: {
                    required: tf("errors.required"),
                    invalidEmail: tf("errors.invalidEmail"),
                    invalidPhone: tf("errors.invalidPhone"),
                    tooShort: tf("errors.tooShort"),
                    tooLong: tf("errors.tooLong"),
                  },
                  states: {
                    submitting: tf("states.submitting"),
                    success: tf("states.success"),
                    generalError: tf("states.generalError"),
                    networkError: tf("states.networkError"),
                  },
                }}
              />
            </Suspense>
          </div>

          <AccentDivider className="mt-16" />
        </Container>
      </section>
    </>
  );
}

function GetInTouchFallback({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-4 text-sm font-semibold tracking-[0.2em] text-foreground-muted uppercase">
      {label}
      <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full border border-accent text-accent">
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
          <path
            d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </span>
  );
}
