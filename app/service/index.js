export class ChemElement {
    constructor(nAtomic, mass, quant) {
        this.mass = 1;
        this.nAtomic = 1;
        this.atomsMols = 1;
        this.nAtomic = nAtomic;
        this.mass = mass;
        quant = quant ? quant : 1;
        quant = quant > 0 ? quant : 1;
        this.atomsMols = quant;
    }
    getNAtomic() {
        return this.nAtomic;
    }
    static factory(element, quant) {
        switch (element) {
            case "H": return new ChemElement(1, 1, quant);
            case "Li": return new ChemElement(3, 6.9, quant);
            case "Na": return new ChemElement(11, 23, quant);
            case "K": return new ChemElement(19, 39, quant);
            case "Be": return new ChemElement(4, 9, quant);
            case "Mg": return new ChemElement(12, 24, quant);
            case "Ca": return new ChemElement(20, 40, quant);
            case "B": return new ChemElement(5, 10.8, quant);
            case "Al": return new ChemElement(13, 26.98, quant);
            case "C": return new ChemElement(6, 12, quant);
            case "Si": return new ChemElement(14, 28.08, quant);
            case "N": return new ChemElement(7, 14, quant);
            case "P": return new ChemElement(15, 30.9, quant);
            case "O": return new ChemElement(8, 16, quant);
            case "S": return new ChemElement(16, 32, quant);
            case "F": return new ChemElement(9, 19, quant);
            case "Cl": return new ChemElement(17, 35.5, quant);
            case "Br": return new ChemElement(35, 79.9, quant);
            case "I": return new ChemElement(53, 126.9, quant);
        }
        return new ChemElement(1, 1, quant);
    }
    getMass() {
        return this.mass;
    }
    getTotalMass() {
        return this.mass * this.atomsMols;
    }
    clone() {
        const clone = new ChemElement(this.nAtomic, this.mass, this.atomsMols);
        return clone;
    }
}
export class ChemMolecule {
    constructor() {
        this.elements = [];
        this.condensedFormula = "";
        this.mols = 1;
    }
    getElements() {
        return this.elements;
    }
    getTotalElements() {
        let totalElements = this.clone();
        totalElements = totalElements.mult(totalElements.mols);
        totalElements.mols = 1;
        return totalElements;
    }
    mult(num) {
        const mult = this.clone();
        for (let i = 0; i < mult.elements.length; i++) {
            mult.elements[i].atomsMols *= num;
        }
        return mult;
    }
    sum(another) {
        const mainMolecule = this.clone().getTotalElements(), secondaryMolecule = another.clone().getTotalElements();
        const initialSecondaryLength = secondaryMolecule.elements.length;
        for (let i = 0; i < initialSecondaryLength; i++) {
            const indexOfObject = mainMolecule.elements.findIndex(el => el.getNAtomic() == secondaryMolecule.elements[i].getNAtomic());
            if (indexOfObject < 0) {
                mainMolecule.elements.push(secondaryMolecule.elements[i]);
                continue;
            }
            mainMolecule.elements[indexOfObject].atomsMols += secondaryMolecule.elements[i].atomsMols;
        }
        return mainMolecule;
    }
    isEqual(to) {
        if (to.elements.length != this.elements.length)
            return false;
        const mass1 = to.getTotalMass(), mass2 = this.getTotalMass(), biggerMass = Math.max(mass1, mass2), lowerMass = Math.min(mass1, mass2), diffPercentage = (biggerMass - lowerMass) / biggerMass;
        if (diffPercentage > 1.5)
            return false;
        if (to.getSumAtomicNumbers() != this.getSumAtomicNumbers())
            return false;
        return true;
    }
    getCondesedFormula() {
        return this.condensedFormula;
    }
    setCondensedFormula(condensedFormula) {
        const regex = /((Si)|(Li)|(Na)|(Be)|(Mg)|(Ca)|(Al)|(Cl)|(Br)|K|B|H|C|N|P|O|S|F|I)[0-9]*|\(|\)[0-9]*|\)/g;
        if (!regex.test(condensedFormula))
            return false;
        let elementsList = condensedFormula.match(regex);
        if (!elementsList)
            return false;
        this.condensedFormula = condensedFormula;
        this.elements = StringToMoleculeConversor.turnStringArrayToElementArray(elementsList);
        return true;
    }
    clone() {
        const clone = new ChemMolecule;
        clone.condensedFormula = this.condensedFormula;
        for (let i = 0; i < this.elements.length; i++)
            clone.elements[i] = this.elements[i].clone();
        clone.mols = this.mols;
        return clone;
    }
    getMass() {
        let mass = 0;
        for (const el of this.elements) {
            mass += el.getTotalMass();
        }
        return mass;
    }
    getTotalMass() {
        return this.getMass() * this.mols;
    }
    getSumAtomicNumbers() {
        let sum = 0;
        for (let i = 0; i < this.elements.length; i++)
            sum += this.elements[i].getNAtomic() * this.elements[i].atomsMols;
        return sum;
    }
}
class StringToMoleculeConversor {
    static turnStringArrayToElementArray(elementsList) {
        const parenthesisList = [1], newElementArray = [];
        let parenthesisMult = 1;
        let data = {
            param: "",
            times: 1,
            parenthesisList: parenthesisList,
            parenthesisMult: parenthesisMult,
            chemList: newElementArray
        };
        while (elementsList.length > 0) {
            const el = elementsList.pop();
            if (!el)
                return newElementArray;
            const [param, times] = this.splitStringNumber(el);
            data.param = param;
            data.times = times;
            data = this.switchBetweenConversionOptions(data);
        }
        return data.chemList;
    }
    static multiplyValuesOfArray(nums) {
        let mult = 1;
        for (let i = 0; i < nums.length; i++)
            mult *= nums[i];
        return mult;
    }
    static splitStringNumber(str) {
        const onlyStr = str.replace(/[0-9]/g, "");
        let onlyNumber = parseInt(str.replace(/[^0-9]/, ""));
        onlyNumber = onlyNumber > 0 ? onlyNumber : 1;
        return [onlyStr, onlyNumber];
    }
    static switchBetweenConversionOptions(data) {
        switch (data.param) {
            case ("("):
                data.parenthesisList.pop();
                data.parenthesisMult = this.multiplyValuesOfArray(data.parenthesisList);
                return data;
            case (")"):
                data.parenthesisList.push(data.times);
                data.parenthesisMult = this.multiplyValuesOfArray(data.parenthesisList);
                return data;
        }
        const newElement = ChemElement.factory(data.param, data.times * data.parenthesisMult);
        for (let i = 0; i < data.chemList.length; i++)
            if (data.chemList[i].getNAtomic() == newElement.getNAtomic()) {
                data.chemList[i].atomsMols += newElement.atomsMols;
                return data;
            }
        data.chemList.push(newElement);
        return data;
    }
}
export class ChemReaction {
    constructor(name) {
        this.leftSide = [];
        this.rightSide = [];
        this.name = "";
        this.name = name;
    }
    setLeftSide(molecules) {
        this.leftSide = molecules;
    }
    getLeftSide() {
        return this.leftSide;
    }
    setRightSide(molecules) {
        this.rightSide = molecules;
    }
    getRightSide() {
        return this.rightSide;
    }
    clone() {
        const clone = new ChemReaction(this.name);
        for (let i = 0; i < this.leftSide.length; i++)
            clone.leftSide[i] = this.leftSide[i].clone();
        for (let i = 0; i < this.rightSide.length; i++)
            clone.rightSide[i] = this.rightSide[i].clone();
        return clone;
    }
    isBalanced() {
        let sumLeftSide = this.sumMolecules(this.leftSide), sumRightSide = this.sumMolecules(this.rightSide);
        return sumLeftSide.isEqual(sumRightSide);
    }
    sumMolecules(molecules) {
        let sum = new ChemMolecule;
        for (let i = 0; i < molecules.length; i++)
            sum = sum.sum(molecules[i]);
        return sum;
    }
    setMolsOnMolecule(index, quant) {
    }
    mult(num) {
        const mult = this.clone();
        for (let i = 0; i < mult.leftSide.length; i++)
            mult.leftSide[i] = mult.leftSide[i].mult(num);
        for (let i = 0; i < mult.rightSide.length; i++)
            mult.rightSide[i] = mult.rightSide[i].mult(num);
        return mult;
    }
    sumRightSide() {
        return this.sumMolecules(this.rightSide);
    }
    sumLeftSide() {
        return this.sumMolecules(this.leftSide);
    }
}
//# sourceMappingURL=index.js.map