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
  const [currentMonth, setCurrentMonth] = useState(0);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('year');
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRelatedEvents, setShowRelatedEvents] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'terrain'>('satellite');

  const mapObjects = selectedMap ? mapData[selectedMap]?.objects || [] : [];
  const events = selectedMap ? mapData[selectedMap]?.events || [] : [];
  const boundaries = selectedMap ? mapData[selectedMap]?.boundaries || [] : [];
  const categories = Array.from(new Set(events.map(e => e.category)));

  const handleTimeStep = (direction: 'forward' | 'backward') => {
    const currentMap = maps.find(m => m.id === selectedMap);
    if (!currentMap) return;

    if (timeUnit === 'month') {
      const totalMonths = currentDate * 12 + currentMonth + (direction === 'forward' ? 1 : -1);
      const minTotalMonths = currentMap.minYear * 12;
      const maxTotalMonths = currentMap.maxYear * 12 + 11;
      const clampedTotalMonths = Math.max(minTotalMonths, Math.min(maxTotalMonths, totalMonths));
      const newYear = Math.floor(clampedTotalMonths / 12);
      const newMonth = clampedTotalMonths % 12;
      setCurrentDate(newYear);
      setCurrentMonth(newMonth);
      return;
    }

    const steps = {
      year: 1,
      decade: 10,
      '50years': 50,
      century: 100
    };
    const step = steps[timeUnit as 'year' | 'decade' | '50years' | 'century'];
    const newDate = direction === 'forward' ? currentDate + step : currentDate - step;
    const clampedDate = Math.max(currentMap.minYear, Math.min(currentMap.maxYear, newDate));
    setCurrentDate(clampedDate);
  };

  const handleSelectMap = (mapId: string, minYear: number) => {
    setSelectedMap(mapId);
    setCurrentDate(minYear);
    setCurrentMonth(0);
  };

  const handleBack = () => {
    setSelectedMap(null);
    setSelectedObject(null);
    setSelectedEvent(null);
  };

  const currentMapInfo = maps.find(m => m.id === selectedMap);

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="bg-black text-[#FCD975] p-3 md:p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#FCD975] flex-shrink-0 overflow-hidden">
              <img
                src="https://cdn.poehali.dev/projects/1b4b70d3-baad-4bc6-90fd-9ea77f09c262/bucket/abfe84db-251f-4ef9-8590-bc02245cda79.png"
                alt="Эмблема"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-center md:text-left">Интерактивные исторические карты</h1>
          </div>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <a 
              href="https://donstu.ru/university/faculties/social-humanitarian/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-80 transition-opacity order-1 md:order-2"
            >
              <img 
                src="https://cdn.poehali.dev/files/5508b17c-e6e4-498d-82ed-868c368743a8.png" 
                alt="ДГТУ - Социально-гуманитарный факультет" 
                className="h-[62px] md:h-[84px] w-auto"
              />
            </a>
            <a 
              href="https://donstu.ru/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-80 transition-opacity order-2 md:order-1"
            >
              <img 
                src="https://cdn.poehali.dev/files/771b45e7-4463-4630-aad4-88dc6688fdd9.png" 
                alt="ДГТУ" 
                className="h-[62px] md:h-[84px] w-auto"
              />
            </a>
            <a 
              href="https://donstu.ru/university/faculties/social-humanitarian/dokumentovedeniye-i-yazykovaya-kommunikatsiya/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:opacity-80 transition-opacity order-3"
            >
              <img 
                src="https://cdn.poehali.dev/files/b72205f8-b11b-4b2a-990f-44377e2d0012.png" 
                alt="ДГТУ - Документоведение и языковая коммуникация" 
                className="h-[62px] md:h-[84px] w-auto"
              />
            </a>
          </div>
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
                currentMonth={currentMonth}
                timeUnit={timeUnit}
                minYear={currentMapInfo?.minYear || 1540}
                maxYear={currentMapInfo?.maxYear || 1955}
                mapStyle={mapStyle}
                onDateChange={(date) => {
                  setCurrentDate(date);
                  setCurrentMonth(0);
                }}
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
                  boundaries={boundaries}
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