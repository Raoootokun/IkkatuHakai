export const config = {

    //カットオールが発動するツールのID
    CUTALL_TOOL_IDS: [
        "minecraft:wooden_axe",
        "minecraft:stone_axe",
        "minecraft:iron_axe",
        "minecraft:golden_axe",
        "minecraft:diamond_axe",
        "minecraft:netherite_axe",
        "minecraft:copper_axe",
    ],

    //カットオールで破壊可能ブロック
    CUTALL_BLOCK_IDS: [
        "minecraft:oak_log",
        "minecraft:spruce_log",
        "minecraft:birch_log",
        "minecraft:jungle_log",
        "minecraft:acacia_log",
        "minecraft:dark_oak_log",
        "minecraft:mangrove_log",
        "minecraft:mangrove_roots",
        "minecraft:cherry_log",
        "minecraft:crimson_stem",
        "minecraft:warped_stem",
        "minecraft:pale_oak_log",
        "minecraft:stripped_oak_log",
        "minecraft:stripped_spruce_log",
        "minecraft:stripped_birch_log",
        "minecraft:stripped_jungle_log",
        "minecraft:stripped_acacia_log",
        "minecraft:stripped_dark_oak_log",
        "minecraft:stripped_mangrove_log",
        "minecraft:stripped_cherry_log",
        "minecraft:stripped_crimson_stem",
        "minecraft:stripped_warped_stem",
        "minecraft:stripped_pale_oak_log",
    ],

    //マインオールが発動するツールのID
    MINEALL_TOOL_IDS: [
        "minecraft:wooden_pickaxe",
        "minecraft:stone_pickaxe",
        "minecraft:iron_pickaxe",
        "minecraft:golden_pickaxe",
        "minecraft:diamond_pickaxe",
        "minecraft:netherite_pickaxe",
        "minecraft:copper_pickaxe",
    ],

    //マインオールで破壊可能ブロックデータ
    MINEALL_BLOCK_INFO: [
        {
            blockId: "minecraft:iron_ore",
            dropId: "minecraft:raw_iron",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:deepslate_iron_ore" ],
        },
        {
            blockId: "minecraft:gold_ore",
            dropId: "minecraft:raw_gold",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:deepslate_gold_ore" ],
        },
        {
            blockId: "minecraft:diamond_ore",
            dropId: "minecraft:diamond",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:deepslate_diamond_ore" ],
            spawnXpCount: [ 3, 7 ]
        },
        {
            blockId: "minecraft:lapis_ore",
            dropId: "minecraft:lapis_lazuli",
            minDropCount: 4,
            maxDropCount: 9,
            otherBlockIds: [ "minecraft:deepslate_lapis_ore" ],
            spawnXpCount: [ 2, 5 ]
        },
        {
            blockId: "minecraft:redstone_ore",
            dropId: "minecraft:redstone",
            minDropCount: 4,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:deepslate_redstone_ore", "minecraft:lit_redstone_ore", "minecraft:lit_deepslate_redstone_ore" ],
            spawnXpCount: [ 1, 5 ]
        },
        {
            blockId: "minecraft:lit_redstone_ore",
            dropId: "minecraft:redstone",
            minDropCount: 4,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:deepslate_redstone_ore", "minecraft:redstone_ore", "minecraft:lit_deepslate_redstone_ore" ],
            spawnXpCount: [ 1, 5 ]
        },
        {
            blockId: "minecraft:coal_ore",
            dropId: "minecraft:coal",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:deepslate_coal_ore" ],
            spawnXpCount: [ 0, 2 ]
        },
        {
            blockId: "minecraft:emerald_ore",
            dropId: "minecraft:emerald",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:deepslate_emerald_ore" ],
            spawnXpCount: [ 3, 7 ]
        },
        {
            blockId: "minecraft:copper_ore",
            dropId: "minecraft:raw_copper",
            minDropCount: 2,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:deepslate_copper_ore" ],
        },
        
        //深層岩
        {
            blockId: "minecraft:deepslate_iron_ore",
            dropId: "minecraft:raw_iron",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:iron_ore" ],
        },
        {
            blockId: "minecraft:deepslate_gold_ore",
            dropId: "minecraft:raw_gold",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:gold_ore" ],
        },
        {
            blockId: "minecraft:deepslate_diamond_ore",
            dropId: "minecraft:diamond",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:diamond_ore" ],
            spawnXpCount: [ 3, 7 ]
        },
        {
            blockId: "minecraft:deepslate_lapis_ore",
            dropId: "minecraft:lapis_lazuli",
            minDropCount: 4,
            maxDropCount: 9,
            otherBlockIds: [ "minecraft:lapis_ore" ],
            spawnXpCount: [ 2, 5 ]
        },
        {
            blockId: "minecraft:deepslate_redstone_ore",
            dropId: "minecraft:redstone",
            minDropCount: 4,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:redstone_ore", "minecraft:lit_redstone_ore", "minecraft:lit_deepslate_redstone_ore" ],
            spawnXpCount: [ 1, 5 ]
        },
        {
            blockId: "minecraft:lit_deepslate_redstone_ore",
            dropId: "minecraft:redstone",
            minDropCount: 4,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:deepslate_redstone_ore", "minecraft:redstone_ore", "minecraft:lit_redstone_ore" ],
            spawnXpCount: [ 1, 5 ]
        },
        {
            blockId: "minecraft:deepslate_coal_ore",
            dropId: "minecraft:coal",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:coal_ore" ],
            spawnXpCount: [ 0, 2 ]
        },
        {
            blockId: "minecraft:deepslate_emerald_ore",
            dropId: "minecraft:emerald",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [ "minecraft:emerald_ore" ],
            spawnXpCount: [ 3, 7 ]
        },
        {
            blockId: "minecraft:deepslate_copper_ore",
            dropId: "minecraft:raw_copper",
            minDropCount: 2,
            maxDropCount: 5,
            otherBlockIds: [ "minecraft:copper_ore" ],
        },

        //ネザー
        {
            blockId: "minecraft:quartz_ore",
            dropId: "minecraft:quartz",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [],
            spawnXpCount: [ 2, 5 ]
        },
        {
            blockId: "minecraft:nether_gold_ore",
            dropId: "minecraft:gold_nugget",
            minDropCount: 2,
            maxDropCount: 6,
            otherBlockIds: [],
            spawnXpCount: [ 0, 1 ]
        },
        {
            blockId: "minecraft:ancient_debris",
            dropId: "minecraft:ancient_debris",
            minDropCount: 1,
            maxDropCount: 1,
            otherBlockIds: [],
        },
    ],

}
