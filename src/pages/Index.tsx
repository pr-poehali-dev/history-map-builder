import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import HistoricalMap from '@/components/HistoricalMap';

type TimeUnit = 'day' | 'month' | 'year' | 'decade' | '50years' | 'century';
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
type Event = {
  id: string;
  date: number;
  title: string;
  description: string;
  category: string;
  objectId?: string;
};

const Index = () => {
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(1600);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('year');
  const [hoveredObject, setHoveredObject] = useState<MapObject | null>(null);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRelatedEvents, setShowRelatedEvents] = useState(false);
  const [eventFilter, setEventFilter] = useState<'all' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite' | 'terrain'>('satellite');

  const maps = [
    { id: 'don', name: 'История Донского региона', period: '1540-1955', minYear: 1540, maxYear: 1955, image: 'https://cdn.poehali.dev/files/9a4bf4f3-423d-48b8-a40e-154723174a7d.png' },
    { id: 'smuta', name: 'Смутное время', period: '1598-1613', minYear: 1598, maxYear: 1613, image: 'https://cdn.poehali.dev/files/7a685934-a9e4-4bc2-88a0-00adace0f210.png' }
  ];

  const mapData = {
    don: {
      objects: [
        { id: 'don-1', name: 'Азов', lat: 47.1064, lng: 39.4178, info: 'Древняя турецкая крепость на Азовском море, важный стратегический пункт в борьбе России за выход к морю', activeFrom: 1475, activeTo: 1955 },
        { id: 'don-2', name: 'Черкасск', lat: 47.238440, lng: 40.037454, info: 'Первая столица Войска Донского, центр казачьего самоуправления до переноса столицы в Новочеркасск', activeFrom: 1570, activeTo: 1955, color: '#00008B' },
        { id: 'don-3', name: 'Новочеркасск', lat: 47.4221, lng: 40.0931, info: 'Столица Донского казачества, основана атаманом Платовым как новый административный центр', activeFrom: 1805, activeTo: 1955, color: '#00008B' },
        { id: 'don-4', name: 'Таганрог', lat: 47.2357, lng: 38.8974, info: 'Первый российский порт на Азовском море, основан Петром I как военно-морская база', activeFrom: 1698, activeTo: 1955, color: '#DC143C' },
        { id: 'don-5', name: 'Раздорская', lat: 47.540587, lng: 40.648557, info: 'Одна из старейших казачьих станиц на Дону, первое упоминание в исторических документах', activeFrom: 1570, activeTo: 1955, color: '#00008B' },
        { id: 'don-6', name: 'Ростов-на-Дону', lat: 47.217876, lng: 39.711994, info: 'Крупнейший город региона, основан как крепость для защиты южных рубежей России', activeFrom: 1749, activeTo: 1955, color: '#DC143C' },
        { id: 'don-7', name: 'Батайск', lat: 47.1378, lng: 39.7514, info: 'Город на левом берегу Дона, развивался как железнодорожный узел и промышленный центр', activeFrom: 1769, activeTo: 1955, color: '#DC143C' },
        { id: 'don-8', name: 'Койсуг', lat: 47.126363, lng: 39.687106, info: 'Татарское поселение у устья реки Темерник, позже вошло в состав Ростова-на-Дону', activeFrom: 1769, activeTo: 1955, color: '#00008B' },
        { id: 'don-9', name: 'Нахичевань-на-Дону', lat: 47.230393, lng: 39.764744, info: 'Армянский город, основанный переселенцами из Крыма, позже вошел в состав Ростова', activeFrom: 1779, activeTo: 1927 },
        { id: 'don-10', name: 'Усть-Аксайская', lat: 47.2642, lng: 39.8667, info: 'Казачья станица на реке Аксай, важный торговый пункт на пути к Азову', activeFrom: 1730, activeTo: 1955, color: '#00008B' },
        { id: 'don-11', name: 'Кагальницкая', lat: 46.882403, lng: 40.145216, info: 'Казачья станица на реке Кагальник, основана казаками Донского войска как поселение на южных рубежах', activeFrom: 1809, activeTo: 1955, color: '#00008B' },
        { id: 'don-12', name: 'Новобатайск', lat: 46.898803, lng: 39.780816, info: 'Село на левом берегу Дона, основано крестьянами-переселенцами в начале XIX века', activeFrom: 1812, activeTo: 1955, color: '#DC143C' }
      ],
      events: [
        { id: 'don-e1', date: 1570, title: 'Первые казачьи городки', description: 'Основание станиц Раздорской и других казачьих поселений на Дону', category: 'География', objectId: 'don-5' },
        { id: 'don-e2', date: 1637, title: 'Азовское сидение', description: 'Донские казаки героически защищали захваченную турецкую крепость Азов от османских войск', category: 'Военная история', objectId: 'don-1' },
        { id: 'don-e3', date: 1696, title: 'Взятие Азова Петром I', description: 'Первый Азовский поход завершился успехом, Россия получила выход к Азовскому морю', category: 'Военная история', objectId: 'don-1' },
        { id: 'don-e4', date: 1698, title: 'Основание Таганрога', description: 'Петр I основал первый российский порт на Азовском море и военно-морскую крепость', category: 'География', objectId: 'don-4' },
        { id: 'don-e5', date: 1708, title: 'Восстание Булавина', description: 'Крупнейшее казачье восстание против политики Петра I и вмешательства в казачье самоуправление', category: 'Социальная история', objectId: 'don-2' },
        { id: 'don-e6', date: 1749, title: 'Основание крепости Святого Димитрия Ростовского', description: 'Заложена таможенная крепость, положившая начало Ростову-на-Дону', category: 'География', objectId: 'don-6' },
        { id: 'don-e7', date: 1761, title: 'Темерницкая таможня', description: 'Ростовская крепость становится важным торговым пунктом на южных рубежах', category: 'Экономика', objectId: 'don-6' },
        { id: 'don-e8', date: 1779, title: 'Основание Нахичевани', description: 'Армянские переселенцы из Крыма основали город рядом с Ростовом', category: 'География', objectId: 'don-9' },
        { id: 'don-e9', date: 1805, title: 'Основание Новочеркасска', description: 'Атаман Платов перенес столицу Войска Донского из затопляемого Черкасска', category: 'География', objectId: 'don-3' },
        { id: 'don-e10', date: 1835, title: 'Ростов получает статус города', description: 'Крепость преобразована в город, начинается бурное экономическое развитие', category: 'Экономика', objectId: 'don-6' },
        { id: 'don-e11', date: 1870, title: 'Железная дорога в Ростове', description: 'Открытие железнодорожного сообщения превратило Ростов в крупнейший транспортный узел юга России', category: 'Экономика', objectId: 'don-6' },
        { id: 'don-e12', date: 1887, title: 'Батайск - железнодорожная станция', description: 'Развитие Батайска как важного железнодорожного узла', category: 'Экономика', objectId: 'don-7' },
        { id: 'don-e13', date: 1918, title: 'Гражданская война на Дону', description: 'Ростов и Донская область стали ареной ожесточенных боев Гражданской войны', category: 'Военная история', objectId: 'don-6' },
        { id: 'don-e14', date: 1928, title: 'Объединение Ростова и Нахичевани', description: '28 декабря Нахичевань-на-Дону официально вошла в состав Ростова-на-Дону, образовав единый город', category: 'География', objectId: 'don-6' },
        { id: 'don-e15', date: 1942, title: 'Оборона Ростова', description: 'Ростов дважды оккупирован немецкими войсками в ходе Великой Отечественной войны', category: 'Военная история', objectId: 'don-6' }
      ],
      categories: ['География', 'Военная история', 'Социальная история', 'Экономика']
    },
    smuta: {
      objects: [
        { id: 'smuta-1', name: 'Москва', lat: 55.7558, lng: 37.6173, info: 'Столица государства', activeFrom: 1598, activeTo: 1613 },
        { id: 'smuta-2', name: 'Тушино', lat: 55.8270, lng: 37.4370, info: 'Лагерь Лжедмитрия II', activeFrom: 1608, activeTo: 1610 },
        { id: 'smuta-3', name: 'Нижний Новгород', lat: 56.2965, lng: 43.9361, info: 'Центр ополчения Минина и Пожарского', activeFrom: 1611, activeTo: 1613 },
        { id: 'smuta-4', name: 'Троице-Сергиева лавра', lat: 56.3112, lng: 38.1377, info: 'Центр сопротивления польским интервентам', activeFrom: 1608, activeTo: 1610 }
      ],
      events: [
        { id: 'smuta-e1', date: 1598, title: 'Смерть царя Фёдора', description: 'Пресеклась династия Рюриковичей', category: 'Политика', objectId: 'smuta-1' },
        { id: 'smuta-e2', date: 1605, title: 'Вступление Лжедмитрия I в Москву', description: 'Самозванец занял престол', category: 'Политика', objectId: 'smuta-1' },
        { id: 'smuta-e3', date: 1608, title: 'Осада Троице-Сергиевой лавры', description: 'Героическая оборона монастыря', category: 'Военная история', objectId: 'smuta-4' },
        { id: 'smuta-e4', date: 1611, title: 'Формирование ополчения', description: 'Минин и Пожарский собирают войско', category: 'Военная история', objectId: 'smuta-3' },
        { id: 'smuta-e5', date: 1612, title: 'Освобождение Москвы', description: 'Ополчение освободило столицу от поляков', category: 'Военная история', objectId: 'smuta-1' },
        { id: 'smuta-e6', date: 1613, title: 'Избрание Михаила Романова', description: 'Земский собор избрал нового царя', category: 'Политика', objectId: 'smuta-1' }
      ],
      categories: ['Политика', 'Военная история']
    }
  };

  const currentMapData = selectedMap ? mapData[selectedMap as keyof typeof mapData] : null;
  const mapObjects = currentMapData?.objects || [];
  const events = currentMapData?.events || [];
  const categories = currentMapData?.categories || [];
  const currentMapInfo = maps.find(m => m.id === selectedMap);

  const filteredEvents = events.filter(e => {
    if (eventFilter === 'all') return true;
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const activeObjects = mapObjects.filter(obj => 
    currentDate >= obj.activeFrom && currentDate <= obj.activeTo
  );

  if (!selectedMap) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-3xl font-semibold text-primary">HistoMap</h1>
            <p className="text-sm text-muted-foreground mt-1">Интерактивные хронологические карты</p>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <nav className="flex gap-8 mb-12 border-b border-border">
            <button className="pb-3 border-b-2 border-primary text-primary font-medium">Карты</button>
            <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">Редактор карт</button>
            <button className="pb-3 text-muted-foreground hover:text-foreground transition-colors">Справка</button>
          </nav>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {maps.map(map => (
              <Card 
                key={map.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-all border-border"
                onClick={() => {
                  setSelectedMap(map.id);
                  setCurrentDate(map.minYear);
                  setEventFilter('all');
                  setSelectedCategory('all');
                  setSelectedObject(null);
                  setSelectedEvent(null);
                  setShowRelatedEvents(false);
                }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Map" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{map.name}</h3>
                      <p className="text-sm text-muted-foreground">{map.period}</p>
                    </div>
                  </div>
                </div>
                {map.image && (
                  <img 
                    src={map.image} 
                    alt={map.name}
                    className="w-full h-48 object-cover"
                  />
                )}
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <header className="border-b border-border flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedMap(null)}>
              <Icon name="ArrowLeft" size={18} />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {maps.find(m => m.id === selectedMap)?.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {maps.find(m => m.id === selectedMap)?.period}
              </p>
            </div>
          </div>
          <nav className="flex gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Редактор карты
            </button>
          </nav>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <aside className="md:w-80 border-r md:border-r border-b md:border-b-0 border-border flex flex-col order-2 md:order-1 h-64 md:h-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold mb-3">События</h2>
            <Tabs value={eventFilter} onValueChange={(v) => setEventFilter(v as any)}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="all" className="text-xs">По датам</TabsTrigger>
                <TabsTrigger value="category" className="text-xs">По сюжетам</TabsTrigger>
              </TabsList>
            </Tabs>
            {eventFilter === 'category' && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mt-3 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все сюжеты</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 md:space-y-3 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible">
              {filteredEvents.map(event => (
                <Card 
                  key={event.id}
                  className={`p-3 cursor-pointer transition-all border flex-shrink-0 w-64 md:w-auto ${
                    Math.abs(event.date - currentDate) < 10 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setCurrentDate(event.date);
                    setSelectedEvent(event);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xs font-medium text-primary">{event.date}</span>
                        {event.objectId && (
                          <Icon name="MapPin" size={12} className="text-primary flex-shrink-0" />
                        )}
                      </div>
                      <h4 className="text-sm font-medium mb-1">{event.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                      <span className="text-xs text-muted-foreground mt-1 inline-block">{event.category}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col order-1 md:order-2 min-h-0">
          <div className="p-4 md:p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Временная шкала</span>
                  <span className="text-xl md:text-2xl font-semibold">{currentDate}</span>
                </div>
                <Slider 
                  value={[currentDate]} 
                  onValueChange={(v) => setCurrentDate(v[0])}
                  min={currentMapInfo?.minYear || 1550}
                  max={currentMapInfo?.maxYear || 1920}
                  step={1}
                  className="w-full"
                />
              </div>
              <Select value={timeUnit} onValueChange={(v) => setTimeUnit(v as TimeUnit)}>
                <SelectTrigger className="w-24 md:w-32 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">День</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                  <SelectItem value="year">Год</SelectItem>
                  <SelectItem value="decade">Десятилетие</SelectItem>
                  <SelectItem value="50years">50 лет</SelectItem>
                  <SelectItem value="century">Век</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Стиль карты:</span>
              <div className="flex gap-2">
                <Button
                  variant={mapStyle === 'roadmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('roadmap')}
                >
                  Дорожная
                </Button>
                <Button
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('satellite')}
                >
                  Спутник
                </Button>
                <Button
                  variant={mapStyle === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('terrain')}
                >
                  Рельеф
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative bg-muted/20 overflow-hidden min-h-0">
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

      <Dialog open={!!selectedObject} onOpenChange={() => {
        setSelectedObject(null);
        setShowRelatedEvents(false);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedObject?.id === 'don-2' && currentDate >= 1805 ? 'Старочеркасская' : selectedObject?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedObject?.activeFrom}—{selectedObject?.activeTo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedObject?.id === 'don-5' && (
              <img 
                src="https://cdn.poehali.dev/files/4133b53a-a3be-4b7d-9e4f-0d7eb349b779.png" 
                alt="Раздорская" 
                className="w-full rounded-md"
              />
            )}
            <p className="text-sm text-foreground">{selectedObject?.info}</p>
            
            {events.filter(e => e.objectId === selectedObject?.id).length > 0 && (
              <>
                <Separator />
                
                {!showRelatedEvents ? (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowRelatedEvents(true)}
                  >
                    Связанные события ({events.filter(e => e.objectId === selectedObject?.id).length})
                  </Button>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold">Связанные события</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowRelatedEvents(false)}
                      >
                        Скрыть
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {events
                        .filter(e => e.objectId === selectedObject?.id)
                        .map(event => (
                          <div 
                            key={event.id} 
                            className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => {
                              setCurrentDate(event.date);
                              setSelectedObject(null);
                              setShowRelatedEvents(false);
                            }}
                          >
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-xs font-medium text-primary">{event.date}</span>
                              <span className="text-xs text-muted-foreground">{event.category}</span>
                            </div>
                            <h5 className="text-sm font-medium mb-1">{event.title}</h5>
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date} • {selectedEvent?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground">{selectedEvent?.description}</p>
            
            {selectedEvent?.objectId && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Место события:</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const obj = mapObjects.find(o => o.id === selectedEvent.objectId);
                      if (obj) {
                        setSelectedObject(obj);
                        setSelectedEvent(null);
                      }
                    }}
                  >
                    {mapObjects.find(o => o.id === selectedEvent.objectId)?.name}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;