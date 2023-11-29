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
    private name;
    id: number;
    readonly MAX_NAME_CHAR = 36;
    readonly MIN_NAME_CHAR = 3;
    constructor(name: string);
    setName(name: string): boolean;
    isValidName(name: string): boolean;
    setLeftSide(molecules: ChemMolecule[]): void;
    getLeftSide(): ChemMolecule[];
    setRightSide(molecules: ChemMolecule[]): void;
    getRightSide(): ChemMolecule[];
    clone(): ChemReaction;
    isBalanced(): boolean;
    private sumMolecules;
    static loadReactionId(id: number): ChemReaction | undefined;
    static loadReactionPos(index: number): ChemReaction | undefined;
    static quickLoadFromPos(index: number): ChemReactionSchema | undefined;
    static quickLoadFromId(id: number): ChemReactionSchema | undefined;
    static schemaToString(schema: ChemReactionSchema): {
        reaction: string;
        name: string;
    };
    storageReaction(): boolean;
    mult(num: number): ChemReaction;
    sumRightSide(): ChemMolecule;
    sumLeftSide(): ChemMolecule;
    toString(): string;
}
export interface ChemElementSchema {
    mass: number;
    nAtomic: number;
    atomsMols: number;
}
export interface ChemMoleculeSchema {
    elements: ChemElementSchema[];
    condensedFormula: string;
    mols: number;
}
export interface ChemReactionSchema {
    leftSide: ChemMoleculeSchema[];
    rightSide: ChemMoleculeSchema[];
    name: string;
    id: number;
}
