const getArtworkUrl = (originalUrl, width, height) => {
  const replace = {
    '{w}': width,
    '{h}': height
  };

  return originalUrl.replace(/{w}|{h}/gi, matched => replace[matched]);
};

// eslint-disable-next-line
export { getArtworkUrl };
