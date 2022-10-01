export const selectThumb = (
  thumbnails: {
    url: string;
    width: number;
    height: number;
  }[],
  preferredHeight: number,
) => {
  const {url} = thumbnails.sort(
    (a, b) =>
      Math.abs(a.height - preferredHeight) -
      Math.abs(b.height - preferredHeight),
  )[0]; // we sort the thumbnails by the difference between the preferred height and the thumbnail height, and then we take the first one
  if (url.includes("lh3.googleusercontent.com")) {
    return url
      .replace("w60", "w200")
      .replace("h60", "h200")
      .replace("w120", "w200")
      .replace("h120", "h200");
  }

  return url;
};
