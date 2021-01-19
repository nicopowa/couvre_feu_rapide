import {generatePdf} from "../src/js/pdf-util.js"
window.addEventListener("load", async () => {
	let print = what => document.body.innerHTML += what + "<br/>", die = how => print("<font color=\"red\">" + how + "</font>");
	try {
		
		print("couvre-feu rapide<br/>tout le monde au lit");
		let params = new URLSearchParams(location.search);
		if(params.has("no")) {
			params.delete("no");
			document.title = params.get("motif");
			history.replaceState(null, null, "?" + params.toString());
			return die("ajouter cette page à l'écran d'accueil");
		}
		
		print("édition de l'attestation");
		let infos = Array.from(params).reduce((o, i) => ({...o, [i[0]]: i[1]}), {}), 
			ios = /iP(hone|od|ad)/.test(navigator.platform) && (navigator.appVersion).match(/OS (\d+)_(\d+)/), 
			iosv = ios && parseFloat(ios.slice(1).join(".")) || 0, 
			date = moment().subtract(infos.minutes || 10, "minutes"), 
			pdf = await generatePdf({...infos, datesortie: date.format("DD[/]MM[/]YYYY"), heuresortie: date.format("HH[:]mm")}, infos.motif || "achats", "src/certificate.pdf", date).catch(err => die(err)), 
			blob = new Blob([pdf], {type: ios && iosv < 13 ? "application/pdf" : "application/octet-stream"});
		
		print("enregistrement");
		saveAs(blob, "attestation-" + date.format("YYYY[-]MM[-]DD[_]HH[-]mm") + ".pdf");

	}
	catch(err) {
		die(err);
	}
});
