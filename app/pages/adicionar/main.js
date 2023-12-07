import { ChemMolecule, ChemReaction } from "../../service/index.js";
const addButton = document.getElementById("add");
const $mainReagentCard = $(".reagent-card"), $mainProductCard = $(".product-card"), addProductButtons = (document.getElementsByClassName("add-product")), addRegentButtons = (document.getElementsByClassName("add-reagent")), reactionTitleHTMLElement = (document.getElementById("reaction-title"));
for (let i = 0; i < addProductButtons.length; i++)
    addProductButtons[i].addEventListener("click", createProductInput);
for (let i = 0; i < addRegentButtons.length; i++)
    addRegentButtons[i].addEventListener("click", createReagentInput);
const [modalError, modalOkay] = getModals("modal-error", "modal-error-text", "modal-error-title", "modal-okay", "modal-okay-text", "modal-okay-title");
addButton.addEventListener("click", () => {
    const reagents = getReagents();
    if (!Array.isArray(reagents)) {
        modalError.titleElement.textContent = reagents.title;
        modalError.textElement.textContent = reagents.msg;
        modalError.bootstrap.show();
        return;
    }
    const products = getProducts();
    if (!Array.isArray(products)) {
        modalError.titleElement.textContent = products.title;
        modalError.textElement.textContent = products.msg;
        modalError.bootstrap.show();
        return;
    }
    const title = getTitleAndErrorModal("Titulo Inválido!", `O titulo deve ter entre ${ChemReaction.MIN_NAME_CHAR} e ${ChemReaction.MAX_NAME_CHAR} caracteres`);
    if (!title)
        return;
    const reaction = new ChemReaction(title);
    const reactionId = getReactionID();
    reaction.id = parseInt(reactionId);
    reaction.setLeftSide(reagents);
    console.debug(reagents);
    reaction.setRightSide(products);
    if (!reaction.isBalanced()) {
        modalError.titleElement.textContent = "Formulas não balancedas!";
        modalError.textElement.textContent =
            "As formulas não foram balanceadas corretamente!";
        modalError.bootstrap.show();
        return;
    }
    reaction.storageReaction();
    modalOkay.textElement.textContent = `A sua reação é :${reaction.toString()}`;
    modalOkay.titleElement.textContent = "Obrigado pela sua contribuição!";
    sessionStorage.clear();
    sessionStorage.setItem("reaction-id", reaction.id.toString());
    modalOkay.bootstrap.show();
});
function createReagentInput() {
    const $clone = $mainReagentCard.clone().removeClass("d-none");
    $clone.find("button").on("click", () => $clone.fadeOut("fast", () => {
        $clone.remove();
    }));
    $clone.hide().appendTo("#reagent-side");
    $clone.fadeIn("fast");
}
function createReagentWithMolecule(molecule) {
    const $clone = $mainReagentCard.clone().removeClass("d-none");
    $clone.find("button").on("click", () => $clone.fadeOut("fast", () => {
        $clone.remove();
    }));
    $clone.hide().appendTo("#reagent-side");
    $clone.find(".reagent").val(molecule.getCondesedFormula());
    $clone.find(".reagent-quant").val(molecule.mols);
    $clone.fadeIn("fast");
}
function createProductInput() {
    const $clone = $mainProductCard.clone().removeClass("d-none");
    $clone.find("button").on("click", () => $clone.fadeOut("slow", () => {
        $clone.remove();
    }));
    $clone.hide().appendTo("#product-side");
    $clone.fadeIn("fast");
}
function createProductWithMolecule(molecule) {
    const $clone = $mainProductCard.clone().removeClass("d-none");
    $clone.find("button").on("click", () => $clone.fadeOut("slow", () => {
        $clone.remove();
    }));
    $clone.hide().appendTo("#product-side");
    $clone.find(".product").val(molecule.getCondesedFormula());
    $clone.find(".product-quant").val(molecule.mols);
    $clone.fadeIn("fast");
}
function getReactionID() {
    let reactionId = sessionStorage.getItem("reaction-id");
    if (reactionId == null) {
        const key = localStorage.key(0);
        if (key)
            reactionId = (parseInt(key) + 1).toString();
        else
            reactionId = "1";
    }
    return reactionId;
}
function getTitleAndErrorModal(title, msg) {
    if (reactionTitleHTMLElement.value.length >= ChemReaction.MIN_NAME_CHAR &&
        reactionTitleHTMLElement.value.length <= ChemReaction.MAX_NAME_CHAR) {
        return reactionTitleHTMLElement.value;
    }
    modalError.textElement.textContent = msg;
    modalError.titleElement.textContent = title;
    modalError.bootstrap.show();
    return;
}
function getModals(modalErrorId, modalErrorTextId, modalErrorTitleId, modalOkayId, modalOkayTextID, modalOkayTitleId) {
    const modalErrorHTMLElement = document.getElementById(modalErrorId), modalErrorHTMLText = document.getElementById(modalErrorTextId), modalErrorHTMLTitle = document.getElementById(modalErrorTitleId), modalOkayHTMLElement = document.getElementById(modalOkayId), modalOkayHTMLText = document.getElementById(modalOkayTextID), modalOkayHTMLTitle = document.getElementById(modalOkayTitleId);
    return [
        {
            bootstrap: new bootstrap.Modal(modalErrorHTMLElement),
            titleElement: modalErrorHTMLTitle,
            textElement: modalErrorHTMLText,
        },
        {
            bootstrap: new bootstrap.Modal(modalOkayHTMLElement),
            titleElement: modalOkayHTMLTitle,
            textElement: modalOkayHTMLText,
        },
    ];
}
function getProducts() {
    const products = [];
    const productsHTMLElements = (document.getElementsByClassName("product")), productsQuantHTMLElements = (document.getElementsByClassName("product-quant"));
    for (let i = 1; i < productsHTMLElements.length; i++) {
        const mole = new ChemMolecule();
        if (!mole.setCondensedFormula(productsHTMLElements[i].value))
            return {
                title: "Molécula não é válida",
                msg: `O produto ${productsHTMLElements[i].value} não é valida`,
            };
        let quant = ~~productsQuantHTMLElements[i].value;
        quant = quant ? quant : 1;
        productsQuantHTMLElements[i].value = quant.toString();
        mole.mols = quant;
        products.push(mole);
    }
    return products;
}
function getReagents() {
    const reagents = [];
    const reagentsHTMLElements = (document.getElementsByClassName("reagent")), reagentsQuantHTMLElements = (document.getElementsByClassName("reagent-quant"));
    for (let i = 1; i < reagentsHTMLElements.length; i++) {
        const mole = new ChemMolecule();
        console.log(reagentsHTMLElements[i].value);
        if (!mole.setCondensedFormula(reagentsHTMLElements[i].value))
            return {
                title: "Molécula não é válida",
                msg: `O reagente ${reagentsHTMLElements[i].value} não é valida`,
            };
        let quant = ~~reagentsQuantHTMLElements[i].value;
        quant = quant ? quant : 1;
        reagentsQuantHTMLElements[i].value = quant.toString();
        mole.mols = quant;
        reagents.push(mole);
    }
    return reagents;
}
function loadProducts(molecules) {
    $(".product-quant").val(molecules[0].mols);
    $(".product").val(molecules[0].getCondesedFormula());
    for (let moleculeNum = 1; moleculeNum < molecules.length; moleculeNum++)
        createProductWithMolecule(molecules[moleculeNum]);
}
function loadReagents(molecules) {
    $(".reagent-quant").val(molecules[0].mols);
    $(".reagent").val(molecules[0].getCondesedFormula());
    for (let moleculeNum = 1; moleculeNum < molecules.length; moleculeNum++)
        createReagentWithMolecule(molecules[moleculeNum]);
}
const tryIdLoadId = +sessionStorage.getItem("reaction-id");
if (tryIdLoadId) {
    const loadedReaction = ChemReaction.loadReactionId(tryIdLoadId);
    reactionTitleHTMLElement.value = loadedReaction.getName();
    loadProducts(loadedReaction.getRightSide());
    loadReagents(loadedReaction.getLeftSide());
}
//# sourceMappingURL=main.js.map