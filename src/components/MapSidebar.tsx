import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Event } from '@/types/map';

type MapSidebarProps = {
  events: Event[];
  eventFilter: 'all' | 'category';
  selectedCategory: string;
  categories: string[];
  onSelectEvent: (event: Event) => void;
  onEventFilterChange: (filter: 'all' | 'category') => void;
  onCategoryChange: (category: string) => void;
};

const MapSidebar = ({
  events,
  eventFilter,
  selectedCategory,
  categories,
  onSelectEvent,
  onEventFilterChange,
  onCategoryChange
}: MapSidebarProps) => {
  const personalityEvents = events.filter(e => e.category === 'Персоналии');
  const nonPersonalityEvents = events.filter(e => e.category !== 'Персоналии');

  const filteredEvents = eventFilter === 'all' 
    ? nonPersonalityEvents 
    : selectedCategory === 'all' 
      ? nonPersonalityEvents 
      : nonPersonalityEvents.filter(e => e.category === selectedCategory);

  return (
    <Card className="flex-1 flex flex-col min-h-0">
      <Tabs defaultValue="personalities" className="flex flex-col h-full">
        <div className="p-2 md:p-4 pb-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personalities" className="text-xs md:text-sm">Личности</TabsTrigger>
            <TabsTrigger value="events" className="text-xs md:text-sm">События</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personalities" className="flex-1 m-0 px-2 md:px-4 pt-2 md:pt-4 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-2 pr-2 md:pr-4">
              {personalityEvents.length === 0 ? (
                <p className="text-xs md:text-sm text-muted-foreground text-center py-4">
                  Нет данных о личностях для этой карты
                </p>
              ) : (
                personalityEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-2 md:p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onSelectEvent(event)}
                  >
                    <h4 className="font-medium text-xs md:text-sm">
                      {event.title}
                    </h4>
                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                      {event.date}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="events" className="flex-1 m-0 px-2 md:px-4 pt-2 md:pt-4 overflow-hidden flex flex-col">
          <div className="mb-3 md:mb-4 space-y-2 flex-shrink-0">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={eventFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onEventFilterChange('all')}
                className="w-full text-xs md:text-sm"
              >
                Все события
              </Button>
              <Button
                variant={eventFilter === 'category' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onEventFilterChange('category')}
                className="w-full text-xs md:text-sm"
              >
                По категории
              </Button>
            </div>

            {eventFilter === 'category' && (
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-9 text-xs md:text-sm">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-2 md:pr-4">
              {filteredEvents
                .sort((a, b) => a.date - b.date)
                .map(event => (
                  <div
                    key={event.id}
                    className="p-2 md:p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onSelectEvent(event)}
                  >
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] md:text-xs font-medium text-primary">{event.date}</span>
                      <span className="text-[10px] md:text-xs text-muted-foreground">{event.category}</span>
                    </div>
                    <h4 className="font-medium text-xs md:text-sm">{event.title}</h4>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MapSidebar;