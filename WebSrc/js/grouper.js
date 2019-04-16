import PersonClass from "./PersonClass";
import GroupClass from "./GroupClass";

const group_num = 3;


let to_mix = new GroupClass();


to_mix.add(new PersonClass('carlo', 'carli', 'M', 'it', 'Genova', 'Invernale'));
to_mix.add(new PersonClass('giovanni', 'costa', 'M', 'en', 'Milano', 'Estivo'));
to_mix.add(new PersonClass('andrea', 'andrei', 'M', 'it', 'Tortona', 'Primaverile'));
to_mix.add(new PersonClass('pietro', 'storare', 'M', 'en', 'Voghera', 'Estivo'));
to_mix.add(new PersonClass('martina', 'spinaro', 'F', 'en', 'Genova', 'Invernale'));
to_mix.add(new PersonClass('sabrina', 'puozzoli', 'M', 'en', 'Milano', 'Autunnale'));
to_mix.add(new PersonClass('giovanna', 'campo', 'F', 'it', 'Genova', 'Primaverile'));
to_mix.add(new PersonClass('carla', 'pieno', 'F', 'es', 'Genova', 'Invernale'));
to_mix.add(new PersonClass('beppe', 'fenoglio', 'M', 'es', 'Tortona', 'Estivo'));
to_mix.add(new PersonClass('giovanni', 'carli', 'M', 'en', 'Voghera', 'Estivo'));
to_mix.add(new PersonClass('silvio', 'carli', 'M', 'it', 'Tortona', 'Estivo'));
to_mix.add(new PersonClass('giuseppina', 'carli', 'F', 'nl', 'Genova', 'Invernale'));

let duplicates = new GroupClass();
let groups = new GroupClass();
let aggregate = new GroupClass();
let queue = new GroupClass();

console.log(to_mix.stats);
console.log("Most of these students attends the "+to_mix.mostAttendedCenter()+" center");
console.log("Instead a few students attends the "+to_mix.lessAttendedCenter()+" center");
console.log("Most of the students speak "+to_mix.mostSpokenLanguage());
console.log("Instead a few students speak "+to_mix.lessSpokenLanguage());

let partial_aggregation = to_mix.personSpeaking(to_mix.mostSpokenLanguage());

for(let i = 0; i<partial_aggregation.length; i++){
    console.log(`adding ${partial_aggregation[i]}`);
    aggregate.add(partial_aggregation[i]);
}

console.log(aggregate.stats);
console.log("Most of these students attends the "+aggregate.mostAttendedCenter()+" center");
console.log("Instead a few students attends the "+aggregate.lessAttendedCenter()+" center");

/*
*
* */
/*
_aggregate();



function eq (i, j){
    let res = true;
    for(let k = 4; k<=4; k++){
        console.log(`checking ${i[k]}===${j[k]}: ${i[k] === j[k]}`);
        res = res && i[k] === j[k];
    }
    return res;
}

function hasConfig(group, item){
    console.log(`comparing: ${group} and ${item}`);
    for(let i = 0; i< group.length; i++){
        if(eq(group[i], item))
            return true;
    }
    return false;
}

function _aggregate(){
    let current_group = 0;
    // init groups

    for(let i = 0; i<group_num ; i++){
        groups.push([]);
    }

    console.log(groups);

    // start to mix
    while(to_mix.length > 0){
        let item = to_mix.pop();
        console.log("sorting "+item);
        // se il gruppo che sto guardando non ha la configurazione dell'item passato allora inserisco l'item, altrimenti sposto l'item nella lista dei duplicati
        if(!hasConfig(groups[current_group], item)){
            groups[current_group].push(item);
            // aggiorno l'indice
            current_group = updateIndex(current_group);
            console.log(current_group);
        }
        else
            duplicates.push(item);

    }

    // a questo punto smisto i duplicati:
    console.log(groups);
    console.log("duplicates");
    console.log(duplicates);
}

function updateIndex(i){
    return (i+1>=group_num)? 0 : i+1;

}*/
