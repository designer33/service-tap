import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, ogImage, noIndex }) => {
  const siteName = 'Service Knock';
  const defaultImage = 'https://serviceknock.com/hero.jpg';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} — Book Trusted Home Services in Pakistan`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={`https://serviceknock.com${canonical}`} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:image" content={ogImage || defaultImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      {canonical && <meta property="og:url" content={`https://serviceknock.com${canonical}`} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage || defaultImage} />
    </Helmet>
  );
};

export default SEO;
