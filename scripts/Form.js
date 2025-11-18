import { world, system, Player, } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { Ikkatu } from "./Ikkatu";

export class Form {

    /**
     * 
     * @param {Player} player 
     */
    static show(player) {
        const messageTypeList = [
            { txt:"チャット", id:"chat" },
            { txt:"アクションバー", id:"actionbar" },
            { txt:"なし", id:"none" },
        ];

        Ikkatu.init(player);
        
        const form = new ModalFormData()
        .title("一括破壊設定")
        .header("一般")
        .slider("最大連鎖数", 100, 500, { valueStep:25, defaultValue:player.getDynamicProperty("maxBlockCount"), tooltip:"連鎖するブロック数を設定します\nスペックによって重たくなる可能性があります" })
        .toggle("アイテム静的ドロップ", { defaultValue:player.getDynamicProperty("itemStaticDrop"), tooltip:"アイテムがブロックの中心座標にドロップします" })
        .toggle("アイテム自動回収", { defaultValue:player.getDynamicProperty("itemAuteCollect"), tooltip:"ドロップ時にアイテムをインベントリに移動します" })
        .divider()

        .header("表示")
        .dropdown("切り替え通知", messageTypeList.map(a => { return a.txt; }), { defaultValueIndex:messageTypeList.map(a => { return a.id; }).indexOf(player.getDynamicProperty("messageType")), tooltip:"ON/OFFを切り替えた時の通知場所を設定します" })
        .toggle("ステータス表示", { defaultValue:player.getDynamicProperty("showActionbar"), tooltip:"ON/OFFをの状態をアクションバーに表示するか" })
        .divider()

        .submitButton("保存")
        .show(player).then(res => {
            if(res.canceled)return;
    
            player.setDynamicProperty("maxBlockCount", res.formValues[1]);
            player.setDynamicProperty("itemStaticDrop", res.formValues[2]);
            player.setDynamicProperty("itemAuteCollect", res.formValues[3]);
            player.setDynamicProperty("messageType", messageTypeList[res.formValues[6]].id);
            player.setDynamicProperty("showActionbar", res.formValues[7]);
            player.sendMessage(`設定を保存しました。`);
        });
    }
    
}

