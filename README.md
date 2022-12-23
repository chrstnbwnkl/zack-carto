<h1 align="center">ZACK⚡</h1>

<p align="center"><b>Zack [<i>t͡sak</i>]</b> (from German: exclaimed when something needs to happen instantly): quick &amp; easy geodata from OpenStreetMap for graphic designers</p>

<hr>

## About

While geodata has become widely accessible, there remains a large group of professionals who are left out of the loop: _graphic designers in need of a map_. And I don't mean a cartographic masterpiece, rather a simple map for use in film or print. In these situations, a map is simply the least concern for the designer. There's no time for learning about GeoJSON, ~~[shapefile](http://switchfromshapefile.org)~~ or [projections](https://observablehq.com/@fil/synchronized-projections), nor for figuring out where to even find the data in the first place.

But these constraints should not stand in the way of a beautiful map, and designers have a lot of skills needed to make meaningful and good looking maps. This is were _Zack_ comes in: it is a tool to quickly pull geodata from a local context that is usually not as easily available as e.g. country borders or the US states, and convert it to a format that every designer is comfortable with: SVG. Simply pan the map to the extent needed, adjust the sliders depending on which features you want to include and what level of detail you need, and voilá! Just click the export button and all features are downloaded as one SVG file. The big advantage: no need to align anything manually, all features within each file are georeferenced, so you can quickly start drafting. Additionally, drag & drop your own GeoJSON files to include them in the output. Your geodata will be **completely handled in the browser**, nothing will be sent to any servers.

A live instance of this app runs [here](https://chrstnbwnkl.github.io/zack-carto/).

## Set-up

The app runs entirely in the browser. It is based on React, and for geodata retrieval, it calls a public [Overpass](https://wiki.openstreetmap.org/wiki/Overpass_API) instance. [D3 Geo](https://github.com/d3/d3-geo) is used to render the features in SVG.

### Install

```sh
git clone git@github.com:chrstnbwnkl/zack-carto.git
cd zack-carto
npm install
```

### Develop

This project uses `webpack-dev-server`, you can spin it up with

```sh
npm run start
```

### Build

```
npm run build
```

## Contributing

Found a bug or have an idea for a new feature? I'd love to get feedback on this, whether it's an issue or a pull request!

## Attributions

Lightning logo from [twemoji](https://github.com/twitter/twemoji)
