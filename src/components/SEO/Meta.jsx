import Head from "next/head";
const Meta = ({ title, description, keywords, ogImage, pathName, schema }) => {
  return (
    <Head>
      {/* title */}
      <title key="title">{process.env.NEXT_PUBLIC_META_TITLE}</title>
      {/*<!-- Google / Search Engine Tags -->*/}
      <meta
        name="name"
        content={title ? title : process.env.NEXT_PUBLIC_META_TITLE}
        key="name"
      />
      <meta
        name="description"
        content={
          description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION
        }
        key="desc"
      />
      <meta
        name="keywords"
        content={keywords ? keywords : process.env.NEXT_PUBLIC_KEYWORDS}
        key="keywords"
      />
      <meta name="image" content={ogImage ? ogImage : null} key="image" />
      {/*<!-- Facebook Meta Tags -->*/}
      <meta property="og:title" content={process.env.NEXT_PUBLIC_META_TITLE} key="ogtitle" />
      <meta
        property="og:description"
        content={
          description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION
        }
        key="ogdesc"
      />
      <meta property="og:image" content={ogImage ? ogImage : null} key="ogimage" />
      <meta property="og:image:type" content="image/jpg" key="ogimagetype" />
      <meta property="og:image:width" content="1080" key="ogimagewidth" />
      <meta property="og:image:height" content="608" key="ogimageheight" />
      <meta
        property="og:url"
        content={pathName ? pathName : process.env.NEXT_PUBLIC_APP_WEB_URL}
        key="ogurl"
      />
      <meta property="og:type" content="website" key="ogtype" />
      {/*<!-- Twitter Meta Tags -->*/}
      <meta name="twitter:title" content={process.env.NEXT_PUBLIC_META_TITLE} key="twittertitle" />
      <meta
        name="twitter:description"
        content={
          description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION
        }
        key="twitterdesc"
      />
      <meta name="twitter:image" content={ogImage ? ogImage : null} />
      <meta name="twitter:card" content="summary_large_image" />
      {/* robot and cononical */}
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_APP_WEB_URL}`} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="robots"
        content="index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large"
      />
      {/* schemas */}
      {schema && (
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
};
export default Meta;
