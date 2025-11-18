import { world, system, ItemStack, EnchantmentType, InputButton, ButtonState } from "@minecraft/server";
import { Form } from "./Form";
import { config } from "./config";
import { Ikkatu } from "./Ikkatu";

world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    if(source.typeId != "minecraft:player")return;
    
    if(source.isSneaking && (config.CUTALL_TOOL_IDS.includes(itemStack.typeId) || config.MINEALL_TOOL_IDS.includes(itemStack.typeId))){
        Form.show(source);
    };
});

world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const { player, block, itemStack } = ev;
    const blockId = block.typeId;

    if(player.getDynamicProperty("cutAll") && config.CUTALL_TOOL_IDS.includes(itemStack?.typeId) && config.CUTALL_BLOCK_IDS.includes(blockId)){
        system.run(() => { Ikkatu.cutAll(player, block, blockId); });
    };

    if(player.getDynamicProperty("mineAll") && config.MINEALL_TOOL_IDS.includes(itemStack?.typeId) && Ikkatu.MINEALL_BLOCK_IDS.includes(blockId)){
        system.run(() => { Ikkatu.mineAll(player, block, blockId, itemStack); });
    };

});

world.afterEvents.playerButtonInput.subscribe(ev => {
    const { player, button, newButtonState } = ev;

    //スニークを押したとき
    if(button == InputButton.Sneak && newButtonState == ButtonState.Pressed) {
        Ikkatu.change(player);
    }
})