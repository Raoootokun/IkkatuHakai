import { world, system, ItemStack, EnchantmentType } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { config } from "./config";
const MINEALL_BLOCK_IDS = config.MINEALL_BLOCK_INFO.map(a => { return a.blockId; })


system.runInterval(() => {
    for(const player of world.getPlayers()) {
        if(player.isSneaking){
            if(!player.__isSneaking){
                player.__isSneaking = true;
                playerChange(player);
            };
        }else{
            if(player.__isSneaking)player.__isSneaking = false;
        };
    };
});

world.afterEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;
    if(source.typeId != "minecraft:player")return;
    
    if(source.isSneaking && (config.CUTALL_TOOL_IDS.includes(itemStack.typeId) || config.MINEALL_TOOL_IDS.includes(itemStack.typeId))){
        playerSettingForm(source);
    };
});

world.beforeEvents.playerBreakBlock.subscribe(ev => {
    const { player, block, itemStack } = ev;
    const blockId = block.typeId;

    if(player.getDynamicProperty("cutAll") && config.CUTALL_TOOL_IDS.includes(itemStack?.typeId) && config.CUTALL_BLOCK_IDS.includes(blockId)){
        system.run(() => { cutAll(player, block, blockId); });
    };

    if(player.getDynamicProperty("mineAll") && config.MINEALL_TOOL_IDS.includes(itemStack?.typeId) && MINEALL_BLOCK_IDS.includes(blockId)){
        system.run(() => { mineAll(player, block, blockId, itemStack); });
    };

});


function cutAll(player, block, blockId) {
    const itemStack = new ItemStack(blockId);
    const container = player.getComponent("inventory").container;

    const data = {
        location: block.location,
        id: blockId,
        otherBlockIds: [],
        itemStack: itemStack,
        maxCount: player.getDynamicProperty("maxBlockCount"),
        count: 0,
        isStop: false,
        itemStaticDrop: player.getDynamicProperty("itemStaticDrop"),
        itemAuteCollect: player.getDynamicProperty("itemAuteCollect"),
    };

    system.runJob(getBlocks(block, data, itemDrop));

    function itemDrop(block) {
        block.setType("air");
        const location = { x:block.location.x+0.5, y:block.location.y, z:block.location.z+0.5, };
        
        if(data.itemAuteCollect){
            const result = container.addItem(data.itemStack);
            if(!result)return;
        };

        const entity = block.dimension.spawnItem(data.itemStack, location);
        if(data.itemStaticDrop)itemClearVelocity(entity);
        if(data.itemAuteCollect)entity.teleport(player.location);
    };
};

function mineAll(player, block, blockId, itemStack) {
    const index = MINEALL_BLOCK_IDS.indexOf(blockId);
    if(index == -1)return;
    const info = config.MINEALL_BLOCK_INFO[index];
    const dropItemStack = new ItemStack(info.dropId);
    const dropOreItemStack = new ItemStack(info.blockId);
    const container = player.getComponent("inventory").container;

    const enchantable = itemStack.getComponent("enchantable");
    const hasSilkTouch = enchantable.hasEnchantment(new EnchantmentType("silk_touch"));
    const fortuneLevel = enchantable.hasEnchantment(new EnchantmentType("fortune")) ? enchantable.getEnchantment(new EnchantmentType("fortune")).level : 0;

    const data = {
        id: blockId,
        otherBlockIds: info.otherBlockIds,
        dropItemStack: dropItemStack,
        dropOreItemStack: dropOreItemStack,
        maxCount: player.getDynamicProperty("maxBlockCount"),
        count: 0,
        isStop: false,
        hasSilkTouch: hasSilkTouch,
        fortuneLevel: fortuneLevel,
        itemStaticDrop: player.getDynamicProperty("itemStaticDrop"),
        itemAuteCollect: player.getDynamicProperty("itemAuteCollect"),
    };

    system.runJob(getBlocks(block, data, itemDrop));

    function itemDrop(block) {
        block.setType("air");
        const location = { x:block.location.x+0.5, y:block.location.y, z:block.location.z+0.5, };
        
        const dropItemStack = data.hasSilkTouch ? data.dropOreItemStack : data.dropItemStack;

        let dropCount = 1;

        if(!data.hasSilkTouch){
            dropCount = Math.floor(Math.random() * (info.maxDropCount - info.minDropCount) ) + info.minDropCount;
            if(data.fortuneLevel > 0){
                const r = Math.random();
                if(data.fortuneLevel == 1){
                    if(r <= 0.667){
                        dropCount *= 1;
                    }else{
                        dropCount *= 2;
                    };
                }else if(data.fortuneLevel == 2){
                    if(r <= 0.5){
                        dropCount *= 1;
                    }else{
                        const r2 = Math.random();
                        if(r2 <= 0.5){
                            dropCount *= 2;
                        }else{
                            dropCount *= 3;
                        };
                    };
                }else if(data.fortuneLevel == 3){
                    if(r <= 0.4){
                        dropCount *= 1;
                    }else{
                        const r2 = Math.random();
                        if(r2 <= 0.33){
                            dropCount *= 2;
                        }else if(r2 <= 0.66){
                            dropCount *= 2;
                        }else{
                            dropCount *= 4;
                        };
                    };
                };
            };
        };
   
        dropItemStack.amount = dropCount;

        if(data.itemAuteCollect){
            const result = container.addItem(data.dropItemStack);
            if(!result)return;
        };

        const entity = block.dimension.spawnItem(dropItemStack, location);
        if(data.itemStaticDrop)itemClearVelocity(entity);
        if(data.itemAuteCollect)entity.teleport(player.location);
    };
};

