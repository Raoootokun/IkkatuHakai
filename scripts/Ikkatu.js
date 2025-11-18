import { world, system, ItemStack, EnchantmentType, } from "@minecraft/server";
import { config } from "./config";
import { log } from "./lib/Util";
const MINEALL_BLOCK_IDS = config.MINEALL_BLOCK_INFO.map(a => { return a.blockId; })


export class Ikkatu {
    static MINEALL_BLOCK_IDS = MINEALL_BLOCK_IDS;

    static cutAll(player, block, blockId) {
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
    
        system.runJob(Ikkatu.getBlocks(block, data, itemDrop));
    
        function itemDrop(block) {
            block.setType("air");
            const location = { x:block.location.x+0.5, y:block.location.y, z:block.location.z+0.5, };
            
            if(data.itemAuteCollect){
                const result = container.addItem(data.itemStack);
                if(!result)return;
            };
    
            const entity = block.dimension.spawnItem(data.itemStack, location);
            if(data.itemStaticDrop)Ikkatu.itemClearVelocity(entity);
            if(data.itemAuteCollect)entity.teleport(player.location);
        };
    };

    static mineAll(player, block, blockId, itemStack) {
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
            dimension: player.dimension,
        };
    
        system.runJob(Ikkatu.getBlocks(block, data, itemDrop));
    
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
    
            if(info.spawnXpCount){
                if(!data.hasSilkTouch){
                    const spawnXpCount = dropCount = Math.floor(Math.random() * (info.spawnXpCount[1] - info.spawnXpCount[0]) ) + info.spawnXpCount[0];
                    if(data.itemAuteCollect){
                        player.addExperience(spawnXpCount);
                    }else{
                        for(let i=0; i<spawnXpCount; i++){
                            data.dimension.spawnEntity("xp_orb", location);
                        };
                    }
                };
            };
    
            if(data.itemAuteCollect){
                const result = container.addItem(dropItemStack);
                if(!result)return;
            };
    
            const entity = block.dimension.spawnItem(dropItemStack, location);
            if(data.itemStaticDrop)Ikkatu.itemClearVelocity(entity);
            if(data.itemAuteCollect)entity.teleport(player.location);
        };
    };



    static *getBlocks(centerBlock, data, runFunc) {
        if(data.isStop)return;
    
        const blocks = [];

        for(let x=-1; x<=1; x++) {
            for(let y=-1; y<=1; y++) {
                for(let z=-1; z<=1; z++) {
                    const block = centerBlock.dimension.getBlock({ x:centerBlock.x+x, y:centerBlock.y+y, z:centerBlock.z+z });
                    if(!block)continue;

                    if(block.typeId == data.id || data.otherBlockIds.includes(block.typeId))blocks.push(block);
                }
            }
        };

        for(const block of blocks){
            if(data.count >= data.maxCount || data.isStop)return data.isStop = true;
            data.count++;    
            runFunc(block);
            system.runJob(Ikkatu.getBlocks(block, data, runFunc));
        };
    };


    static itemClearVelocity(item) {
        const vec = item.getVelocity();
        item.applyImpulse({
            x: -vec.x, y: -vec.y, z: -vec.z,
        });
    };


    static change(player) {
        const itemStack = player.getComponent("inventory").container.getItem(player.selectedSlotIndex);
        const messageType = player.getDynamicProperty("messageType");
    
        let type;
        if(config.MINEALL_TOOL_IDS.includes(itemStack?.typeId))type = "mineAll";
        if(config.CUTALL_TOOL_IDS.includes(itemStack?.typeId))type = "cutAll";
        if(!type)return;

        const res = player.getDynamicProperty(type);
        player.setDynamicProperty(type, !res);

        const typeTxt = Ikkatu.getTypeText(type);
        const resTxt = res ? `§aON§f` : `§cOFF§f`;
        switch(messageType) {
            case "chat": player.sendMessage(`${typeTxt}を ${resTxt} にしました。`); break;
            case "actionbar": {
                const showActionbar = player.getDynamicProperty("showActionbar");
                if(!showActionbar)player.onScreenDisplay.setActionBar(`${typeTxt}を ${resTxt} にしました。`);
                break;
            }
            case "none": break;
        };

        Ikkatu.init(player);
    };

    static getTypeText(type) {
        if(type == "mineAll")return "マインオール";
        else if(type == "cutAll")return "カットオール";
    }

    static init(player) {
        if(player.getDynamicProperty("maxBlockCount") === undefined)player.setDynamicProperty("maxBlockCount", 150);
        if(player.getDynamicProperty("itemStaticDrop") === undefined)player.setDynamicProperty("itemStaticDrop", false);
        if(player.getDynamicProperty("itemAuteCollect") === undefined)player.setDynamicProperty("itemAuteCollect", false);
        if(player.getDynamicProperty("messageType") === undefined)player.setDynamicProperty("messageType", "chat");
        if(player.getDynamicProperty("showActionbar") === undefined)player.setDynamicProperty("showActionbar", false);
    };

    static reset(player) {
        player.setDynamicProperty("maxBlockCount", undefined);
        player.setDynamicProperty("itemStaticDrop", undefined);
        player.setDynamicProperty("itemAuteCollect", undefined);
        player.setDynamicProperty("messageType", undefined);
        player.setDynamicProperty("showActionbar", undefined);
    }
}