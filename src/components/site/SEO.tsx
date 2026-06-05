import { Helmet } from "react-helmet-async";
import { BRAND } from "@/lib/brand";

type Props = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
};

export function SEO({ title, description, path = "/", image }: Props) {
  const fullTitle = `${title} | ${BRAND.name}`;
  const desc = description ?? BRAND.tagline;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={path} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={path} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}