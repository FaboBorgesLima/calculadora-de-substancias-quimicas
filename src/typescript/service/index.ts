export class ChemElement {
	private mass: number = 1;

	private nAtomic: number = 1;

	public atomsMols: number = 1;

	private constructor(nAtomic: number, mass: number, quant?: number) {
		this.nAtomic = nAtomic;

		this.mass = mass;

		quant = quant ? quant : 1;

		quant = quant > 0 ? quant : 1;

		this.atomsMols = quant;
	}

	static loadFromJSON(data: ChemElementSchema): ChemElement | undefined {
		if (!(data.nAtomic && data.mass && data.atomsMols))
			return new ChemElement(1, 1, 1);

		return new ChemElement(data.nAtomic, data.mass, data.atomsMols);
	}

	public getNAtomic(): number {
		return this.nAtomic;
	}

	static factory(element: string, quant?: number): ChemElement {
		switch (element) {
			//col 1
			case "H":
				return new ChemElement(1, 1.008, quant);
			case "Li":
				return new ChemElement(3, 6.941, quant);
			case "Na":
				return new ChemElement(11, 22.99, quant);
			case "K":
				return new ChemElement(19, 39.098, quant);
			case "Rb":
				return new ChemElement(37, 85.468, quant);
			case "Cs":
				return new ChemElement(55, 132.905, quant);
			//col 2
			case "Be":
				return new ChemElement(4, 9.012, quant);
			case "Mg":
				return new ChemElement(12, 24.305, quant);
			case "Ca":
				return new ChemElement(20, 40.078, quant);
			case "Sr":
				return new ChemElement(38, 87.62, quant);
			case "Ba":
				return new ChemElement(56, 137.327, quant);
			// transition
			case "Ti":
				return new ChemElement(22, 47.867, quant);
			case "Cr":
				return new ChemElement(24, 51.996, quant);
			case "Mn":
				return new ChemElement(25, 54.938, quant);
			case "Fe":
				return new ChemElement(26, 55.845, quant);
			case "Co":
				return new ChemElement(27, 58.933, quant);
			case "Ni":
				return new ChemElement(28, 58.693, quant);
			case "Cu":
				return new ChemElement(29, 63.546, quant);
			case "Zn":
				return new ChemElement(30, 65.409, quant);
			//col 3
			case "B":
				return new ChemElement(5, 10.8, quant);
			case "Al":
				return new ChemElement(13, 26.98, quant);
			case "Ga":
				return new ChemElement(31, 69.723, quant);
			case "In":
				return new ChemElement(49, 114.818, quant);
			case "Tl":
				return new ChemElement(81, 204.383, quant);
			//col 4
			case "C":
				return new ChemElement(6, 12, quant);
			case "Si":
				return new ChemElement(14, 28.08, quant);
			case "Ge":
				return new ChemElement(32, 72.64, quant);
			case "Sn":
				return new ChemElement(50, 118.71, quant);
			case "Pb":
				return new ChemElement(82, 207.2, quant);
			//col 5
			case "N":
				return new ChemElement(7, 14.007, quant);
			case "P":
				return new ChemElement(15, 30.974, quant);
			case "As":
				return new ChemElement(33, 74.922, quant);
			case "Sb":
				return new ChemElement(51, 121.76, quant);
			case "Bi":
				return new ChemElement(83, 208.98, quant);
			//col 6
			case "O":
				return new ChemElement(8, 16, quant);
			case "S":
				return new ChemElement(16, 32, quant);
			case "Se":
				return new ChemElement(34, 78.96, quant);
			//col 7
			case "F":
				return new ChemElement(9, 19, quant);
			case "Cl":
				return new ChemElement(17, 35.5, quant);
			case "Br":
				return new ChemElement(35, 79.9, quant);
			case "I":
				return new ChemElement(53, 126.9, quant);
		}

		return new ChemElement(1, 1, quant);
	}

	public getMass(): number {
		return this.mass;
	}

	public getTotalMass(): number {
		return this.mass * this.atomsMols;
	}

	public clone(): ChemElement {
		const clone = new ChemElement(this.nAtomic, this.mass, this.atomsMols);

		return clone;
	}
}
export class ChemMolecule {
	private elements: ChemElement[] = [];

	private condensedFormula: string = "";

	public mols: number = 1;

