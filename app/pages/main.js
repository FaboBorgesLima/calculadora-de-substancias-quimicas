import { ChemReaction } from "../service/index.js";
sessionStorage.clear();
loadReactionCards();
function loadReactionCards() {
    const $reactionCard = $(".reaction-card").data("arr", [1]);
    if (localStorage.length == 0) {
        const $cloneReactionCard = $reactionCard.clone(true).removeClass("d-none");
        $cloneReactionCard.appendTo(".home-grid");
        $cloneReactionCard.find("." + $.escapeSelector("bi-x")).remove();
        $cloneReactionCard
            .find("." + $.escapeSelector("reaction-title"))
            .append("Ops!");
        $cloneReactionCard
            .find("." + $.escapeSelector("reaction-description"))
            .append("Nenhuma reação registrada ainda!");
    }
    for (let i = 0; i < localStorage.length; i++) {
        const reactionSchema = ChemReaction.quickLoadFromPos(i);
        if (!reactionSchema)
            return;
        const reaction = ChemReaction.schemaToString(reactionSchema);
        const $cloneReactionCard = $reactionCard.clone(true).removeClass("d-none");
        $cloneReactionCard.appendTo(".home-grid");
        $cloneReactionCard
            .find("." + $.escapeSelector("reaction-title"))
            .append(reaction.name);
        $cloneReactionCard
            .find("." + $.escapeSelector("reaction-description"))
            .append(reaction.reaction);
        $cloneReactionCard.on("click", { reactionId: reactionSchema.id, jQueryElement: $cloneReactionCard }, redirectToAdicionar);
    }
}
function redirectToAdicionar(event) {
    sessionStorage.setItem("reaction-id", event.data.reactionId.toString());
    if (event.target.classList.contains("delete")) {
        localStorage.removeItem(event.data.reactionId.toString());
        event.data.jQueryElement.fadeOut("fast");
        return;
    }
    window.location.href = "./adicionar/index.html";
}
//# sourceMappingURL=main.js.map