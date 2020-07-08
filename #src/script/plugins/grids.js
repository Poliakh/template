// for displays the grid on the page 

const grids =
	`<button class="gridOn"></button>
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
	grid.classList.toggle('vis')
	if(localStorage.grids === 'on'){
	localStorage.grids = 'off';
	} else{
		localStorage.grids = 'on';
	}
};
const gridOn = document.querySelector('.gridOn');
gridOn.addEventListener('click', onGrid)

if (localStorage.grids === 'on'){
	grid.classList.add('vis')
}