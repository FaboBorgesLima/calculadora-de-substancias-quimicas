"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChemElement = void 0;
var ChemElement = /** @class */ (function () {
    function ChemElement(nAtomic, mass, quant) {
        this.mass = 1;
        this.nAtomic = 1;
        this.atomsMols = 1;
        this.nAtomic = nAtomic;
        this.mass = mass;
        quant = quant ? quant : 1;
        quant = quant > 0 ? quant : 1;
        this.atomsMols = quant;
    }
    ChemElement.prototype.getNAtomic = function () {
        return this.nAtomic;
    };
    ChemElement.factory = function (element, quant) {
        switch (element) {
            //col 1
            case "H": return new ChemElement(1, 1, quant);
            case "Li": return new ChemElement(3, 6.9, quant);
            case "Na": return new ChemElement(11, 23, quant);
            case "K": return new ChemElement(19, 39, quant);
            //col 2
            case "Be": return new ChemElement(4, 9, quant);
            case "Mg": return new ChemElement(12, 24, quant);
            case "Ca": return new ChemElement(20, 40, quant);
            //col 3
            case "B": return new ChemElement(5, 10.8, quant);
            case "Al": return new ChemElement(13, 26.98, quant);
            //col 4
            case "C": return new ChemElement(6, 12, quant);
            case "Si": return new ChemElement(14, 28.08, quant);
            //col 5
            case "N": return new ChemElement(7, 14, quant);
            case "P": return new ChemElement(15, 30.9, quant);
            //col 6
            case "O": return new ChemElement(8, 16, quant);
            case "S": return new ChemElement(16, 32, quant);
            //col 7
            case "F": return new ChemElement(9, 19, quant);
            case "Cl": return new ChemElement(17, 35.5, quant);
            case "Br": return new ChemElement(35, 79.9, quant);
            case "I": return new ChemElement(53, 126.9, quant);
        }
        return new ChemElement(1, 1, quant);
    };
    ChemElement.prototype.getMass = function () {
        return this.mass;
    };
    ChemElement.prototype.getTotalMass = function () {
        return this.mass * this.atomsMols;
    };
    ChemElement.prototype.clone = function () {
        var clone = new ChemElement(this.nAtomic, this.mass, this.atomsMols);
        return clone;
    };
    return ChemElement;
}());
exports.ChemElement = ChemElement;
//# sourceMappingURL=chemElement.js.map