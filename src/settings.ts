import { Data, Mods, SettingDefinition } from "typed-factorio/settings/types";
declare const data: Data;
declare const mods: Mods;

const setting: SettingDefinition = {
	type: "int-setting",
	name: "fluid-void-extra-speedmultiplier",
	setting_type: "runtime-global",
	default_value: 5,
};

data.extend([setting]);
