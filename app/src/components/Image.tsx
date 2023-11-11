import { useLayoutEffect, useState } from "react";
import { ImageRequireSource, Image as RNImage, ImageProps } from "react-native";

type Props = ImageProps & {
  source: NonNullable<ImageProps["source"]>;
  // Automatically set the width and height based on the image aspect ratio
  autoSize?: { width: number } | { height: number };
};

export function Image({ source, style, autoSize, ...rest }: Props) {
  const dimensions = useImageDimensions({ source, size: autoSize });
  return <RNImage {...rest} source={source} style={[dimensions, style]} />;
}

function useImageDimensions({
  source,
  size,
}: {
  source: NonNullable<ImageProps["source"]>;
  size?: { width: number } | { height: number };
}) {
  let width: number | undefined;
  if (size && "width" in size) {
    width = size.width;
  }

  let height: number | undefined;
  if (size && "height" in size) {
    height = size.height;
  }

  const [dimensions, setDimensions] = useState<{
    width?: number;
    height?: number;
  }>({ width, height });

  const src = typeof source === "object" ? (source as any).uri : source;

  useLayoutEffect(() => {
    if (!width && !height) return;

    function calcAspectRatio(w: number, h: number) {
      const aspectRatio = w / h;
      setDimensions({
        width: width || aspectRatio * (height as number),
        height: height || (width as number) / aspectRatio,
      });
    }

    if (typeof src === "string") {
      RNImage.getSize(src, calcAspectRatio, (err) => console.log(err));
    } else {
      const asset = RNImage.resolveAssetSource(src as ImageRequireSource);
      calcAspectRatio(asset.width, asset.height);
    }
  }, [src, width, height]);

  return dimensions;
}
