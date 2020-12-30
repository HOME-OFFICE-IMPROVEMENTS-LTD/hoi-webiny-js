import { plugins } from "@webiny/plugins";
import orderBy from "lodash/orderBy";
import {
    PbEditorResponsiveModePlugin,
    PbRenderResponsiveModePlugin,
    DisplayMode
} from "../../../types";

export const WIDTH_UNIT_OPTIONS = [
    {
        label: "%",
        value: "%"
    },
    {
        label: "px",
        value: "px"
    },
    {
        label: "em",
        value: "em"
    },
    {
        label: "vw",
        value: "vw"
    },
    {
        label: "auto",
        value: "auto"
    }
];

export const HEIGHT_UNIT_OPTIONS = [
    {
        label: "%",
        value: "%"
    },
    {
        label: "px",
        value: "px"
    },
    {
        label: "em",
        value: "em"
    },
    {
        label: "vh",
        value: "vh"
    },
    {
        label: "auto",
        value: "auto"
    }
];

export const createInitialPerDeviceSettingValue = (defaultValue: any, baseDisplayMode?: string) => {
    // Only set "baseDisplayMode" value if present
    if (baseDisplayMode) {
        return {
            [baseDisplayMode]: defaultValue
        };
    }

    const value = {};
    // Get responsive editor modes from plugins.
    const editorModes = plugins
        .byType<PbEditorResponsiveModePlugin>("pb-editor-responsive-mode")
        .map(pl => pl.config);
    // Set default value for each mode.
    editorModes.forEach(({ displayMode }) => {
        value[displayMode] = defaultValue;
    });
    return value;
};
