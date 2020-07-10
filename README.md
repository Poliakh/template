# [Инструкция](https://github.com/Poliakh/myhelp/blob/master/help.md)  

основан на [примере](https://www.youtube.com/watch?v=stFOy0Noahg)  
`npm i` - установка модулей  
`gulp` - запуск сборщика на виртуальном сервере  
`gulp build` - сборка проекта.  
`gulp prod` - сборка сжатой версии.  
## Перед началом работы  
Все файлы с именами  *demo.** можно удалить.

**svgSprite:**
	`gulp svgSprite` - запустит сборку svg sprite и создаст html с примером использования. Для этого файлы   \*.svg  должны находиться  в папке **[sourcefolder]/iconsprite/**.

**fonts:**
	gulp самостоятельно соберет шрифты в форматах **2woff** и **woff2** и самостоятельно подключит их в стилях. Для этого необходимо положить шрифты в формате   **ttf**  в паку **[sourcefolder]/fonts/**

## Преобразование картинок в Webp
Конструкция 

```html
	<img src="images/image.jpj" alt="image">
```
будет заменена на 

```html
	<picture>
        <source srcset="images/image.webp" type="image/webp"/>
        <img width="200px" height="auto" src="images/image.jpg" alt="image"/>
	</picture>
```
## Картинки в стилях
Плагин **style-WebP.js** в папке **[script/plugin]** предназначен для автоматического добавления в стилях ссылок на картинки в формате webp.

**отображение сетки**
подключить стили  
*_grids.scss,*  
*-grids.js*  
справа вверху на странице шаблона появится кнопка активации сетки.



## Дерево проекта
```
folder_project  
│  
├─#src  
│ ├─maket  
│ ├─images  
│ ├─fonts  
│ ├─css  
│ ├─scss  
│ ├─script  
│ │ ├───components  
│ │ └───plugins  
│ ├─blocks(html)  
│ └─index.html
│  
├─build  
│ ├─images  
│ ├─fonts  
│ ├─css  
│ ├─script  
│ └─index.html
│  
└─production  
  ├─images  
  ├─fonts  
  ├─css  
  ├─script  
  └─index.html
```