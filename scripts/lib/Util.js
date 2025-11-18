import { system, world } from "@minecraft/server"
/**
 *  チャットに値を出力します
 * @param {*} value 
 * @param {boolean} organize 値を整頓して表示する
 * @returns 
 */
export function log(value, organize) {
    try{
        if(typeof value == `string`)return world.sendMessage(value);
        if(organize)return world.sendMessage(`${JSON.stringify(value, null, 2)}`);
        world.sendMessage(`${JSON.stringify(value)}`);
    }catch(e) {
        system.run(() => {
            if(typeof value == `string`)return world.sendMessage(value);
            if(organize)return world.sendMessage(`${JSON.stringify(value, null, 2)}`);
            world.sendMessage(`${JSON.stringify(value)}`);
        });
    }
};
