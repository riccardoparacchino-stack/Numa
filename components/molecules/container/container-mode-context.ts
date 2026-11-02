import { createContext } from "react";
import type { ContainerMode } from "../../../foundation/parametric-sizing";

export const ContainerModeContext = createContext<ContainerMode | undefined>(undefined);
