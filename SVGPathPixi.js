var MM = MM || {};

MM.SVGPathPixi = (function() {
	var SVGPathPixi = {};

	SVGPathPixi.drawSVGPath = function(svgPath, graphics) {
		var nbCommands = svgPath.commands.length;
		var command, letter, params, currentLocation, startLocation, previousEndC;
		var str = "";
		var resetStartLocation = true;
		for(var i = 0; i < nbCommands; i++) {
			command = this.commands[i];
			letter = command.letter;
			params = command.params;
			str += letter;
			switch(letter) {
				case "m":
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					currentLocation = {x: params.x, y: params.y};

					graphics.moveTo(params.x, params.y);

					if(resetStartLocation) {
						startLocation = {x: currentLocation.x, y: currentLocation.y};
						resetStartLocation = false;
					}
					break;
				case "M":
					x = params.x;
					y = params.y;

					currentLocation = {x: params.x, y: params.y};

					graphics.moveTo(params.x, params.y);

					if(resetStartLocation) {
						startLocation = {x: currentLocation.x, y: currentLocation.y};
					}
					break;
				case "c":
					cx1 = params.cx1 - currentLocation.x;
					cy1 = params.cy1 - currentLocation.y;
					cx2 = params.cx2 - currentLocation.x;
					cy2 = params.cy2 - currentLocation.y;
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					graphics.bezierCurveTo(params.cx1, params.cy1, params.cx2, params.cy2, params.x, params.y);
					break;
				case "C":
					cx1 = params.cx1;
					cy1 = params.cy1;
					cx2 = params.cx2;
					cy2 = params.cy2;
					x = params.x;
					y = params.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					graphics.bezierCurveTo(params.cx1, params.cy1, params.cx2, params.cy2, params.x, params.y);
					break;
				case "s":
					cx2 = params.cx2 - currentLocation.x;
					cy2 = params.cy2 - currentLocation.y;
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					graphics.bezierCurveTo(params.cx1, params.cy1, params.cx2, params.cy2, params.x, params.y);
					break;
				case "S":
					cx2 = params.cx2;
					cy2 = params.cy2;
					x = params.x;
					y = params.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					graphics.bezierCurveTo(params.cx1, params.cy1, params.cx2, params.cy2, params.x, params.y);
					break;
				case "l":
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					currentLocation = {x: params.x, y: params.y};

					graphics.lineTo(params.x, params.y);
					break;
				case "L":
					x = params.x;
					y = params.y;

					currentLocation = {x: params.x, y: params.y};

					graphics.lineTo(params.x, params.y);
					break;
				case "h":
					x = params.x - currentLocation.x;

					currentLocation.x = params.x;

					graphics.lineTo(params.x, params.y);
					break;
				case "H":
					x = params.x;

					currentLocation.x = params.x;

					graphics.lineTo(params.x, params.y);
					break;
				case "v":
					y = params.y - currentLocation.y;

					currentLocation.y = params.y;

					graphics.lineTo(params.x, params.y);
					break;
				case "V":
					y = params.y;

					currentLocation.y = params.y;

					graphics.lineTo(params.x, params.y);
					break;
				case "z":
				case "Z":
					currentLocation = {x: startLocation.x, y: startLocation.y};

					graphics.lineTo(startLocation.x, startLocation.y);
					resetStartLocation = true;
					break;
			}
		}
	};

	return SVGPathPixi;
})();