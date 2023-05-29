// -------------------------------------------------------------------------------
// --FACTORIO MOD: Magitory
// --Factorio + Magic = WOW!
// --Authors: Nibuja, HanniWalter
// --Date: 14.03.2020
// -------------------------------------------------------------------------------

import { DefineDungeon } from "./core/dungeon/dungeon_main";
import { ReloadEvents } from "./util";
import { DefineEvent } from "./util";
import { reload_init } from "./util";

DefineDungeon();

script.on_load(() => {
	reload_init();
});

DefineEvent(defines.events.on_player_joined_game, event => {
	reload_init();
});

DefineEvent(defines.events.on_player_created, event => {
	reload_init();
});

// --===================================================
// -- REQUIREMENTS
// require('script.util')
// require('script.vectors')
// require('script.motionController')
// require('script.modifiers')

// require("script.weaponScript")
// require("script.developmentScript")
// require("script.spellScript")
// require("script.spellGui")
// require("script.dungeonScripts.room")

// require("script.dungeonScripts.dungeonMain")

ReloadEvents();
