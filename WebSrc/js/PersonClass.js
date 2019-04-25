export default class PersonClass {
    constructor(name, surname, sex, language, localCenter, program){
        this.name = name;
        this.surname = surname;
        this.sex = sex;
        this.language = language;
        this.localCenter = localCenter;
        this.program = program;
    }

    envelope(array){
        this.name = array[0];
        this.surname = array[1];
        this.sex = array[2];
        this.language = array[3];
        this.localCenter = array[4];
        this.program = array[5];
    }

    equals(person){
        let res = true;
        for(let prop in this){
            res = res && this[prop] === person[prop];
        }
        return res;
    }

    toString(){
        return `\n${this.name}\t\t${this.surname}\t\t${this.sex}\t${this.language}\t\t${this.localCenter}\t\t${this.program}`;
    }

    toCSV(){
        return `${this.name},${this.surname},${this.sex},${this.language},${this.localCenter},${this.program}\n`;
    }
}