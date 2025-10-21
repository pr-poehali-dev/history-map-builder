import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

const createCustomIcon = (isActive: boolean, isSelected: boolean) => {
  const color = isSelected ? '#2C3E50' : isActive ? '#34495E' : '#95A5A6';
  const svgIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="${color}" opacity="0.8" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="${color}"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const HistoricalMap = ({ objects, currentDate, onObjectClick, selectedObject }: HistoricalMapProps) => {
  const activeObjects = objects.filter(obj => 
    currentDate >= obj.activeFrom && currentDate <= obj.activeTo
  );

  const center: [number, number] = [47.2357, 39.7015];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} />
      
      {activeObjects.map(obj => {
        const isSelected = selectedObject?.id === obj.id;
        const isActive = currentDate >= obj.activeFrom && currentDate <= obj.activeTo;
        
        return (
          <Marker
            key={obj.id}
            position={[obj.lat, obj.lng]}
            icon={createCustomIcon(isActive, isSelected)}
            eventHandlers={{
              click: () => onObjectClick(obj),
            }}
          >
            <Popup>
              <div className="text-sm">
                <h4 className="font-semibold mb-1">{obj.name}</h4>
                <p className="text-xs text-muted-foreground mb-1">{obj.info}</p>
                <p className="text-xs text-muted-foreground">
                  {obj.activeFrom}—{obj.activeTo}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default HistoricalMap;
