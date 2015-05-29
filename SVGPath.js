var MM = MM || {};

MM.SVGPath = (function() {
	function isMSIE() {
		return window.navigator.userAgent.indexOf("MSIE ") > 0 || !!window.navigator.userAgent.match(/Trident.*rv\:11\./);
	}

	function SVGPath(pathStr) {
		if(pathStr == undefined) {
			pathStr = "";
		}

		this.originalCommands = SVGPath.parse(pathStr);
		this.commands = this.cloneCommands(this.originalCommands);
	}

	SVGPath.prototype.cloneCommands = function(commandsToBeCloned) {
		var commands = [];
		var nbCommands = commandsToBeCloned.length;
		var command, commandToBeCloned;
		for(var i = 0; i < nbCommands; i++) {
			commandToBeCloned = commandsToBeCloned[i];
			command = {letter: commandToBeCloned.letter, params: {}};
			for(var key in commandToBeCloned.params) {
				command.params[key] = commandToBeCloned.params[key];
			}
			commands.push(command);
		}
		return commands;
	};

	SVGPath.prototype.scale = function(scaleXRatio, scaleYRatio, scaleOrigin) {
		if(scaleOrigin == undefined) {
			scaleOrigin = {x: 0, y: 0};
		}
		var nbCommands = this.commands.length;
		var originalCommand, originalParams, command, params;
		for(var i = 0; i < nbCommands; i++) {
			originalCommand = this.originalCommands[i];
			originalParams = originalCommand.params;
			command = this.commands[i];
			params = command.params;
			params.x = (originalParams.x - scaleOrigin.x) * scaleXRatio;
			params.y = (originalParams.y - scaleOrigin.y) * scaleYRatio;
			if(originalParams.cx1 != undefined && originalParams.cy1 != undefined) {
				params.cx1 = (originalParams.cx1 - scaleOrigin.x) * scaleXRatio;
				params.cy1 = (originalParams.cy1 - scaleOrigin.y) * scaleYRatio;
			}
			if(originalParams.cx2 != undefined && originalParams.cy2 != undefined) {
				params.cx2 = (originalParams.cx2 - scaleOrigin.x) * scaleXRatio;
				params.cy2 = (originalParams.cy2 - scaleOrigin.y) * scaleYRatio;
			}
		}
	};

	SVGPath.prototype.toString = function() {
		var nbCommands = this.commands.length;
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

					str += x + "," + y;

					if(resetStartLocation) {
						startLocation = {x: currentLocation.x, y: currentLocation.y};
						resetStartLocation = false;
					}
					break;
				case "M":
					x = params.x;
					y = params.y;

					currentLocation = {x: params.x, y: params.y};

					str += x + "," + y;

					if(i == 0) {
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

					str += cx1 + "," + cy1 + "," + cx2 + "," + cy2 + "," + x + "," + y;
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

					str += cx1 + "," + cy1 + "," + cx2 + "," + cy2 + "," + x + "," + y;
					break;
				case "s":
					cx2 = params.cx2 - currentLocation.x;
					cy2 = params.cy2 - currentLocation.y;
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					str += cx2 + "," + cy2 + "," + x + "," + y;
					break;
				case "S":
					cx2 = params.cx2;
					cy2 = params.cy2;
					x = params.x;
					y = params.y;

					previousEndC = {x: params.cx2, y: params.cy2};
					currentLocation = {x: params.x, y: params.y};

					str += cx2 + "," + cy2 + "," + x + "," + y;
					break;
				case "l":
					x = params.x - currentLocation.x;
					y = params.y - currentLocation.y;

					currentLocation = {x: params.x, y: params.y};

					str += x + "," + y;
					break;
				case "L":
					x = params.x;
					y = params.y;

					currentLocation = {x: params.x, y: params.y};

					str += x + "," + y;
					break;
				case "h":
					x = params.x - currentLocation.x;

					currentLocation.x = params.x;

					str += x;
					break;
				case "H":
					x = params.x;

					currentLocation.x = params.x;

					str += x;
					break;
				case "v":
					y = params.y - currentLocation.y;

					currentLocation.y = params.y;

					str += y;
					break;
				case "V":
					y = params.y;

					currentLocation.y = params.y;

					str += y;
					break;
				case "z":
				case "Z":
					resetStartLocation = true;
					break;
			}
		}
		return str;
	};

	SVGPath.parse = function(pathStr) {
		var isIE = isMSIE();
		var commandsSplitted = pathStr.replace(/([a-z][^a-z]*)/gi, "$1\n");
		var commands = commandsSplitted.split("\n");
		commands.pop()
		var currentLocation = {x: 0, y: 0};
		var startLocation = {x: 0, y: 0};
		var previousEndC = {x: 0, y: 0};
		var finalCommands = [];
		var command, finalCommand, letter, paramsStr, paramsSplitted, params, x, y, finalCommandParams, cx1, cy1, cx2, cy2;
		var resetStartLocation = true;
		for(var i = 0; i < commands.length; i++) {
			command = commands[i];
			finalCommand = {};
			letter = command.substr(0, 1);
			paramsStr = command.substr(1);
			if(isIE) {
				paramsSplitted = paramsStr.replace(/[\s]/gi, "\n");
			} else {
				paramsSplitted = paramsStr.replace(/([,])/gi, "\n");
				paramsSplitted = paramsSplitted.replace(/([-])/gi, "\n$1");
			}
			params = paramsSplitted.split("\n");
			for(var j = params.length; j >= 0; j--) {
				if(params[j] == "") {
					params.splice(j, 1);
				}
			}
			finalCommand.letter = letter;
			switch(letter) {
				case "m":
					x = currentLocation.x + parseFloat(params[0]);
					y = currentLocation.y + parseFloat(params[1]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};

					if(resetStartLocation) {
						startLocation = {x: currentLocation.x, y: currentLocation.y};
						resetStartLocation = false;
					}
					break;
				case "M":
					x = parseFloat(params[0]);
					y = parseFloat(params[1]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};

					if(resetStartLocation) {
						startLocation = {x: currentLocation.x, y: currentLocation.y};
						resetStartLocation = false;
					}
					break;
				case "c":
					cx1 = currentLocation.x + parseFloat(params[0]);
					cy1 = currentLocation.y + parseFloat(params[1]);
					cx2 = currentLocation.x + parseFloat(params[2]);
					cy2 = currentLocation.y + parseFloat(params[3]);
					x = currentLocation.x + parseFloat(params[4]);
					y = currentLocation.y + parseFloat(params[5]);

					previousEndC = {x: cx2, y: cy2};
					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y, cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2};
					break;
				case "C":
					cx1 = parseFloat(params[0]);
					cy1 = parseFloat(params[1]);
					cx2 = parseFloat(params[2]);
					cy2 = parseFloat(params[3]);
					x = parseFloat(params[4]);
					y = parseFloat(params[5]);

					previousEndC = {x: cx2, y: cy2};
					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y, cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2};
					break;
				case "s":
					cx1 = currentLocation.x * 2 - previousEndC.x;
					cy1 = currentLocation.y * 2 - previousEndC.y;
					cx2 = currentLocation.x + parseFloat(params[0]);
					cy2 = currentLocation.y + parseFloat(params[1]);
					x = currentLocation.x + parseFloat(params[2]);
					y = currentLocation.y + parseFloat(params[3]);

					previousEndC = {x: cx2, y: cy2};
					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y, cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2};
					break;
				case "S":
					cx1 = currentLocation.x * 2 - previousEndC.x;
					cy1 = currentLocation.y * 2 - previousEndC.y;
					cx2 = parseFloat(params[0]);
					cy2 = parseFloat(params[1]);
					x = parseFloat(params[2]);
					y = parseFloat(params[3]);

					previousEndC = {x: cx2, y: cy2};
					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y, cx1: cx1, cy1: cy1, cx2: cx2, cy2: cy2};
					break;
				case "l":
					x = currentLocation.x + parseFloat(params[0]);
					y = currentLocation.y + parseFloat(params[1]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "L":
					x = parseFloat(params[0]);
					y = parseFloat(params[1]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "h":
					x = currentLocation.x + parseFloat(params[0]);
					y = currentLocation.y;

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "H":
					x = parseFloat(params[0]);
					y = currentLocation.y;

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "v":
					x = currentLocation.x;
					y = currentLocation.y + parseFloat(params[0]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "V":
					x = currentLocation.x;
					y = parseFloat(params[0]);

					currentLocation = {x: x, y: y};

					finalCommandParams = {x: x, y: y};
					break;
				case "z":
				case "Z":
					x = startLocation.x;
					y = startLocation.y;

					currentLocation = {x: x, y: y};
					resetStartLocation = true;

					finalCommandParams = {x: x, y: y};
					break;
			}
			finalCommand.params = finalCommandParams;
			finalCommands.push(finalCommand);
		}
		return finalCommands;
	};

	SVGPath.getAngleFromDistanceRatio = function(path, ratio) {
		var totalLength = path.getTotalLength();
		var distance = ratio * totalLength;
		var point = path.getPointAtLength(distance);
		var nextDistance;
		if(distance + 1 <= totalLength) {
			nextDistance = distance + 1;
		} else {
			nextDistance = distance - 1;
		}
		var nextPoint = path.getPointAtLength(nextDistance);
		var deltaX = nextPoint.x - point.x;
		var deltaY = nextPoint.y - point.y;
		var angle = Math.atan2(deltaY, deltaX);
		if(nextDistance < distance) {
			angle = angle + Math.PI;
		}
		return angle;
	}

	return SVGPath;
})();