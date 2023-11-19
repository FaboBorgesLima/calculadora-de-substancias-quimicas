"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemMolecule = void 0;
var chemElement_1 = require("./chemElement");
var ChemMolecule = /** @class */ (function () {
    function ChemMolecule() {
        this.elements = [];
        this.condensedFormula = "";
        this.mols = 1;
    }
    ChemMolecule.prototype.getElements = function () {
        return this.elements;
    };
    ChemMolecule.prototype.getTotalElements = function () {
        var totalElements = this.clone();
        totalElements = totalElements.mult(totalElements.mols);
        totalElements.mols = 1;
        return totalElements;
    };
    ChemMolecule.prototype.mult = function (num) {
        var mult = this.clone();
        for (var i = 0; i < mult.elements.length; i++) {
            mult.elements[i].atomsMols *= num;
        }
        return mult;
    };
    ChemMolecule.prototype.sum = function (another) {
        var mainMolecule = this.clone().getTotalElements(), secondaryMolecule = another.clone().getTotalElements();
        var initialSecondaryLength = secondaryMolecule.elements.length;
        var _loop_1 = function (i) {
            var indexOfObject = mainMolecule.elements.findIndex(function (el) { return el.getNAtomic() == secondaryMolecule.elements[i].getNAtomic(); });
            if (indexOfObject < 0) {
                mainMolecule.elements.push(secondaryMolecule.elements[i]);
                return "continue";
            }
            mainMolecule.elements[indexOfObject].atomsMols += secondaryMolecule.elements[i].atomsMols;
        };
        for (var i = 0; i < initialSecondaryLength; i++) {
            _loop_1(i);
        }
        return mainMolecule;
    };
    ChemMolecule.prototype.isEqual = function (to) {
        if (to.elements.length != this.elements.length)
            return false;
        var mass1 = to.getTotalMass(), mass2 = this.getTotalMass(), biggerMass = Math.max(mass1, mass2), lowerMass = Math.min(mass1, mass2), diffPercentage = (biggerMass - lowerMass) / biggerMass;
        if (diffPercentage > 1.5)
            return false;
        if (to.getSumAtomicNumbers() != this.getSumAtomicNumbers())
            return false;
        return true;
    };
    ChemMolecule.prototype.getCondesedFormula = function () {
        return this.condensedFormula;
    };
    ChemMolecule.prototype.setCondensedFormula = function (condensedFormula) {
        var regex = /(H|Li|Na|K|Be|Mg|Ca|B|Al|C|Si|N|P|O|S|F|Cl|Br|I)[0-9]*|\(|\)[0-9]*|\)/g;
        if (condensedFormula.replace(regex, "") != "")
            return false;
        var elementsList = condensedFormula.match(regex);
        if (!elementsList)
            return false;
        this.condensedFormula = condensedFormula;
        this.elements = StringToMoleculeConversor.turnStringArrayToElementArray(elementsList);
        return true;
    };
    ChemMolecule.prototype.clone = function () {
        var clone = new ChemMolecule;
        clone.condensedFormula = this.condensedFormula;
        for (var i = 0; i < this.elements.length; i++)
            clone.elements[i] = this.elements[i].clone();
        clone.mols = this.mols;
        return clone;
    };
    ChemMolecule.prototype.getMass = function () {
        var mass = 0;
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var el = _a[_i];
            mass += el.getTotalMass();
        }
        return mass;
    };
    ChemMolecule.prototype.getTotalMass = function () {
        return this.getMass() * this.mols;
    };
    ChemMolecule.prototype.getSumAtomicNumbers = function () {
        var sum = 0;
        for (var i = 0; i < this.elements.length; i++)
            sum += this.elements[i].getNAtomic() * this.elements[i].atomsMols;
        return sum;
    };
    return ChemMolecule;
}());
exports.ChemMolecule = ChemMolecule;
var StringToMoleculeConversor = /** @class */ (function () {
    function StringToMoleculeConversor() {
    }
    StringToMoleculeConversor.turnStringArrayToElementArray = function (elementsList) {
        var parenthesisList = [1], newElementArray = [];
        var parenthesisMult = 1;
        var data = {
            param: "",
            times: 1,
            parenthesisList: parenthesisList,
            parenthesisMult: parenthesisMult,
            chemList: newElementArray
        };
        while (elementsList.length > 0) {
            var el = elementsList.pop();
            if (!el)
                return newElementArray;
            var _a = this.splitStringNumber(el), param = _a[0], times = _a[1];
            data.param = param;
            data.times = times;
            data = this.switchBetweenConversionOptions(data);
        }
        return data.chemList;
    };
    StringToMoleculeConversor.multiplyValuesOfArray = function (nums) {
        var mult = 1;
        for (var i = 0; i < nums.length; i++)
            mult *= nums[i];
        return mult;
    };
    StringToMoleculeConversor.splitStringNumber = function (str) {
        var onlyStr = str.replace(/[0-9]/g, "");
        var onlyNumber = parseInt(str.replace(/[^0-9]/, ""));
        onlyNumber = onlyNumber > 0 ? onlyNumber : 1;
        return [onlyStr, onlyNumber];
    };
    StringToMoleculeConversor.switchBetweenConversionOptions = function (data) {
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
        var newElement = chemElement_1.ChemElement.factory(data.param, data.times * data.parenthesisMult);
        for (var i = 0; i < data.chemList.length; i++)
            if (data.chemList[i].getNAtomic() == newElement.getNAtomic()) {
                data.chemList[i].atomsMols += newElement.atomsMols;
                return data;
            }
        data.chemList.push(newElement);
        return data;
    };
    return StringToMoleculeConversor;
}());
//# sourceMappingURL=chemMolecule.js.map