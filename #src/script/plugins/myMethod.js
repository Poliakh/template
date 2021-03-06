/* method add wrap for alelemnts
usage exemple:
elem.wrapc('tag', 'classname');
 */
Object.prototype.wrapc = function (tag='div',cls){
	const parent = this.parentElement;
	const elem = document.createElement(tag);
	elem.classList.add(cls);
	parent.insertBefore(elem, this);
	elem.appendChild(this);
};
