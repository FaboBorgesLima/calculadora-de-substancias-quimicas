//@ts-check
import { ChemMolecule, ChemReaction } from "../../service/index.js";
/**
 * @returns {[ChemMolecule[],ChemMolecule[],boolean]}
 */
function verifyAllChemicals() {
	const reagents = [],
		reagentsHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("reagent")
			),
		reagentsQuantHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("reagent-quant")
			),
		products = [],
		productsHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("product")
			),
		productsQuantHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("product-quant")
			);

	if (
		!(
			productsHTMLElements &&
			productsQuantHTMLElements &&
			reagentsHTMLElements &&
			reagentsQuantHTMLElements
		)
	) {
		console.error(
			"No HTML inputs for products,products-quant,reagents and reagents-quant"
		);

		return [reagents, products, false];
	}

	if (
		reagentsHTMLElements.length != reagentsQuantHTMLElements.length ||
		productsHTMLElements.length != productsQuantHTMLElements.length
	) {
		console.error("Reagents or products dont have enough quant elements");

		return [reagents, products, false];
	}

	for (let i = 0; i < reagentsHTMLElements.length; i++) {
		const newReagent = new ChemMolecule();
		if (!newReagent.setCondensedFormula(reagentsHTMLElements[i].value))
			return [reagents, products, false];

		let newQuant = parseFloat(reagentsQuantHTMLElements[i].value);

		if (isNaN(newQuant) || newQuant <= 0) {
			reagentsQuantHTMLElements[i].value = "1";

			newQuant = 1;
		}

		newReagent.mols = newQuant;

		reagents.push(newReagent);
	}

	for (let i = 0; i < productsHTMLElements.length; i++) {
		const newProduct = new ChemMolecule();

		if (!newProduct.setCondensedFormula(productsHTMLElements[i].value))
			return [reagents, products, false];

		let newQuant = parseFloat(productsQuantHTMLElements[i].value);

		if (isNaN(newQuant) || newQuant <= 0) {
			productsQuantHTMLElements[i].value = "1";

			newQuant = 1;
		}

		newProduct.mols = newQuant;

		products.push(newProduct);
	}

	return [reagents, products, true];
}

const addButton = document.getElementById("add");

addButton?.addEventListener("click", () => {
	const [reagents, products, allIsFine] = verifyAllChemicals();

	if (!allIsFine) return;

	const reactionTitleHTMLElement = /** @type {HTMLInputElement | null} */ (
		document.getElementById("reaction-title")
	);

	if (!reactionTitleHTMLElement) {
		console.error("Title not found");

		return;
	}

	if (reactionTitleHTMLElement.value.length < 3) {
		console.error("Title not long enough");

		return;
	}

	const reaction = new ChemReaction(reactionTitleHTMLElement.value);

	reaction.setLeftSide(reagents);

	reaction.setRightSide(products);

	console.log(reaction.isBalanced());
});
