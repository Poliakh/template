(function () {
	const animData =
		`<div class="scrAnim__wrap">
			<img id="scrAnim__stone" src="./img/Stone.png" alt="">
			<div id="scrAnim__rect" >
			<video class="scrAnim__video" autoplay loop="loop" muted>
				<source src="./img/video (convert-video-online.com).mp4" type="video/mp4" />
			</video>
			</div>
			<img id="scrAnim__oval" src="./img/Oval.png" alt="">
			<img id="scrAnim__star" src="./img/Star.png" alt="">
		</div>`

	function addScrollElelments() {
		const scrAnim = document.getElementById('scrAnim');
		scrAnim.innerHTML = animData;
	}

	document.addEventListener('DOMContentLoaded', scrollInit);
	window.addEventListener('resize', scrollInit);

	function scrollInit() {
		addScrollElelments()
		scropllAmin()
	}


	function startAnin() {
		const wh = window.innerHeight
		const rect = document.getElementById('scrAnim__rect');
		const rectBottom = Math.ceil(rect.getBoundingClientRect().top) + rect.clientHeight;
		if (wh > rectBottom) {
			return `bottom ${rectBottom}px`
		} else {
			return '30% bottom'
		}
	}
	const myend = "center center";

	function scropllAmin() {
		gsap.registerPlugin(ScrollTrigger);

		ScrollTrigger.matchMedia({
			// descktop
			"(min-width: 800px)": function () {

				gsap.from('#scrAnim__rect', {
					scrollTrigger: {
						trigger: '#scrAnim__rect',
						scrub: true,
						start: startAnin(),
						end: myend,
						// markers: true
					},
					xPercent: 21,
					ease: "none",

				});
				gsap.from('#scrAnim__stone', {
					scrollTrigger: {
						trigger: '#scrAnim__rect',
						scrub: true,
						start:startAnin(),
						end: myend

					},
					xPercent: -17.3,
					ease: "none",

				})
				gsap.to('#scrAnim__star', {
					scrollTrigger: {
						trigger: '#scrAnim__rect',
						scrub: true,
						start: "bottom 110%",
						end: myend

					},
					rotation: 360,
					ease: "none"
				}
				)
			},

			//mobile
			"(max-width: 799px)": function () {
				gsap.set('#scrAnim__rect', { x: 0 })
				gsap.set('#scrAnim__stone', { x: 0 })
			}
		})
	}
}())