	public getElements(): ChemElement[] {
		return this.elements;
	}

	static loadFromJSON(data: ChemMoleculeSchema): ChemMolecule {
		const molecule = new ChemMolecule();

		for (let i: number = 0; i < data.elements.length; i++)
			molecule.elements[i] = ChemElement.loadFromJSON(data.elements[i]);

		molecule.condensedFormula = data.condensedFormula;

		molecule.mols = data.mols;

		return molecule;
	}

	public getTotalElements(): ChemMolecule {
		let totalElements: ChemMolecule = this.clone();

		totalElements = totalElements.mult(totalElements.mols);

		totalElements.mols = 1;

		return totalElements;
	}

	public mult(num: number): ChemMolecule {
		const mult = this.clone();

		for (let i: number = 0; i < mult.elements.length; i++) {
			mult.elements[i].atomsMols *= num;
		}

		return mult;
	}

	public sum(another: ChemMolecule): ChemMolecule {
		const mainMolecule: ChemMolecule = this.clone().getTotalElements(),
			secondaryMolecule: ChemMolecule = another.clone().getTotalElements();
		const initialSecondaryLength: number = secondaryMolecule.elements.length;

		for (let i: number = 0; i < initialSecondaryLength; i++) {
			const indexOfObject = mainMolecule.elements.findIndex(
				(el) => el.getNAtomic() == secondaryMolecule.elements[i].getNAtomic()
			);

			if (indexOfObject < 0) {
				mainMolecule.elements.push(secondaryMolecule.elements[i]);

				continue;
			}

			mainMolecule.elements[indexOfObject].atomsMols +=
				secondaryMolecule.elements[i].atomsMols;
		}

		return mainMolecule;
	}

	public isEqual(to: ChemMolecule): boolean {
		if (to.elements.length != this.elements.length) return false;

		const mass1: number = to.getTotalMass(),
			mass2: number = this.getTotalMass(),
			biggerMass: number = Math.max(mass1, mass2),
			lowerMass: number = Math.min(mass1, mass2),
			diffPercentage: number = (biggerMass - lowerMass) / biggerMass;

		if (diffPercentage > 1.5) return false;

		if (to.getSumAtomicNumbers() != this.getSumAtomicNumbers()) return false;

		return true;
	}

	public getCondesedFormula(): string {
		return this.condensedFormula;
	}

	public setCondensedFormula(condensedFormula: string): boolean {
		const regex: RegExp =
			/((Li)|(Na)|(Rb)|(Cs)|(Be)|(Mg)|(Ca)|(Sr)|(Ba)|(Ti)|(Cr)|(Mn)|(Fe)|(Co)|(Ni)|(Cu)|(Zn)|(Al)|(Ga)|(In)|(Tl)|(Si)|(Ge)|(Sn)|(Pb)|(As)|(Sb)|(Bi)|(Se)|(Cl)|(Br)|H|K|B|C|N|P|O|S|F|I)[0-9]*|\(|\)[0-9]*|\)/g;

		if (!regex.test(condensedFormula)) return false;

		if (condensedFormula.replace(regex, "")) return false;

		let elementsList = condensedFormula.match(regex);

		if (!elementsList) return false;

		this.condensedFormula = condensedFormula;

		this.elements =
			StringToMoleculeConversor.turnStringArrayToElementArray(elementsList);

		return true;
	}

	public clone(): ChemMolecule {
		const clone = new ChemMolecule();

		clone.condensedFormula = this.condensedFormula;

		for (let i: number = 0; i < this.elements.length; i++)
			clone.elements[i] = this.elements[i].clone();

		clone.mols = this.mols;

		return clone;
	}

	public getMass(): number {
		let mass: number = 0;

		for (const el of this.elements) {
			mass += el.getTotalMass();
		}

		return mass;
	}

	public getTotalMass(): number {
		return this.getMass() * this.mols;
	}

	private getSumAtomicNumbers(): number {
		let sum: number = 0;

		for (let i: number = 0; i < this.elements.length; i++)
			sum += this.elements[i].getNAtomic() * this.elements[i].atomsMols;

		return sum;
	}
}

