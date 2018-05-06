export default function() {

	$("#svg-store-holder").load('media/svg-sprite.svg', function(response){

		if(!response){	
            return;
        }
 
 		var hSvgStore = document.getElementById('svg-store-holder');
 		var hSvg;
 		var hSvgSymbols;
 		var html = '';

 		hSvgStore.innerHTML = response;

 		hSvg = hSvgStore.querySelector('svg');
 		hSvgSymbols = hSvg.querySelectorAll('symbol');
 		html = '';    

        hSvgSymbols.forEach(function(elem){
        	html += `<div class="col-6 col-sm-4 col-md-2"><div class="prev-icon">
	        		<div class="prev-icon__svg-holder">
		        		<svg class="prev-icon__svg" width="96" height="94" role="img">
		    				<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="media/svg-sprite.svg#${elem.id}"></use>
						</svg>
					</div>
					<div class="prev-icon__name">${elem.id}</div>
				</div>
				</div>`;
        });

        html = '<div class="row">' + html;
        html += '</div>';

        hSvgStore.innerHTML = html;
    });

}