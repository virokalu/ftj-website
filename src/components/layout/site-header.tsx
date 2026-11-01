import { getTranslations } from "next-intl/server";
import { SiteNav } from "@/components/layout/site-nav";

export async function SiteHeader() {
  const t = await getTranslations("nav");

  const items = [
    { href: "/", label: t("home") },
    { href: "/inventory", label: t("inventory") },
    { href: "/contact", label: t("contact") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
  ];

  return <SiteNav items={items} loginLabel={t("login")} menuLabel={t("menu")} closeLabel={t("close")} />;
}
