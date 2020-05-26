
var URL = 'https://spreadsheets.google.com/feeds/cells/15eetqNiUGrK-I1HPUhSZ6DehbRl9kWOET7UvfxOnk24/1/public/full?alt=json';

$.get(URL,{},function(reponse){
	var html = afficherfeuille(reponse);
	console.log(reponse);
	$('.sheet').html(html);
});

function genererTableau(lignesContenu,lignesEntete,nbCol){	
	var html = '<table class="table table-striped">';
		html += '<thead class="thead-dark">';
		html += '<tr>';
			lignesEntete.forEach(function(elem){
				html += '<th class="text-center">'+elem+'</th>';
			});
		html += '</tr>';
		html += '</thead>';
		html += '<tbody>';
		lignesContenu.forEach(function(elem){
			html += '<tr>';
				for (var numCol = 0; numCol < nbCol; numCol++) {
					html += '<td class="text-center">'+elem[numCol]+'</td>';
				}
			html += '</tr>';
		});
		html += '</tbody>';

	html += '</table>';
	return html;
}

function afficherfeuille(jsonObject){
	var lignesEntete = new Array();	
	var lignesContenu = new Array();	
	var data;
	var numLigne = 0 ;
	var numCol = 0 ;
	var nbCol = 0;

	//	Récupération de nombres de colonnes
	for(var pos = 0; pos < jsonObject.feed.entry.length;pos++){
		data = enleverBalises(jsonObject.feed.entry[pos].gs$cell.$t);	//	Récupération et netoyage des contenus de chaque cellules
		if(jsonObject.feed.entry[pos].gs$cell.row == 1){
			lignesEntete [nbCol] =  capitalizePremiereLettre(data);//	Alimentations du tableau de data pour les entêtes et Mise en majuscule des première lettre des entêtes de chaque colonne
			(nbCol ++);
		}
	}
	
	//	Alimentations du tableau de data
	for(var pos = 0; pos < jsonObject.feed.entry.length;pos++){

		data = enleverBalises(jsonObject.feed.entry[pos].gs$cell.$t);	//	Récupération et netoyage des contenus de chaque cellules

		if(numCol < nbCol){
			//	Alimentations  du tableau de data pour les contenus 
			(jsonObject.feed.entry[pos].gs$cell.row == 1)?'':(lignesContenu [numLigne-1][numCol] =  data);	//	"numLigne-1" Car le numLigne commence par 0 alors qu'ici quand il passe dans la deuxième expression (expression executée en cas de non re^pect de la condition) la valeur de numLigne a déjà éé incrémenté de 1 (d'où la décrémentation de 1) 		
			numCol++;
		}else{			
			lignesContenu [numLigne] = new Array(nbCol);
			lignesContenu [numLigne][0] = data;	// Alimentations du tableau de data pour les contenus
			numLigne ++;	
			numCol = 1;
		}
	}

	return genererTableau(lignesContenu,lignesEntete,nbCol);
}

// Mettre en majuscule la première lettre de chaque entête
function capitalizePremiereLettre(chaine) {
  return chaine.charAt(0).toUpperCase() + chaine.slice(1);
}


// Enlever les balises html et en l'occurence empecher l'execution des script JS de la chaine
function enleverBalises(chaine) {
	var patern = /(<([^>]+)>)/ig;
	var chainetraite = chaine.replace(patern,"");
	return chainetraite;
}

// Enlever les balises html et en l'occurence empecher l'execution des script JS de la chaine
// function enleverBalises(chaine) {
// 	var chaine = String(chaine), chars = {
// 	  '&':'&',
// 	  '"':'"',
// 	  '<':'<',
// 	  '>':'>'
// 	};
// 	for (var i in chars) 
// 	  	chaine=chaine.replace(new RegExp(i,'g'), chars[i]);

// 	return chaine;
// }