var URL = 'https://spreadsheets.google.com/feeds/cells/15eetqNiUGrK-I1HPUhSZ6DehbRl9kWOET7UvfxOnk24/1/public/full?alt=json';

$.get(URL,{},function(reponse){
	var html = afficherfeuille(reponse);
	$('.sheet').html(html);
});

function genererTableau(lignes,nbLignes,nbCol){	
	var html = '<table class="table table-striped">';
		html += '<thead class="thead-dark">';
		html += '<tr>';
			for (var numCol = 0; numCol < nbCol; numCol++) {
				html += '<th>'+lignes[0][numCol]+'</th>';
			}
		html += '</tr>';
		html += '</thead>';
		html += '<tbody>';
		for (var posLigne = 1; posLigne < nbLignes; posLigne++) {
			html += '<tr>';
				for (var numCol = 0; numCol < nbCol; numCol++) {
					html += '<td>'+lignes[posLigne][numCol]+'</td>';
				}
			html += '</tr>';
		}
		html += '</tbody>';

	html += '</table>';
	return html;
}

function afficherfeuille(jsonObject){
	var lignes = new Array();	
	var data;
	var numCol = 0 ;
	var numLigne = 0 ;
	var nbLignes = 0;
	var nbColTrouv = false;
	var nbCol = 0;

	//	Récupération de nombres de colonnes
	for(var pos = 0; pos < jsonObject.feed.entry.length;pos++){
		if(jsonObject.feed.entry[pos].gs$cell.row <= 1){
			(nbCol ++);
		}
	}
	
	//	Alimentations du tableau de data
	lignes [0] = new Array(nbCol);
	var numLgnePrec = 0;
	for(var pos = 0; pos < jsonObject.feed.entry.length;pos++){
		data = jsonObject.feed.entry[pos].gs$cell.$t;
		if(numCol < nbCol){
			lignes [numLigne][numCol] = data;
			numCol++;
		}else{			
			numLigne ++;
			nbLignes = numLigne+1;	//	Car le numLigne commence par 0
			lignes [numLigne] = new Array(nbCol);
			lignes [numLigne][0] = data;
			numCol = 1;
		}
	}

	return genererTableau(lignes,nbLignes,nbCol);
}