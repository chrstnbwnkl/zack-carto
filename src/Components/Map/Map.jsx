import React, { useState, useRef, useEffect } from "react"
import L from "leaflet"

import "leaflet/dist/leaflet.css"
import "./Map.css"

const Map = ({
  view,
  onMove,
  featureCollections,
  uploadedGeoJSON,
  config,
  error,
}) => {
  const [mapInstance, setMapInstance] = useState(null)
  const mapRef = useRef(null)

  const errorClsName = `error-wrapper ${error ? "visible" : "hidden"}`

  const handleMove = (e) => {
    const center = e.target.getCenter()
    const zoom = e.target.getZoom()
    onMove(e.target.getBounds(), [center.lat, center.lng], zoom)
  }

  useEffect(() => {
    mapRef.current = L.map("map", {
      center: view.center,
      zoom: view.zoom,
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
      handleMove(e)
    })
  }, []) // only render once

  useEffect(() => {
    const layers = []
    if (featureCollections) {
      for (const k in config) {
        const c = config[k]
        const fc = featureCollections[k]
        const opts = {}
        if (c.osmElement !== "node") {
          opts.style = c._leafletFunc
        } else {
          opts.pointToLayer = (feat, ll) => {
            return L.circleMarker(ll, c._leafletFunc(feat))
          }
        }
        const geoJSON = L.geoJSON(fc, opts).addTo(mapInstance)
        layers.push(geoJSON)
      }
    }

    return () => {
      layers.forEach((layer) => {
        if (typeof layer.remove === "function") {
          layer.remove()
        }
      })
    }
  }, [featureCollections])

  useEffect(() => {
    const layers = []
    uploadedGeoJSON.forEach((geoJSON) => {
      let opts = {}
      if (geoJSON.features[0].geometry.type === "Point") {
        opts.pointToLayer = (feat, ll) => {
          return L.circleMarker(ll)
        }
      }
      const layer = L.geoJSON(geoJSON, opts).addTo(mapInstance)
      layers.push(layer)
      console.log("layer added")
    })

    return () => {
      layers.forEach((layer) => {
        if (typeof layer.remove === "function") {
          layer.remove()
        }
      })
    }
  }, [uploadedGeoJSON])

  return (
    <>
      <div id="map"></div>
      <div className={errorClsName}>
        <div className="error-inner">
          <p>{error}</p>
        </div>
      </div>
    </>
  )
}

export default Map
