const grids = 
`<button onclick="onGrid()" class="gridOn"></button>
<div id="grid" class="wrapGrid container">
	<div class="grid ">
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
		<div class="col"></div>
	</div>
</div>`;
const body = document.body;
body.insertAdjacentHTML('afterend', grids);

const onGrid = () => {
	console.log('ongrid');
	grid.classList.toggle('vis')
};