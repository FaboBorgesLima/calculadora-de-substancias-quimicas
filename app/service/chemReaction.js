"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemReaction = void 0;
var chemMolecule_1 = require("./chemMolecule");
var ChemReaction = /** @class */ (function () {
    function ChemReaction(name) {
        this.leftSide = [];
        this.rightSide = [];
        this.name = "";
        this.name = name;
    }
    ChemReaction.prototype.setLeftSide = function (molecules) {
        this.leftSide = molecules;
    };
    ChemReaction.prototype.getLeftSide = function () {
        return this.leftSide;
    };
    ChemReaction.prototype.setRightSide = function (molecules) {
        this.rightSide = molecules;
    };
    ChemReaction.prototype.getRightSide = function () {
        return this.rightSide;
    };
    ChemReaction.prototype.clone = function () {
        var clone = new ChemReaction(this.name);
        for (var i = 0; i < this.leftSide.length; i++)
            clone.leftSide[i] = this.leftSide[i].clone();
        for (var i = 0; i < this.rightSide.length; i++)
            clone.rightSide[i] = this.rightSide[i].clone();
        return clone;
    };
    ChemReaction.prototype.isBalanced = function () {
        var sumLeftSide = this.sumMolecules(this.leftSide), sumRightSide = this.sumMolecules(this.rightSide);
        return sumLeftSide.isEqual(sumRightSide);
    };
    ChemReaction.prototype.sumMolecules = function (molecules) {
        var sum = new chemMolecule_1.ChemMolecule;
        for (var i = 0; i < molecules.length; i++)
            sum = sum.sum(molecules[i]);
        return sum;
    };
    ChemReaction.prototype.setMolsOnMolecule = function (index, quant) {
    };
    ChemReaction.prototype.mult = function (num) {
        var mult = this.clone();
        for (var i = 0; i < mult.leftSide.length; i++)
            mult.leftSide[i] = mult.leftSide[i].mult(num);
        for (var i = 0; i < mult.rightSide.length; i++)
            mult.rightSide[i] = mult.rightSide[i].mult(num);
        return mult;
    };
    ChemReaction.prototype.sumRightSide = function () {
        return this.sumMolecules(this.rightSide);
    };
    ChemReaction.prototype.sumLeftSide = function () {
        return this.sumMolecules(this.leftSide);
    };
    return ChemReaction;
}());
exports.ChemReaction = ChemReaction;
//# sourceMappingURL=chemReaction.js.map