/* for displays the grid on the page  */

const grids =
	`<button class="gridOn"></button>
<div id="grid" class="wrapGrid">
	<div class="container">
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
	</div>
</div>`;

document.body.insertAdjacentHTML('beforeend', grids);

const onGrid = () => {
	console.log(grid);
	console.log(grid.matches('.vis'));
	
	if(grid.matches('.vis')){
		grid.classList.remove('vis');
		localStorage.grids = 'off';
	}else{
		grid.classList.add('vis')
		localStorage.grids = 'on';

	}
};

document.querySelector('.gridOn').addEventListener('click', onGrid);

if (localStorage.grids === 'on'){
	grid.classList.add('vis')
};