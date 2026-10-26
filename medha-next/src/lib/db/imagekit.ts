import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint:
    process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/ayushrathore1",
});

/** Check if ImageKit credentials are configured */
export function isImageKitConfigured(): boolean {
  return !!(process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY);
}

export { imagekit };
export default imagekit;
