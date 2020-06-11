[Help](https://github.com/Poliakh/myhelp/blob/master/help.md)  
---
основан на [примере](https://www.youtube.com/watch?v=stFOy0Noahg)  
`npm i` - установка проекта
`gulp` - запуск сборщика

**svgSprite:**
	`gulp svgSprite` - запустит сборку svg sprite  и создаст  html с примером использования. Для этого файлы   \*.svg  должны находиться  в папке **[sourcefolder]/iconsprite/**.

**fonts:**
	gulp  самостоятельно соберет шрифты в форматах **2woff** и **woff2** и самостоятельно подключит их в стилях. Для этого необходимо положить шрифты в формате   **ttf**  в паку **[sourcefolder]/fonts/**

**webp:**
Конструкция 

```javascript
<img src="images/image.jpj" alt="image">
```
будет заменена на 

```javascript
	<picture>
        <source srcset="images/image.webp" type="image/webp">
        <img width="200px" height="auto" src="images/image.jpg" alt="image">
	</picture>
```
В папке **[script/plugin]** находится **testWebP.js**  - предназначен для автоматического добавления в стилях ссылок на картинки в формате webp.