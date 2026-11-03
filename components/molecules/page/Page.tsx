import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { ContainerMode } from "../../../foundation/parametric-sizing";
import { modeForPageWidth } from "../../../foundation/page-sizing";
import { getSemanticColorStyle } from "../../../foundation/colors/semantic-color-style";
import { resolvePageGapPx, resolvePagePaddingPx } from "../../../foundation/semantic-dimensions";
import { PageModeContext } from "./page-mode-context";
import "./Page.css";

type PageStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export type PageProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "style"
> & {
  children?: ReactNode;
  mode?: ContainerMode;
  className?: string;
  style?: PageStyle;
};

export function Page({ children, mode, className, style, ...elementProps }: PageProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [autoMode, setAutoMode] = useState<ContainerMode>("compact");
  const effectiveMode = mode ?? autoMode;

  useLayoutEffect(() => {
    const element = pageRef.current;
    if (!element || mode || typeof ResizeObserver === "undefined") return;

    const updateMode = () => setAutoMode(modeForPageWidth(element.clientWidth));
    updateMode();
    const observer = new ResizeObserver(updateMode);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mode]);

  const classes = ["numa-page", className].filter(Boolean).join(" ");
  const pageStyle: PageStyle = {
    ...getSemanticColorStyle(),
    "--numa-page-background": "var(--numa-color-context-background-default)",
    "--numa-page-padding": `${resolvePagePaddingPx(effectiveMode)}px`,
    "--numa-page-gap": `${resolvePageGapPx(effectiveMode)}px`,
    ...style,
  };

  return (
    <PageModeContext.Provider value={effectiveMode}>
    <div
      {...elementProps}
      ref={pageRef}
      className={classes}
      style={pageStyle}
      data-mode={mode ?? "auto"}
      data-effective-mode={effectiveMode}
    >
      {children}
    </div>
    </PageModeContext.Provider>
  );
}
