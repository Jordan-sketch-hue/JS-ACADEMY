import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getIntakeFormByToken,
  publicFormPayload,
} from "@/lib/data/intake-forms";
import { PublicIntakeForm } from "@/components/intake/public-intake-form";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ client?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const form = await getIntakeFormByToken(token);
  if (!form) return { title: "Intake" };

  const title = `${form.title} | J Supreme Tech Intake`;
  const description =
    form.intro?.trim() ||
    "Share your project details securely with J Supreme Tech so we can prepare the right digital system, website, app, automation, or CRM plan.";
  const url = `/intake/${token}`;
  const image = `/intake/${token}/opengraph-image`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "J Supreme Tech",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "J Supreme Tech secure project intake preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PublicIntakePage({ params, searchParams }: Props) {
  const { token } = await params;
  const sp = await searchParams;
  const rawClient = sp.client?.trim();
  const referredClientId =
    rawClient &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      rawClient,
    )
      ? rawClient
      : undefined;

  const form = await getIntakeFormByToken(token);
  if (!form) notFound();
  return (
    <PublicIntakeForm
      shareToken={token}
      initial={publicFormPayload(form)}
      referredClientId={referredClientId}
    />
  );
}
