import { world, system, } from "@minecraft/server";
import { WorldLoad } from "./lib/WorldLoad";
import "./events";

const version = [ 1, 3, 0 ];
WorldLoad.subscribe(() => {
    world.sendMessage(`[§b一括破壊 ver${version.join(".")}§f] Reload`);
});

system.runInterval(() => {
    for(const player of world.getPlayers()) {
        const showActionbar = player.getDynamicProperty("showActionbar");
        if(showActionbar) {
            const mineAll = player.getDynamicProperty("mineAll") ? `§aON§f` : `§cOFF§f`;
            const cutAll = player.getDynamicProperty("cutAll") ? `§aON§f` : `§cOFF§f`;

            player.onScreenDisplay.setActionBar(`マインオール: ${mineAll}\nカットオール: ${cutAll}`)
        }
    };
});