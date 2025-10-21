import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type MapObject = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info: string;
  activeFrom: number;
  activeTo: number;
};

type HistoricalMapProps = {
  objects: MapObject[];
  currentDate: number;
  onObjectClick: (obj: MapObject) => void;
  selectedObject: MapObject | null;
};

const HistoricalMap = ({ objects, currentDate, onObjectClick, selectedObject }: HistoricalMapProps) => {
  useEffect(() => {
    const activeObjects = objects.filter(obj => 
      currentDate >= obj.activeFrom && currentDate <= obj.activeTo
    );

    let center: [number, number] = [47.2357, 39.7015];
    let zoom = 7;

    if (activeObjects.length > 0) {
      const bounds = L.latLngBounds(activeObjects.map(obj => [obj.lat, obj.lng]));
      const centerLatLng = bounds.getCenter();
      center = [centerLatLng.lat, centerLatLng.lng];
      
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      const latDiff = Math.abs(northEast.lat - southWest.lat);
      const lngDiff = Math.abs(northEast.lng - southWest.lng);
      const maxDiff = Math.max(latDiff, lngDiff);
      
      if (maxDiff < 0.5) zoom = 10;
      else if (maxDiff < 1) zoom = 9;
      else if (maxDiff < 2) zoom = 8;
      else if (maxDiff < 5) zoom = 7;
      else zoom = 6;
    }

    const map = L.map('map-container', {
      center,
      zoom,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const markers: (L.Marker | L.Tooltip)[] = [];

    activeObjects.forEach(obj => {
      const isSelected = selectedObject?.id === obj.id;
      const color = isSelected ? '#2C3E50' : '#34495E';
      
      const icon = L.divIcon({
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="${color}" opacity="0.8" stroke="white" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" fill="${color}"/>
            </svg>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([obj.lat, obj.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size: 14px;">
            <h4 style="font-weight: 600; margin-bottom: 4px;">${obj.name}</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${obj.info}</p>
            <p style="font-size: 12px; color: #666;">${obj.activeFrom}—${obj.activeTo}</p>
          </div>
        `);

      marker.on('click', () => {
        onObjectClick(obj);
      });

      const label = L.tooltip({
        permanent: true,
        direction: 'bottom',
        className: 'map-label',
        offset: [0, 8]
      })
        .setLatLng([obj.lat, obj.lng])
        .setContent(`<span style="font-size: 12px; font-weight: 500; color: #2C3E50; text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;">${obj.name}</span>`)
        .addTo(map);

      markers.push(marker, label);
    });

    return () => {
      markers.forEach(m => m.remove());
      map.remove();
    };
  }, [objects, currentDate, selectedObject, onObjectClick]);

  return <div id="map-container" style={{ height: '100%', width: '100%' }} />;
};

export default HistoricalMap;