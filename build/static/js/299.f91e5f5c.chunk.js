!function(){"use strict";var e={299:function(e,t,r){var n=r(4942),o=r(3324),c=r(1413),i=(r(2791),r(8340)),a=r(6550),s=r(7969),u=r(184),l=(0,c.Z)((0,c.Z)({},a),s),p=function(e,t,r){return"https://tile.openstreetmap.org/".concat(r,"/").concat(e,"/").concat(t,".png")};onmessage=function(e){var t=function(e){var t=e.fc,r=e.uploadedGeoJSON,a=e.config,s=e.bounds,d=1e3,f=l.geoMercator().fitExtent([[40,40],[960,660]],s),g=l.geoPath(f),h=l.tile().size([d,700]).scale(2*f.scale()*Math.PI).translate(f([0,0])).tileSize(256),v=(0,u.jsxs)("svg",{width:d,height:700,title:"zack-download",version:"1.1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",children:[(0,u.jsx)("g",{id:"tiles",children:h().map((function(e,t,r){var n=(0,o.Z)(e,3),c=n[0],i=n[1],a=n[2],s=(0,o.Z)(r.translate,2),u=s[0],l=s[1],d=r.scale;return[p(c,i,a),Math.round((c+u)*d),Math.round((i+l)*d),d]})).map((function(e){return(0,u.jsx)("image",{xlinkHref:e[0],x:e[1],y:e[2],width:e[3],height:e[3]},"tile-".concat(e[0]))}))}),(0,u.jsx)("g",{id:"uploaded-geojson",children:r.map((function(e,t){return(0,u.jsx)("g",{children:e.features.map((function(e,t){var r=Object.keys(e.properties).reduce((function(t,r){return(0,c.Z)((0,c.Z)({},t),{},(0,n.Z)({},"data-".concat(r.replaceAll(":","-").replaceAll("_","-")),e.properties[r]))}),{});return(0,u.jsx)("g",(0,c.Z)((0,c.Z)({},r),{},{children:"Point"!==e.geometry.type?(0,u.jsx)("path",{d:g(e),stroke:"#87784e",strokeWidth:2,fill:"none",strokeLinecap:"round"}):(0,u.jsx)("circle",(0,c.Z)({cx:f(e.geometry.coordinates)[0],cy:f(e.geometry.coordinates)[1],r:3,fill:"#000",stroke:"#87784e",fillOpacity:.4,strokeWidth:2},r))}),"".concat(t))}))},t)}))}),Object.keys(t).map((function(e){var r=a[e];return(0,u.jsx)("g",{id:e,children:r.values.map((function(o,i){return(0,u.jsx)("g",{id:r.displayNames[i+1],children:t[e].features.filter((function(e){return Array.isArray(o)?o.includes(e.properties[r.tag]):e.properties[r.tag]===o})).map((function(t){var o=Object.keys(t.properties).reduce((function(e,r){return(0,c.Z)((0,c.Z)({},e),{},(0,n.Z)({},"data-".concat(r.replaceAll(":","-").replaceAll("_","-")),t.properties[r]))}),{});return(0,u.jsx)("g",(0,c.Z)((0,c.Z)({id:t.properties.id},o),{},{children:"node"!==r.osmElement?(0,u.jsx)("path",(0,c.Z)({d:g(t)},r._d3Styles[i])):(0,u.jsx)("circle",(0,c.Z)((0,c.Z)({cx:f(t.geometry.coordinates)[0],cy:f(t.geometry.coordinates)[1]},r._d3Styles[i]),o))}),"".concat(e,"-").concat(t.properties.id))}))},"".concat(e,"-").concat(o))}))},e)}))]});return i.uS(v)}({fc:e.data.fc,uploadedGeoJSON:e.data.uploadedGeoJSON,config:JSON.parse(e.data.config),bounds:e.data.bounds});postMessage(t)}}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var c=t[n]={exports:{}};return e[n](c,c.exports,r),c.exports}r.m=e,r.x=function(){var e=r.O(void 0,[937],(function(){return r(299)}));return e=r.O(e)},function(){var e=[];r.O=function(t,n,o,c){if(!n){var i=1/0;for(l=0;l<e.length;l++){n=e[l][0],o=e[l][1],c=e[l][2];for(var a=!0,s=0;s<n.length;s++)(!1&c||i>=c)&&Object.keys(r.O).every((function(e){return r.O[e](n[s])}))?n.splice(s--,1):(a=!1,c<i&&(i=c));if(a){e.splice(l--,1);var u=o();void 0!==u&&(t=u)}}return t}c=c||0;for(var l=e.length;l>0&&e[l-1][2]>c;l--)e[l]=e[l-1];e[l]=[n,o,c]}}(),r.d=function(e,t){for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.f={},r.e=function(e){return Promise.all(Object.keys(r.f).reduce((function(t,n){return r.f[n](e,t),t}),[]))},r.u=function(e){return"static/js/"+e+".e1b1d89f.chunk.js"},r.miniCssF=function(e){},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.p="/",function(){var e={299:1};r.f.i=function(t,n){e[t]||importScripts(r.p+r.u(t))};var t=self.webpackChunkzack_carto_cra=self.webpackChunkzack_carto_cra||[],n=t.push.bind(t);t.push=function(t){var o=t[0],c=t[1],i=t[2];for(var a in c)r.o(c,a)&&(r.m[a]=c[a]);for(i&&i(r);o.length;)e[o.pop()]=1;n(t)}}(),function(){var e=r.x;r.x=function(){return r.e(937).then(e)}}();r.x()}();
//# sourceMappingURL=299.f91e5f5c.chunk.js.map