//@ts-check
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
		const reaction = ChemReaction.loadReactionPos(i);

		if (!reaction) return;

		const $cloneReactionCard = $reactionCard.clone(true).removeClass("d-none");

		$cloneReactionCard.appendTo(".home-grid");

		$cloneReactionCard
			.find("." + $.escapeSelector("reaction-title"))
			.append(reaction.name);

		$cloneReactionCard
			.find("." + $.escapeSelector("reaction-description"))
			.append(`${reaction.toString()}`);
	}
}