class StringToMoleculeConversor {
	static turnStringArrayToElementArray(
		elementsList: RegExpMatchArray
	): ChemElement[] {
		const parenthesisList: number[] = [1],
			newElementArray: ChemElement[] = [];
		let parenthesisMult: number = 1;

		let data = {
			param: "",
			times: 1,
			parenthesisList: parenthesisList,
			parenthesisMult: parenthesisMult,
			chemList: newElementArray,
		};

		while (elementsList.length > 0) {
			const el = elementsList.pop();

			if (!el) return newElementArray;

			const [param, times] = this.splitStringNumber(el);

			data.param = param;

			data.times = times;

			data = this.switchBetweenConversionOptions(data);
		}

		return data.chemList;
	}

	private static multiplyValuesOfArray(nums: number[]): number {
		let mult: number = 1;

		for (let i: number = 0; i < nums.length; i++) mult *= nums[i];

		return mult;
	}

	private static splitStringNumber(str: string): [string, number] {
		const onlyStr = str.replace(/[0-9]/g, "");

		let onlyNumber: number = parseInt(str.replace(/[^0-9]/g, ""));

		onlyNumber = onlyNumber > 0 ? onlyNumber : 1;

		return [onlyStr, onlyNumber];
	}

	private static switchBetweenConversionOptions(data: {
		param: string;
		times: number;
		parenthesisList: number[];
		parenthesisMult: number;
		chemList: ChemElement[];
	}): {
		param: string;
		times: number;
		parenthesisList: number[];
		parenthesisMult: number;
		chemList: ChemElement[];
	} {
		switch (data.param) {
			case "(":
				data.parenthesisList.pop();

				data.parenthesisMult = this.multiplyValuesOfArray(data.parenthesisList);

				return data;

			case ")":
				data.parenthesisList.push(data.times);

				data.parenthesisMult = this.multiplyValuesOfArray(data.parenthesisList);

				return data;
		}

		const newElement: ChemElement = ChemElement.factory(
			data.param,
			data.times * data.parenthesisMult
		);

		for (let i: number = 0; i < data.chemList.length; i++)
			if (data.chemList[i].getNAtomic() == newElement.getNAtomic()) {
				data.chemList[i].atomsMols += newElement.atomsMols;

				return data;
			}

		data.chemList.push(newElement);

		return data;
	}
}
export class ChemReaction {
	private leftSide: ChemMolecule[] = [];
	private rightSide: ChemMolecule[] = [];
	private name: string = "";
	public id: number = 0;
	public readonly MAX_NAME_CHAR = 36;
	public static readonly MAX_NAME_CHAR = 36;
	public readonly MIN_NAME_CHAR = 3;
	public static readonly MIN_NAME_CHAR = 3;

	public constructor(name: string) {
		this.name = name;
	}

	public setName(name: string): boolean {
		if (!this.isValidName(name)) return false;

		this.name = name;

		return true;
	}

	public getName(): string {
		return this.name;
	}

	public isValidName(name: string): boolean {
		return (
			name.length >= this.MIN_NAME_CHAR || name.length <= this.MAX_NAME_CHAR
		);
	}

	public setLeftSide(molecules: ChemMolecule[]): void {
		this.leftSide = molecules;
	}

	public getLeftSide(): ChemMolecule[] {
		return this.leftSide;
	}

	public setRightSide(molecules: ChemMolecule[]): void {
		this.rightSide = molecules;
	}

	public getRightSide(): ChemMolecule[] {
		return this.rightSide;
	}

	public clone(): ChemReaction {
		const clone = new ChemReaction(this.name);

		for (let i: number = 0; i < this.leftSide.length; i++)
			clone.leftSide[i] = this.leftSide[i].clone();

		for (let i: number = 0; i < this.rightSide.length; i++)
			clone.rightSide[i] = this.rightSide[i].clone();

		return clone;
	}

	public isBalanced(): boolean {
		let sumLeftSide = this.sumMolecules(this.leftSide),
			sumRightSide = this.sumMolecules(this.rightSide);

		return sumLeftSide.isEqual(sumRightSide);
	}

	private sumMolecules(molecules: ChemMolecule[]): ChemMolecule {
		let sum = new ChemMolecule();

		for (let i: number = 0; i < molecules.length; i++)
			sum = sum.sum(molecules[i]);

		return sum;
	}

