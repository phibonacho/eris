import GroupClass from "./GroupClass";

const clone = require("autoprefixer");

export let to_mix = new GroupClass();
export let groups = [];


export function aggregate(group_num) {
    let tmp = new GroupClass();
    tmp.clone(to_mix);
    // svuoto i gruppi ausiliari:
    let nat_aggregate = [];
    let queue = [];
    groups = [];

    if(to_mix.items.length===0){
        console.log('no items to aggregate');
        return;
    }
    // aggrego per lingua per la nazionalità
    console.log('aggregation by nationality');
    for (let j = 0; j < Object.keys(tmp.stats.language).length; j++) {
        nat_aggregate.push(new GroupClass());
        nat_aggregate[j].massive_add(tmp.personSpeaking(tmp.mostSpokenLanguage()));
    }

    // aggrego per centro locale
    console.log('aggregation by local center');
    for (let k = 0; k < nat_aggregate.length; k++) {
        queue.push(new GroupClass());
        for (let j = 0; j < Object.keys(nat_aggregate[k].stats.localCenter).length; j++) {
            let to_add = nat_aggregate[k].personAttending(nat_aggregate[k].mostAttendedCenter());
            queue[k].massive_add(to_add);
        }
    }

    console.log('pushing groups');
    // creo i gruppi
    for (let i = 0; i < group_num; i++) groups.push(new GroupClass());

    for (let i = 0; i < queue.length; i++) {
        let current_group = 0;
        // per ogni gruppo creato
        console.log('iterating over group: ' + i);
        while (queue[i].items.length > 0)
            for (let j = 0; j < group_num; j++) {
                if (queue[i].items.length !== 0) {
                    current_group++;
                    let to_add = queue[i].top();
                    groups[j].add(to_add);
                }
            }
        console.log("successfully added: " + current_group);
    }
}

function updateIndex(i){
    return (i+1>=group_num)? 0 : i+1;

}
