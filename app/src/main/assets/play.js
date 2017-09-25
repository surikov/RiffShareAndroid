console.log('play.js v1.01');
var sns = "http://www.w3.org/2000/svg";
function svgLine(svgns, g, x1, y1, x2, y2, strokeColor, strokeWidth) {
	var line = document.createElementNS(svgns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if (strokeColor) {
		line.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		line.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	line.setAttributeNS(null, 'stroke-linecap', 'round');
	g.appendChild(line);
	return line;
}
function svgRectangle(svgns, g, x, y, w, h, fillColor, strokeColor, strokeWidth, rx, ry) {
	var rect = document.createElementNS(svgns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	if (fillColor) {
		rect.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		rect.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		rect.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	if ((rx) && (ry)) {
		rect.setAttributeNS(null, 'rx', rx);
		rect.setAttributeNS(null, 'ry', ry);
	}
	g.appendChild(rect);
	return rect;
}
function svgText(svgns, g, x, y, fontSize, text, bgColor, strokeColor, strokeWidth, fontFamily, fontStyle) {
	var txt = document.createElementNS(svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', fontSize);
	if (bgColor) {
		txt.setAttributeNS(null, 'fill', bgColor);
	}
	if (fontFamily) {
		txt.setAttributeNS(null, 'font-family', fontFamily);
	}
	if (fontStyle) {
		txt.setAttributeNS(null, 'font-style', fontStyle);
	}
	if (strokeColor) {
		txt.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		txt.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	txt.innerHTML = text;
	g.appendChild(txt);
	return txt;
}
function clearLayerChildren(layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		for (var n = 0; n < layer.children.length; n++) {
			var g = layer.children[n];
			while (g.children.length > 0) {
				g.removeChild(g.children[0]);
			}
		}
	}
}