function* getBlocks(centerBlock, data, runFunc) {
    if(data.isStop)return;

    const blocks = [];
     
    //Middle Check
    const northBlock = centerBlock.north();
    if(northBlock.typeId == data.id || data.otherBlockIds.includes(northBlock.typeId))blocks.push(northBlock);
    const northEastBlock = northBlock.east();
    if(northEastBlock.typeId == data.id || data.otherBlockIds.includes(northEastBlock.typeId))blocks.push(northEastBlock);
    const northWestBlock = northBlock.west();
    if(northWestBlock.typeId == data.id || data.otherBlockIds.includes(northWestBlock.typeId))blocks.push(northWestBlock);

    const southBlock = centerBlock.south();
    if(southBlock.typeId == data.id || data.otherBlockIds.includes(southBlock.typeId))blocks.push(southBlock);
    const southEastBlock = southBlock.east();
    if(southEastBlock.typeId == data.id || data.otherBlockIds.includes(southEastBlock.typeId))blocks.push(southEastBlock);
    const southWestBlock = southBlock.west();
    if(southWestBlock.typeId == data.id || data.otherBlockIds.includes(southWestBlock.typeId))blocks.push(southWestBlock);

    const eastBlock = centerBlock.east();
    if(eastBlock.typeId == data.id || data.otherBlockIds.includes(eastBlock.typeId))blocks.push(eastBlock);
    const westBlock = centerBlock.west();
    if(westBlock.typeId == data.id || data.otherBlockIds.includes(westBlock.typeId))blocks.push(westBlock);

    //up check
    const upBlock = centerBlock.above();
    if(upBlock.typeId == data.id || data.otherBlockIds.includes(upBlock.typeId))blocks.push(upBlock);

    const upNorthBlock = upBlock.north();
    if(upNorthBlock.typeId == data.id || data.otherBlockIds.includes(upNorthBlock.typeId))blocks.push(upNorthBlock);
    const upNorthEastBlock = upNorthBlock.east();
    if(upNorthEastBlock.typeId == data.id || data.otherBlockIds.includes(upNorthEastBlock.typeId))blocks.push(upNorthEastBlock);
    const upNorthWestBlock = upNorthBlock.west();
    if(upNorthWestBlock.typeId == data.id || data.otherBlockIds.includes(upNorthWestBlock.typeId))blocks.push(upNorthWestBlock);
    
    const upSouthBlock = upBlock.south();
    if(upSouthBlock.typeId == data.id || data.otherBlockIds.includes(upSouthBlock.typeId))blocks.push(upSouthBlock);
    const upSouthEastBlock = upSouthBlock.east();
    if(upSouthEastBlock.typeId == data.id || data.otherBlockIds.includes(upSouthEastBlock.typeId))blocks.push(upSouthEastBlock);
    const upSouthWestBlock = centerBlock.south().above();
    if(upSouthWestBlock.typeId == data.id || data.otherBlockIds.includes(upSouthWestBlock.typeId))blocks.push(upSouthWestBlock);
    
    const upEastBlock = upBlock.east();
    if(upEastBlock.typeId == data.id || data.otherBlockIds.includes(upEastBlock.typeId))blocks.push(upEastBlock);
    const upWestBlock = upBlock.west();
    if(upWestBlock.typeId == data.id || data.otherBlockIds.includes(upWestBlock.typeId))blocks.push(upWestBlock);

    //Down Check
    const downBlock = centerBlock.below();
    if(downBlock.typeId == data.id || data.otherBlockIds.includes(downBlock.typeId))blocks.push(downBlock);

    const downNorthBlock = downBlock.north();
    if(downNorthBlock.typeId == data.id || data.otherBlockIds.includes(downNorthBlock.typeId))blocks.push(downNorthBlock);
    const downNorthEastBlock = upNorthBlock.east();
    if(downNorthEastBlock.typeId == data.id || data.otherBlockIds.includes(downNorthEastBlock.typeId))blocks.push(downNorthEastBlock);
    const downNorthWestBlock = upNorthBlock.west();
    if(downNorthWestBlock.typeId == data.id || data.otherBlockIds.includes(downNorthWestBlock.typeId))blocks.push(downNorthWestBlock);
    
    const downSouthBlock = downBlock.south();
    if(downSouthBlock.typeId == data.id || data.otherBlockIds.includes(downSouthBlock.typeId))blocks.push(downSouthBlock);
    const downSouthEastBlock = upSouthBlock.east();
    if(downSouthEastBlock.typeId == data.id || data.otherBlockIds.includes(downSouthEastBlock.typeId))blocks.push(downSouthEastBlock);
    const downSouthWestBlock = centerBlock.south().above();
    if(downSouthWestBlock.typeId == data.id || data.otherBlockIds.includes(downSouthWestBlock.typeId))blocks.push(downSouthWestBlock);
    
    const downEastBlock = downBlock.east();
    if(downEastBlock.typeId == data.id || data.otherBlockIds.includes(downEastBlock.typeId))blocks.push(downEastBlock);
    const downWestBlock = downBlock.west();
    if(downWestBlock.typeId == data.id || data.otherBlockIds.includes(downWestBlock.typeId))blocks.push(downWestBlock);

    for(const block of blocks){
        if(data.count >= data.maxCount || data.isStop)return data.isStop = true;
        data.count++;    
        runFunc(block);
        system.runJob(getBlocks(block, data, runFunc));
    };
};

