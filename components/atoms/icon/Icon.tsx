import type { CSSProperties, SVGProps } from "react";
import featherIcons from "feather-icons/dist/icons.json";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";

export type IconName = keyof typeof featherIcons;

type IconStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export type IconProps = Omit<
  SVGProps<SVGSVGElement>,
  "children" | "color" | "dangerouslySetInnerHTML" | "height" | "name" | "style" | "title" | "width"
> & {
  name: IconName;
  size?: number;
  title?: string;
  style?: IconStyle;
};

/** A Feather SVG icon with Numa's context content color by default. */
export function Icon({
  name,
  size = 24,
  title,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  role,
  style,
  ...svgProps
}: IconProps) {
  const accessibleName = ariaLabel ?? title;

  return (
    <svg
      {...svgProps}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={role ?? (accessibleName ? "img" : undefined)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (accessibleName ? undefined : true)}
      style={{
        ...getSemanticColorStyle(),
        color: semanticColorVariable("numa-color-context-content-strong"),
        flexShrink: 0,
        ...style,
      }}
    >
      {title ? <title>{title}</title> : null}
      <g dangerouslySetInnerHTML={{ __html: featherIcons[name] }} />
    </svg>
  );
}
