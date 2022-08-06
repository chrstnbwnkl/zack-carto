import React, { useState, useRef, useEffect } from "react"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import "./Map.css"

const Map = ({ onMove, features }) => {
  const [mapInstance, setMapInstance] = useState(null)
  const mapRef = useRef(null)

  useEffect(() => {
    mapRef.current = L.map("map", {
      center: [51.8, 8.205],
      zoom: 13,
      renderer: L.canvas(),
    })
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    )
    osm.addTo(mapRef.current)
    setMapInstance(mapRef.current)
    onMove(mapRef.current.getBounds())
    mapRef.current.on("move", (e) => {
      onMove(e.target.getBounds())
    })
  }, []) // only render once

  useEffect(() => {
    const groups = [L.layerGroup(), L.layerGroup(), L.layerGroup()]
    let [roadGroup, waterGroup, placeGroup] = groups
    if (features) {
      features.map((feat) => {
        let layer
        if (feat.properties.highway !== undefined) {
          layer = L.geoJSON(feat)
          roadGroup.addLayer(layer)
        } else if (feat.properties.waterway !== undefined) {
          layer = L.geoJSON(feat)
          waterGroup.addLayer(layer)
        } else if (feat.properties.place !== undefined) {
          layer = L.geoJSON(feat, {
            pointToLayer: (f, ll) => {
              return L.circleMarker(ll, {
                radius: 5,
                fillColor: "#ff7800",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7,
              })
            },
          })
          placeGroup.addLayer(layer)
        }
      })
      roadGroup.addTo(mapInstance)
      waterGroup.addTo(mapInstance)
      placeGroup.addTo(mapInstance)
    }
    return () => {
      groups.forEach((group) => {
        if (typeof group.remove === "function") {
          group.remove()
        }
      })
    }
  }, [features])
  return <div id="map"></div>
}

export default Map