	public static loadReactionId(id: number): ChemReaction | undefined {
		const tryGetItem: ChemReactionSchema | undefined = JSON.parse(
			localStorage.getItem(id.toString())
		);

		if (!tryGetItem) return;

		const reaction = new ChemReaction(tryGetItem.name);

		reaction.id = tryGetItem.id;

		for (let i: number = 0; i < tryGetItem.leftSide.length; i++)
			reaction.leftSide[i] = ChemMolecule.loadFromJSON(tryGetItem.leftSide[i]);

		for (let i: number = 0; i < tryGetItem.rightSide.length; i++)
			reaction.rightSide[i] = ChemMolecule.loadFromJSON(
				tryGetItem.rightSide[i]
			);

		return reaction;
	}

	public static loadReactionPos(index: number): ChemReaction | undefined {
		if (index >= localStorage.length) return;

		const tryGetItemID: string | undefined = localStorage.key(index);

		if (!tryGetItemID) return;

		return ChemReaction.loadReactionId(parseInt(tryGetItemID));
	}
	public static quickLoadFromPos(
		index: number
	): ChemReactionSchema | undefined {
		if (index >= localStorage.length) return;

		const tryGetItemID: string | undefined = localStorage.key(index);

		if (!tryGetItemID) return;

		return ChemReaction.quickLoadFromId(parseInt(tryGetItemID));
	}

	public static quickLoadFromId(id: number): ChemReactionSchema | undefined {
		const tryGetItem = localStorage.getItem(id.toString());

		if (!tryGetItem) return;

		const parseJson: ChemReactionSchema = JSON.parse(tryGetItem);

		return parseJson;
	}

	public static schemaToString(schema: ChemReactionSchema): {
		reaction: string;
		name: string;
	} {
		let reaction: string = "",
			name: string = schema.name;

		for (let i: number = 0; i < schema.leftSide.length - 1; i++)
			reaction +=
				schema.leftSide[i].mols +
				" " +
				schema.leftSide[i].condensedFormula +
				" + ";

		reaction +=
			schema.leftSide[schema.leftSide.length - 1].mols +
			" " +
			schema.leftSide[schema.leftSide.length - 1].condensedFormula +
			" -> ";

		for (let i: number = 0; i < schema.rightSide.length - 1; i++)
			reaction +=
				schema.rightSide[i].mols +
				" " +
				schema.rightSide[i].condensedFormula +
				" + ";
		reaction +=
			schema.rightSide[schema.rightSide.length - 1].mols +
			" " +
			schema.rightSide[schema.rightSide.length - 1].condensedFormula;

		return { reaction: reaction, name: name };
	}

	public storageReaction(): boolean {
		if (!this.isBalanced()) return false;

		if (!this.id) {
			const lastID = localStorage.key(localStorage.length - 1);
			let idAsInt = parseInt(lastID);

			if (isNaN(idAsInt)) idAsInt = 0;

			this.id = idAsInt + 1;
		}

		localStorage.setItem(this.id.toString(), JSON.stringify(this));

		return true;
	}

	public mult(num: number): ChemReaction {
		const mult = this.clone();

		for (let i: number = 0; i < mult.leftSide.length; i++)
			mult.leftSide[i] = mult.leftSide[i].mult(num);

		for (let i: number = 0; i < mult.rightSide.length; i++)
			mult.rightSide[i] = mult.rightSide[i].mult(num);

		return mult;
	}

	public sumRightSide(): ChemMolecule {
		return this.sumMolecules(this.rightSide);
	}

	public sumLeftSide(): ChemMolecule {
		return this.sumMolecules(this.leftSide);
	}

	public toString(): string {
		let str: string = "";

		for (let i: number = 0; i < this.leftSide.length - 1; i++)
			str +=
				this.leftSide[i].mols +
				" " +
				this.leftSide[i].getCondesedFormula() +
				" + ";

		str +=
			this.leftSide[this.leftSide.length - 1].mols +
			" " +
			this.leftSide[this.leftSide.length - 1].getCondesedFormula() +
			" -> ";

		for (let i: number = 0; i < this.rightSide.length - 1; i++)
			str +=
				this.rightSide[i].mols +
				" " +
				this.rightSide[i].getCondesedFormula() +
				" + ";

		str +=
			this.rightSide[this.rightSide.length - 1].mols +
			" " +
			this.rightSide[this.rightSide.length - 1].getCondesedFormula();

		return str;
	}
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
