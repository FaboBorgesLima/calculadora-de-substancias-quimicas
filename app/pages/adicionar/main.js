//@ts-check
import { ChemMolecule, ChemReaction } from "../../service/index.js";

const addButton = document.getElementById("add");

addButton?.addEventListener("click", () => {
	const reactionTitleHTMLElement = /** @type {HTMLInputElement | null} */ (
		document.getElementById("reaction-title")
	);
	const documentsById = getAndValidateElementsByid([
		"modal-error",
		"modal-error-text",
		"modal-okay",
		"modal-okay-text",
	]);

	if (typeof documentsById == "string") {
		console.error(documentsById);

		return;
	}

	const [
		modalErrorHTMLElement,
		modalErrorHTMLText,
		modalOkayHTMLElement,
		modalOkayHTMLText,
	] = documentsById;

	if (!reactionTitleHTMLElement) return;

	// @ts-ignore
	const modalError = new bootstrap.Modal(modalErrorHTMLElement),
		// @ts-ignore
		modalOkay = new bootstrap.Modal(modalOkayHTMLElement);

	if (reactionTitleHTMLElement.value.length < 3) {
		modalErrorHTMLText.textContent = "Titulo deve conter no minimo letras!";

		modalError.show();

		return;
	}

	const [reagents, products, chemAreValid] = getAndValidateChem();

	if (!chemAreValid) {
		modalErrorHTMLText.textContent = "Quimicos inválidos!";

		modalError.show();

		return;
	}

	const reaction = new ChemReaction(reactionTitleHTMLElement.value);

	let reactionId = sessionStorage.getItem("reaction-id");

	if (reactionId == null) {
		const key = localStorage.key(0);

		if (key) reactionId = (parseInt(key) + 1).toString();
		else reactionId = "1";
	}

	reaction.id = parseInt(reactionId);

	reaction.setLeftSide(reagents);

	reaction.setRightSide(products);

	if (!reaction.isBalanced()) {
		modalErrorHTMLText.textContent = "Formulas não balancedas!";

		modalError.show();

		return;
	}

	reaction.storageReaction();

	const reactionLeftFormulas = [],
		reactionRightFormulas = [];

	for (let i = 0; i < reagents.length; i++)
		reactionLeftFormulas.push(reagents[i].getCondesedFormula());

	for (let i = 0; i < products.length; i++)
		reactionRightFormulas.push(products[i].getCondesedFormula());

	modalOkayHTMLText.textContent = `A sua reação é :${reactionLeftFormulas.join(
		"+"
	)}-> ${reactionRightFormulas.join("+")}`;

	sessionStorage.clear();

	sessionStorage.setItem("reaction-id", reaction.id.toString());

	modalOkay.show();
});

/**
 *
 * @param {string[]} ids
 * @returns {string | HTMLElement[]}
 */
function getAndValidateElementsByid(ids) {
	const validatedElements = /**@type {HTMLElement[]} */ ([]);

	for (let i = 0; i < ids.length; i++) {
		const newElement = document.getElementById(ids[i]);

		if (!newElement) return ids[i];

		validatedElements.push(newElement);
	}

	return validatedElements;
}

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
