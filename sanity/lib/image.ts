import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
