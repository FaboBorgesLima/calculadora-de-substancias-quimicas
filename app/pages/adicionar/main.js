//@ts-check
import { ChemMolecule, ChemReaction } from "../../service/index.js";

/**
 * @returns {[HTMLCollectionOf<HTMLInputElement>,HTMLCollectionOf<HTMLInputElement>,HTMLCollectionOf<HTMLInputElement>,HTMLCollectionOf<HTMLInputElement>] | undefined}
 */
function getReagentsQuantProductsQuantHTML() {
	const reagentsHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("reagent")
			),
		reagentsQuantHTMLElements =
			/** @type {HTMLCollectionOf<HTMLInputElement> | null} */ (
				document.getElementsByClassName("reagent-quant")
			),
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

		return;
	}

	if (
		reagentsHTMLElements.length != reagentsQuantHTMLElements.length ||
		productsHTMLElements.length != productsQuantHTMLElements.length
	) {
		console.error("Reagents or products dont have enough quant elements");

		return;
	}

	return [
		reagentsHTMLElements,
		reagentsQuantHTMLElements,
		productsHTMLElements,
		productsQuantHTMLElements,
	];
}

/**
 * @returns {[ChemMolecule[],ChemMolecule[],boolean]}
 */
function getAndValidateChem() {
	const reagents = [],
		products = [];

	const tryGetElements = getReagentsQuantProductsQuantHTML();

	if (!tryGetElements) return [reagents, products, false];

	const [
		reagentsHTMLElements,
		reagentsQuantHTMLElements,
		productsHTMLElements,
		productsQuantHTMLElements,
	] = tryGetElements;

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
	const reactionTitleHTMLElement = /** @type {HTMLInputElement | null} */ (
			document.getElementById("reaction-title")
		),
		modalHTMLElement = document.getElementById("modal"),
		modalHTMLText = document.getElementById("modal-text");

	if (!reactionTitleHTMLElement) {
		console.error("Title not found");

		return;
	}

	if (!modalHTMLText) {
		console.error("Modal text not found");

		return;
	}

	if (!modalHTMLElement) {
		console.error("Modal not found");

		return;
	}

	// @ts-ignore
	const modal = new bootstrap.Modal(modalHTMLElement);

	if (reactionTitleHTMLElement.value.length < 3) {
		modalHTMLText.textContent = "Titulo deve conter no minimo 3 elementos!";

		modal.show();

		return;
	}

	const [reagents, products, chemAreValid] = getAndValidateChem();

	if (!chemAreValid) {
		modalHTMLText.textContent = "Quimicos inválidos!";

		modal.show();

		return;
	}

	const reaction = new ChemReaction(reactionTitleHTMLElement.value);

	reaction.setLeftSide(reagents);

	reaction.setRightSide(products);

	if (!reaction.isBalanced()) {
		modalHTMLText.textContent = "Formulas não balancedas!";

		modal.show();

		return;
	}
});
