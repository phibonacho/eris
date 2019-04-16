import './PersonClass';
export default class GroupClass {
    constructor(){
        this.items = [];
        this.stats = {
            m : 0,
            language : {
                /*
                it : 0.2,
                de : 0.3,
                ...
                */
            },
            localCenter :{
                /*
                Genova : 0.1,
                Roma: 0.2
                ...
                */
            }
        }
    }

    // higherStats() {
    //     let max = 0, tmp;
    //     for(let stat in this.stats){
    //         if(this.stats[stat]>max) tmp = this.stats[stat];
    //     }
    // }

    add(person){
        this.items.push(person);

        // aggiorno le statistiche esistenti
        for (let statnames in this.stats){
            if(typeof this.stats[statnames] === 'object'){
                for(let prop in this.stats[statnames]){
                    this.updatePercentage(statnames, prop);
                }
            }
            else{
                // caso m:
                let tmp = 0;
                for(let i = 0; i<this.items.length; i++){
                    if(this.items[i].sex === 'M') tmp++;
                }
                this.stats.m = tmp/this.items.length;
            }

        }

        // aggiungo, se non esistente, la statistica della lingua
        if(!this.stats.language.hasOwnProperty(person.language)){
            this.stats.language[person.language] = 1/this.items.length;
        }


        // aggiungo la statistica del centro locale
        if(!this.stats.localCenter.hasOwnProperty(person.localCenter)){
            this.stats.localCenter[person.localCenter] = 1/this.items.length;
        }
    }

    mostSpokenLanguage(){
        return this.higher('language');
    }

    lessSpokenLanguage(){
        return this.lower('language');
    }

    mostAttendedCenter(){
        return this.higher('localCenter')
    }

    lessAttendedCenter(){
        return this.lower('localCenter');
    }

    higher(prop){
        let tmp = [], max = 0;
        for(let l in this.stats[prop]){
            if(this.stats[prop][l]>max){
                if(tmp.length > 0) tmp = [];
                tmp.push(l);
                max = this.stats[prop][l];
            } else if(this.stats[prop][l]===max){
                tmp.push(l);
            }
        }
        return tmp;
    }

    lower(prop){
        let tmp = [], min = 1;
        for(let l in this.stats[prop]){
            if(this.stats[prop][l]<min){
                if(tmp.length > 0) tmp = [];
                tmp.push(l);
                min = this.stats[prop][l];
            } else if(this.stats[prop][l]===min){
                tmp.push(l);
            }
        }
        return tmp;
    }

    updatePercentage(statname, flag){
        let tmp = 0;
        for(let i = 0; i<this.items.length; i++){
            if(this.items[i][statname] === flag) tmp++;
        }
        this.stats[statname][flag] = tmp/this.items.length;
    }

    personSpeaking(lang){
        let tmp = [];
        for(let j = 0; j<lang.length; j++)
            for(let i = 0; i<this.items.length; i++){
                if(this.items[i].language === lang[j]){
                    tmp.push(this.items[i])
                }
            }
        return tmp;
    }

}