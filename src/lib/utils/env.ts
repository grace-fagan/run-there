export const getServerUrl = (env: ImportMetaEnv): string => {
  if (!env.MODE || !env.VITE_DEV_SERVER || !env.VITE_PROD_SERVER)
    throw new Error(`env missing properties for server url`);
  const url = window.location.href;
  if (url.includes('localhost')) return env.VITE_DEV_SERVER;
  else return env.VITE_PROD_SERVER;
};

export const getDataPath = () => {
  if (process.env.NODE_ENV === 'development') {
    return `/public/data`;
  } else return `/data`;
};
