import { createContext } from "react";
import type { ContainerMode } from "../../../foundation/parametric-sizing";

export const PageModeContext = createContext<ContainerMode | undefined>(undefined);
