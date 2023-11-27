export declare class ChemElement {
    private mass;
    private nAtomic;
    atomsMols: number;
    private constructor();
    static loadFromJSON(data: ChemElementSchema): ChemElement | undefined;
    getNAtomic(): number;
    static factory(element: string, quant?: number): ChemElement;
    getMass(): number;
    getTotalMass(): number;
    clone(): ChemElement;
}
export declare class ChemMolecule {
    private elements;
    private condensedFormula;
    mols: number;
    getElements(): ChemElement[];
    static loadFromJSON(data: ChemMoleculeSchema): ChemMolecule;
    getTotalElements(): ChemMolecule;
    mult(num: number): ChemMolecule;
    sum(another: ChemMolecule): ChemMolecule;
    isEqual(to: ChemMolecule): boolean;
    getCondesedFormula(): string;
    setCondensedFormula(condensedFormula: string): boolean;
    clone(): ChemMolecule;
    getMass(): number;
    getTotalMass(): number;
    private getSumAtomicNumbers;
}
export declare class ChemReaction {
    private leftSide;
    private rightSide;
    name: string;
    id: number;
    constructor(name: string);
    setLeftSide(molecules: ChemMolecule[]): void;
    getLeftSide(): ChemMolecule[];
    setRightSide(molecules: ChemMolecule[]): void;
    getRightSide(): ChemMolecule[];
    clone(): ChemReaction;
    isBalanced(): boolean;
    private sumMolecules;
    static loadReactionId(id: number): ChemReaction | undefined;
    static loadReactionPos(index: number): ChemReaction | undefined;
    storageReaction(): boolean;
    mult(num: number): ChemReaction;
    sumRightSide(): ChemMolecule;
    sumLeftSide(): ChemMolecule;
}
interface ChemElementSchema {
    mass: number;
    nAtomic: number;
    atomsMols: number;
}
interface ChemMoleculeSchema {
    elements: ChemElementSchema[];
    condensedFormula: string;
    mols: number;
}
export {};