function itemClearVelocity(entity) {
    const vec = entity.getVelocity();
    entity.applyImpulse({
        x: -vec.x, y: -vec.y, z: -vec.z,
    });
};

function playerChange(player) {
    const itemStack = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);

    if(config.MINEALL_TOOL_IDS.includes(itemStack?.typeId)){
        if(player.getDynamicProperty("mineAll")){
            player.setDynamicProperty("mineAll", false);
            player.sendMessage(`マインオールを §cOFF§f にしました。`);
        }else{
            player.setDynamicProperty("mineAll", true);
            player.sendMessage(`マインオールを §aON§f にしました。`);
        };
    };
    if(config.CUTALL_TOOL_IDS.includes(itemStack?.typeId)){
        if(player.getDynamicProperty("cutAll")){
            player.setDynamicProperty("cutAll", false);
            player.sendMessage(`カットオールを §cOFF§f にしました。`);
        }else{
            player.setDynamicProperty("cutAll", true);
            player.sendMessage(`カットオールを §aON§f にしました。`);
        };
    };

    playerInitial(player);
};

function playerSettingForm(player) {
    playerInitial(player);

    const form = new ModalFormData()
    .title("一括破壊設定")
    .slider("マインオール、カットオールの設定を行います\n\n最大連鎖数", 100, 300, 25, player.getDynamicProperty("maxBlockCount"))
    .toggle("アイテム静的ドロップ", player.getDynamicProperty("itemStaticDrop"))
    .toggle("アイテム自動回収", player.getDynamicProperty("itemAuteCollect"))
    .submitButton("保存")
    .show(player).then(res => {
        if(res.canceled)return;

        player.setDynamicProperty("maxBlockCount", res.formValues[0]);
        player.setDynamicProperty("itemStaticDrop", res.formValues[1]);
        player.setDynamicProperty("itemAuteCollect", res.formValues[2]);
        player.sendMessage(`設定を保存しました。`);
    });
};

function playerInitial(player) {
    if(player.getDynamicProperty("maxBlockCount") === undefined)player.setDynamicProperty("maxBlockCount", 150);
    if(player.getDynamicProperty("itemStaticDrop") === undefined)player.setDynamicProperty("itemStaticDrop", false);
    if(player.getDynamicProperty("itemAuteCollect") === undefined)player.setDynamicProperty("itemAuteCollect", false);
};