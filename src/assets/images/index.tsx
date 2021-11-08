function importAll(r: __WebpackModuleApi.RequireContext) {
  let images: any = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

export const images = importAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);
