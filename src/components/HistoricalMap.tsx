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
  color?: string;
};

type HistoricalMapProps = {
  objects: MapObject[];
  currentDate: number;
  onObjectClick: (obj: MapObject) => void;
  selectedObject: MapObject | null;
  onResetZoom?: () => void;
  mapStyle?: 'roadmap' | 'satellite' | 'terrain';
};

const HistoricalMap = ({ objects, currentDate, onObjectClick, selectedObject, onResetZoom, mapStyle = 'roadmap' }: HistoricalMapProps) => {
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

    const tileUrls = {
      roadmap: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    };

    L.tileLayer(tileUrls[mapStyle], {
      attribution: '&copy; Google Maps',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      const isMobile = window.innerWidth < 768;
      const scale = isMobile ? 0.7 : 1;
      const padding = isMobile ? '8px' : '12px';
      const fontSize = isMobile ? '9px' : '13px';
      const lineHeight = isMobile ? '1.4' : '1.8';
      const gap = isMobile ? '4px' : '8px';
      const dotSize = isMobile ? '11px' : '16px';
      const marginBottom = isMobile ? '4px' : '8px';
      
      div.style.cssText = `background: white; padding: ${padding}; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: ${fontSize}; line-height: ${lineHeight};`;
      div.innerHTML = `
        <div style="font-weight: 600; margin-bottom: ${marginBottom}; color: #2C3E50;">Этнический состав</div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #00008B; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Казачьи поселения</span>
        </div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #DC143C; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Русские</span>
        </div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #D2B48C; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Армяне</span>
        </div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #FFD700; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Калмыки</span>
        </div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #228B22; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Украинцы</span>
        </div>
      `;
      return div;
    };
    legend.addTo(map);

    if (onResetZoom) {
      const resetButton = L.control({ position: 'topright' });
      resetButton.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<button id="reset-zoom-btn" style="background: white; border: none; padding: 8px 12px; cursor: pointer; font-size: 12px; font-weight: 500; color: #2C3E50; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">Сбросить масштаб</button>';
        div.onclick = () => {
          map.setView(center, zoom);
        };
        return div;
      };
      resetButton.addTo(map);
    }

    const markers: (L.Marker | L.Tooltip)[] = [];

    activeObjects.forEach(obj => {
      const isSelected = selectedObject?.id === obj.id;
      const color = obj.color || (isSelected ? '#2C3E50' : '#34495E');
      
      const displayName = obj.id === 'don-2' && currentDate >= 1805 ? 'Старочеркасская' : obj.name;
      
      let icon;
      if (obj.id === 'don-13') {
        icon = L.divIcon({
          html: `
            <div style="display: flex; flex-direction: column; align-items: center;">
              <img src="https://cdn.poehali.dev/files/f9f9b854-e9cc-4060-9735-11dd3f038112.png" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
            </div>
          `,
          className: 'custom-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16],
        });
      } else {
        icon = L.divIcon({
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
      }

      let imageHtml = '';
      if (obj.id === 'don-5') {
        imageHtml = `<img src="https://cdn.poehali.dev/files/4133b53a-a3be-4b7d-9e4f-0d7eb349b779.png" alt="Раздорская" style="width: 100%; max-width: 300px; height: auto; margin: 8px 0; border-radius: 4px;" />`;
      } else if (obj.id === 'don-13') {
        imageHtml = `
          <img src="https://cdn.poehali.dev/files/c8ffa25a-804c-4271-aeb2-b4f8566591e8.png" alt="План осады и покорения Азова" style="width: 100%; max-width: 300px; height: auto; margin: 8px 0; border-radius: 4px;" />
          <p style="font-size: 11px; color: #666; text-align: center; margin-top: 4px; margin-bottom: 8px;">План осады и покорения Азова русской армией в 1695 и 1696 годах</p>
        `;
      }
      
      const marker = L.marker([obj.lat, obj.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-size: 14px;">
            <h4 style="font-weight: 600; margin-bottom: 4px;">${displayName}</h4>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${obj.activeFrom}—${obj.activeTo}</p>
            ${imageHtml}
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${obj.info}</p>
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
        .setContent(`<span style="font-size: 13px; font-weight: 600; color: #000000; text-shadow: 1px 1px 3px white, -1px -1px 3px white, 1px -1px 3px white, -1px 1px 3px white, 0 0 5px white;">${displayName}</span>`)
        .addTo(map);

      markers.push(marker, label);
    });

    return () => {
      markers.forEach(m => m.remove());
      map.remove();
    };
  }, [objects, currentDate, selectedObject, onObjectClick, mapStyle]);

  return <div id="map-container" style={{ height: '100%', width: '100%' }} />;
};

export default HistoricalMap;