import { ChemMolecule, ChemReaction } from "../../service/index.js";
if (!sessionStorage.getItem("reaction-id"))
    window.location.href = "../index.html";
const reaction = ChemReaction.loadReactionId(+sessionStorage.getItem("reaction-id")), $listItemMain = $(".dropdown-item").clone().removeClass("d-none"), mainCard = document.getElementsByClassName("molecule-card")[0], selectedMoleculeOnModal = document.getElementById("selected-molecule"), selectedMoleculeOnModalUnit = (document.getElementById("selected-molecule-unit")), radioUnitType = (document.getElementsByName("unit-radio"));
let mainMass = 0, mainMols = 0, mainCondensedFormula = "", cards = [], mainMolecule = new ChemMolecule(), unit = "mass";
console.info(reaction.getLeftSide()[0] == reaction.getLeftSide()[1]);
setDropDownMoleculesFromReaction(reaction);
for (let i = 0; i < radioUnitType.length; i++)
    radioUnitType[i].addEventListener("click", () => {
        if (radioUnitType[i].value == "mols")
            unit = "mols";
        else
            unit = "mass";
        setMoleculeToBalance(mainMolecule, unit);
    });
selectedMoleculeOnModalUnit.addEventListener("input", () => {
    selectedMoleculeOnModalUnit.value = selectedMoleculeOnModalUnit.value.replace(/[^0-9.,]/g, "");
    selectedMoleculeOnModalUnit.value = selectedMoleculeOnModalUnit.value.replace(/[.,]/g, "x");
    selectedMoleculeOnModalUnit.value = selectedMoleculeOnModalUnit.value.replace(/[x]/, ".");
    selectedMoleculeOnModalUnit.value = selectedMoleculeOnModalUnit.value.replace(/[x]/g, "");
    let numUnit = parseFloat(selectedMoleculeOnModalUnit.value);
    selectedMoleculeOnModalUnit.value =
        numUnit % 1 ? numUnit.toString() : selectedMoleculeOnModalUnit.value;
    if (unit == "mass") {
        numUnit = isNaN(numUnit) ? 0 : numUnit;
        numUnit = numUnit > 0 ? numUnit : 0;
        multiplyCardsValuesBy(numUnit / mainMass);
    }
    else {
        numUnit = isNaN(numUnit) ? 0 : numUnit;
        numUnit = numUnit > 0 ? numUnit : 0;
        multiplyCardsValuesBy(numUnit / mainMols);
    }
});
function setDropDownMoleculesFromReaction(reaction) {
    setMoleculeToBalance(reaction.getLeftSide()[0]);
    putMoleculeArrayOnDropDown(reaction.getLeftSide());
    putMoleculeArrayOnDropDown(reaction.getRightSide());
}
function putMoleculeArrayOnDropDown(mols) {
    for (const mol of mols) {
        const $listItem = $listItemMain.clone();
        $listItem.appendTo("#molecules-list");
        $listItem.append(mol.getCondesedFormula());
        $listItem.on("click", () => setMoleculeToBalance(mol));
    }
}
function setMoleculeToBalance(mol, unitInternal) {
    if (unitInternal)
        unit = unitInternal;
    mainMolecule = mol;
    selectedMoleculeOnModal.textContent = mol.getCondesedFormula();
    const totalMass = mol.getTotalMass();
    if (unit == "mass")
        selectedMoleculeOnModalUnit.value = totalMass.toFixed(2);
    else
        selectedMoleculeOnModalUnit.value = mol.mols.toFixed(2);
    mainMols = mol.mols;
    mainMass = totalMass;
    mainCondensedFormula = mol.getCondesedFormula();
    loadAllMoleculesOnCardsExcept(mol);
}
function multiplyCardsValuesBy(num) {
    for (let i = 0; i < cards.length; i++)
        if (unit == "mass")
            cards[i].num.textContent = (cards[i].initialMass * num).toFixed(2) + "g";
        else
            cards[i].num.textContent =
                (cards[i].initialMols * num).toFixed(2) + "mol";
}
function loadAllMoleculesOnCardsExcept(mol) {
    cards = createCardsOn("reagent-card-grid", reaction.getLeftSide(), mol);
    cards = createCardsOn("product-card-grid", reaction.getRightSide(), mol, cards);
}
function createCardsOn(id, using, except, cards) {
    if (!cards)
        cards = [];
    const grid = document.getElementById(id);
    grid.innerHTML = "";
    mainCard.classList.remove("d-none");
    for (let i = 0; i < using.length; i++) {
        if (using[i] == except)
            continue;
        const clone = mainCard.cloneNode(true), condensed = clone.childNodes[1].childNodes[1], num = clone.childNodes[3].childNodes[1];
        grid.appendChild(clone);
        if (unit == "mass")
            num.textContent = using[i].getTotalMass().toFixed(2) + "g";
        else
            num.textContent = using[i].mols.toFixed(2) + "mol";
        condensed.textContent = using[i].getCondesedFormula();
        cards.push({
            initialMass: using[i].getTotalMass(),
            initialMols: using[i].mols,
            num: num,
            condensedFormula: condensed,
        });
    }
    mainCard.classList.add("d-none");
    return cards;
}
//# sourceMappingURL=main.js.map