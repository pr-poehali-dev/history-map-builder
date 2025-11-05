import { useState } from 'react';
import HistoricalMap from '@/components/HistoricalMap';
import MapSelector from '@/components/MapSelector';
import TimeControls from '@/components/TimeControls';
import MapSidebar from '@/components/MapSidebar';
import ObjectDialog from '@/components/ObjectDialog';
import EventDialog from '@/components/EventDialog';
import { maps, mapData } from '@/data/maps';
import { TimeUnit, MapObject, Event } from '@/types/map';

const Index = () => {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(1600);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('year');
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRelatedEvents, setShowRelatedEvents] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'terrain'>('satellite');

  const mapObjects = selectedMap ? mapData[selectedMap]?.objects || [] : [];
  const events = selectedMap ? mapData[selectedMap]?.events || [] : [];
  const categories = Array.from(new Set(events.map(e => e.category)));

  const handleTimeStep = (direction: 'forward' | 'backward') => {
    const steps = {
      year: 1,
      decade: 10,
      '50years': 50,
      century: 100
    };
    const step = steps[timeUnit];
    const newDate = direction === 'forward' ? currentDate + step : currentDate - step;
    const currentMap = maps.find(m => m.id === selectedMap);
    if (currentMap) {
      const clampedDate = Math.max(currentMap.minYear, Math.min(currentMap.maxYear, newDate));
      setCurrentDate(clampedDate);
    }
  };

  const handleSelectMap = (mapId: string, minYear: number) => {
    setSelectedMap(mapId);
    setCurrentDate(minYear);
  };

  const handleBack = () => {
    setSelectedMap(null);
    setSelectedObject(null);
    setSelectedEvent(null);
  };

  const currentMapInfo = maps.find(m => m.id === selectedMap);

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-3 md:p-4 shadow-md">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg md:text-2xl font-bold">Интерактивные исторические карты</h1>
          <a 
            href="https://donstu.ru/university/faculties/social-humanitarian/dokumentovedeniye-i-yazykovaya-kommunikatsiya/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://cdn.poehali.dev/files/b72205f8-b11b-4b2a-990f-44377e2d0012.png" 
              alt="ДГТУ - Документоведение и языковая коммуникация" 
              className="h-[52px] md:h-[70px] w-auto"
            />
          </a>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {!selectedMap ? (
          <MapSelector maps={maps} onSelectMap={handleSelectMap} />
        ) : (
          <div className="flex-1 flex flex-col md:flex-row gap-4 p-2 md:p-4 min-h-0">
            <aside className="w-full md:w-80 flex flex-col gap-3 md:gap-4 min-h-0">
              <TimeControls
                currentDate={currentDate}
                timeUnit={timeUnit}
                minYear={currentMapInfo?.minYear || 1540}
                maxYear={currentMapInfo?.maxYear || 1955}
                mapStyle={mapStyle}
                onDateChange={setCurrentDate}
                onTimeUnitChange={setTimeUnit}
                onTimeStep={handleTimeStep}
                onMapStyleChange={setMapStyle}
                onBack={handleBack}
              />

              <MapSidebar
                currentDate={currentDate}
                mapObjects={mapObjects}
                events={events}
                eventFilter={eventFilter}
                selectedCategory={selectedCategory}
                categories={categories}
                onSelectObject={setSelectedObject}
                onSelectEvent={setSelectedEvent}
                onEventFilterChange={setEventFilter}
                onCategoryChange={setSelectedCategory}
              />
            </aside>

            <main className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 relative bg-muted/20 overflow-hidden min-h-[50vh] md:min-h-0">
                <HistoricalMap
                  objects={mapObjects}
                  currentDate={currentDate}
                  onObjectClick={(obj) => setSelectedObject(obj)}
                  selectedObject={selectedObject}
                  onResetZoom={() => {}}
                  mapStyle={mapStyle}
                />
              </div>
            </main>
          </div>
        )}
      </div>

      <ObjectDialog
        object={selectedObject}
        currentDate={currentDate}
        relatedEvents={events.filter(e => {
          if (Array.isArray(e.objectId)) {
            return e.objectId.includes(selectedObject?.id || '');
          }
          return e.objectId === selectedObject?.id;
        })}
        showRelatedEvents={showRelatedEvents}
        onClose={() => {
          setSelectedObject(null);
          setShowRelatedEvents(false);
        }}
        onToggleRelatedEvents={() => setShowRelatedEvents(!showRelatedEvents)}
        onSelectEvent={setSelectedEvent}
      />

      <EventDialog
        event={selectedEvent}
        mapObjects={mapObjects}
        onClose={() => setSelectedEvent(null)}
        onObjectClick={(obj) => {
          setSelectedObject(obj);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default Index;