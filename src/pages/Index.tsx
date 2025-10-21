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
  const [eventFilter, setEventFilter] = useState<'all' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const maps = [
    { id: 'don', name: 'История Донского региона', period: '1550-1920' },
    { id: 'smuta', name: 'Смутное время', period: '1598-1613' }
  ];

  const mapObjects: MapObject[] = [
    { id: '1', name: 'Азов', lat: 47.1064, lng: 39.4178, info: 'Крепость на Азовском море', activeFrom: 1475, activeTo: 1920 },
    { id: '2', name: 'Черкасск', lat: 47.2416, lng: 39.4470, info: 'Столица Войска Донского', activeFrom: 1570, activeTo: 1805 },
    { id: '3', name: 'Новочеркасск', lat: 47.4221, lng: 40.0931, info: 'Новая столица казачества', activeFrom: 1805, activeTo: 1920 },
    { id: '4', name: 'Таганрог', lat: 47.2357, lng: 38.8974, info: 'Порт и крепость', activeFrom: 1698, activeTo: 1920 }
  ];

  const events: Event[] = [
    { id: '1', date: 1570, title: 'Основание Черкасска', description: 'Казаки основали поселение на Дону', category: 'География', objectId: '2' },
    { id: '2', date: 1637, title: 'Азовское сидение', description: 'Донские казаки захватили турецкую крепость Азов', category: 'Военная история', objectId: '1' },
    { id: '3', date: 1698, title: 'Основание Таганрога', description: 'Петр I основал крепость и порт', category: 'География', objectId: '4' },
    { id: '4', date: 1708, title: 'Восстание Булавина', description: 'Казачье восстание против реформ Петра I', category: 'Социальная история' },
    { id: '5', date: 1805, title: 'Основание Новочеркасска', description: 'Перенос столицы Войска Донского', category: 'География', objectId: '3' }
  ];

  const categories = ['География', 'Военная история', 'Социальная история'];

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
                className="p-6 cursor-pointer hover:shadow-lg transition-all border-border"
                onClick={() => setSelectedMap(map.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Map" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium mb-2">{map.name}</h3>
                    <p className="text-sm text-muted-foreground">{map.period}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-border flex flex-col">
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
            <div className="p-4 space-y-3">
              {filteredEvents.map(event => (
                <Card 
                  key={event.id}
                  className={`p-3 cursor-pointer transition-all border ${
                    Math.abs(event.date - currentDate) < 10 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setCurrentDate(event.date);
                    if (event.objectId) {
                      const obj = mapObjects.find(o => o.id === event.objectId);
                      if (obj) setSelectedObject(obj);
                    }
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

        <main className="flex-1 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Временная шкала</span>
                  <span className="text-2xl font-semibold">{currentDate}</span>
                </div>
                <Slider 
                  value={[currentDate]} 
                  onValueChange={(v) => setCurrentDate(v[0])}
                  min={1550}
                  max={1920}
                  step={1}
                  className="w-full"
                />
              </div>
              <Select value={timeUnit} onValueChange={(v) => setTimeUnit(v as TimeUnit)}>
                <SelectTrigger className="w-32 h-9 text-sm">
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
          </div>

          <div className="flex-1 relative bg-muted/20 overflow-hidden">
            <HistoricalMap
              objects={mapObjects}
              currentDate={currentDate}
              onObjectClick={setSelectedObject}
              selectedObject={selectedObject}
            />
          </div>
        </main>
      </div>

      <Dialog open={!!selectedObject} onOpenChange={() => setSelectedObject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedObject?.name}</DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>{selectedObject?.info}</p>
              <Separator />
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-medium">Период существования:</span>
                  <p className="text-sm">{selectedObject?.activeFrom}—{selectedObject?.activeTo}</p>
                </div>
                <div>
                  <span className="text-xs font-medium">Текущий год:</span>
                  <p className="text-sm">{currentDate}</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;