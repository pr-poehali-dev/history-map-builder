import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type NamePeriod = {
  name: string;
  fromYear: number;
  toYear: number;
  color?: string;
};

type MapObject = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  info: string;
  activeFrom: number;
  activeTo: number;
  color?: string;
  namePeriods?: NamePeriod[];
  splitColor?: boolean;
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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<(L.Marker | L.Tooltip)[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const activeObjects = objects.filter(obj => 
      currentDate >= obj.activeFrom && currentDate <= obj.activeTo
    );

    let defaultCenter: [number, number] = [47.2357, 39.7015];
    let defaultZoom = 7;

    if (activeObjects.length > 0) {
      const bounds = L.latLngBounds(activeObjects.map(obj => [obj.lat, obj.lng]));
      const centerLatLng = bounds.getCenter();
      defaultCenter = [centerLatLng.lat, centerLatLng.lng];
      
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();
      const latDiff = Math.abs(northEast.lat - southWest.lat);
      const lngDiff = Math.abs(northEast.lng - southWest.lng);
      const maxDiff = Math.max(latDiff, lngDiff);
      
      if (maxDiff < 0.5) defaultZoom = 10;
      else if (maxDiff < 1) defaultZoom = 9;
      else if (maxDiff < 2) defaultZoom = 8;
      else if (maxDiff < 5) defaultZoom = 7;
      else defaultZoom = 6;
    }

    if (!mapRef.current) {
      const map = L.map('map-container', {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
        attributionControl: false,
      });
      mapRef.current = map;
    }

    const map = mapRef.current;

    const tileUrls = {
      roadmap: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    };

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    
    tileLayerRef.current = L.tileLayer(tileUrls[mapStyle], {
      attribution: '',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    map.eachLayer((layer) => {
      if (layer instanceof L.Control) {
        map.removeControl(layer as unknown as L.Control);
      }
    });

    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      const isMobile = window.innerWidth < 768;
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
          <span>Малороссы</span>
        </div>
        <div style="display: flex; align-items: center; gap: ${gap};">
          <span style="width: ${dotSize}; height: ${dotSize}; background: #00BFFF; border-radius: 50%; display: inline-block; flex-shrink: 0;"></span>
          <span>Греки</span>
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
          map.setView(defaultCenter, defaultZoom);
        };
        return div;
      };
      resetButton.addTo(map);
    }

    activeObjects.forEach(obj => {
      const isSelected = selectedObject?.id === obj.id;
      
      let displayName = obj.name;
      let color = obj.color || (isSelected ? '#2C3E50' : '#34495E');
      
      if (obj.id === 'don-2' && currentDate >= 1805) {
        displayName = 'Старочеркасская';
      }
      
      if (obj.namePeriods) {
        const currentPeriod = obj.namePeriods.find(
          p => currentDate >= p.fromYear && currentDate <= p.toYear
        );
        if (currentPeriod) {
          displayName = currentPeriod.name;
          if (currentPeriod.color && currentPeriod.color !== 'split') {
            color = currentPeriod.color;
          }
        }
      }
      
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
      } else if (obj.splitColor && obj.namePeriods) {
        const currentPeriod = obj.namePeriods.find(
          p => currentDate >= p.fromYear && currentDate <= p.toYear
        );
        if (currentPeriod && currentPeriod.color === 'split') {
          icon = L.divIcon({
            html: `
              <div style="display: flex; flex-direction: column; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id="half-circle-left-${obj.id}">
                      <rect x="0" y="0" width="12" height="24" />
                    </clipPath>
                    <clipPath id="half-circle-right-${obj.id}">
                      <rect x="12" y="0" width="12" height="24" />
                    </clipPath>
                  </defs>
                  <circle cx="12" cy="12" r="8" fill="#DC143C" opacity="0.8" stroke="white" stroke-width="2" clip-path="url(#half-circle-left-${obj.id})"/>
                  <circle cx="12" cy="12" r="8" fill="#228B22" opacity="0.8" stroke="white" stroke-width="2" clip-path="url(#half-circle-right-${obj.id})"/>
                  <circle cx="12" cy="12" r="4" fill="#DC143C" clip-path="url(#half-circle-left-${obj.id})"/>
                  <circle cx="12" cy="12" r="4" fill="#228B22" clip-path="url(#half-circle-right-${obj.id})"/>
                </svg>
              </div>
            `,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12],
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

      markersRef.current.push(marker, label);
    });
  }, [objects, currentDate, selectedObject, onObjectClick, mapStyle]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="map-container" style={{ height: '100%', width: '100%' }} />;
};

export default HistoricalMap;