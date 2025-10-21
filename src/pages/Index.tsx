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
  image?: string;
  customDate?: string;
};
type Event = {
  id: string;
  date: number;
  title: string;
  description: string;
  category: string;
  objectId?: string;
  image?: string;
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
        { id: 'don-1', name: 'Азов', lat: 47.1064, lng: 39.4178, info: `Азов — один из древнейших городов Юга России, расположенный на левом берегу реки Дон в 12,5 километрах от его впадения в Таганрогский залив. Город занимает стратегически важное положение, благодаря чему на протяжении веков играл значительную роль в истории региона.

История Азова началась более двух тысяч лет назад, когда на этой территории появились первые поселения скифов. В I–III веках здесь существовали два крупных земледельческих поселения меотов — Паниардис и Патарва, входившие в систему укреплённых городищ Боспорского царства.

Первое письменное упоминание о золотоордынском городе Азак-Тана, относится к 1269 г. В это время проводится социально-экономическая политика ханом Золотой Орды — Менгу-Тимуром, связанная, с независимой политикой от Каракорума — освоение новых городов, таких как Азак.

В 1471 году город взят турками: и с этого времени вследствие запрещения европейским судам входить в Чёрное море, особенно же вследствие открытия морского пути в Индию, торговля в Азове пришла в совершенный упадок. Османская империя, дабы избежать набегов флотилий донских казаков на Крым и Северную Анатолию, соорудило здесь крепость (тур. Azak). Казакам крепость эта была особенно ненавистна, потому что препятствовала выходу их в Азовское море для торговли и набегов.

Особую известность Азов получил в XVII веке, когда донские и запорожские казаки после двухмесячной осады захватили крепость. Знаменитое «Азовское осадное сидение» 1637–1642 годов вошло в историю как пример мужества и стойкости казаков. В 1696 году Азов был взят войсками Петра I, что положило начало превращению России в морскую державу.

В 1709 году город стал административным центром Азовской губернии. Но в ходе Прутского похода 1711 года российская армия, попав в окружение, была принуждена к сдаче. Был заключён Прутский мир, по которому Россия уступила Османской империи Азов.

В 1736 году, во время русско-турецкой войны 1735—1739 годах крепость была взята войсками генерала Ласси. По Белградскому миру 1739 года крепость передавалась России с условием сноса крепостных сооружений и зданий, что и было выполнено в 1747 году. В течение 20 лет городские укрепления лежали в руинах. В марте 1769 года, с началом новой русско-турецкой войны, город снова был занят солдатами вологодского полка и донскими казаками и с тех пор город постоянно принадлежал России.

В 1775 году Азов сделан административным центром новоучрежденной Азовской губернии. В 1782 году, по переводе губернского управления в Екатеринослав, Азов переименован опять в крепость, 31 марта 1810 года — в посад Ростовского уезда Екатеринославской губернии, а в 1888 году присоединён к Области Войска Донского и передан под казачье управление.`, activeFrom: 1475, activeTo: 1955, color: '#DC143C', image: 'https://cdn.poehali.dev/files/7122480f-4549-4b7f-974d-d466e424900a.png', customDate: 'Статус города с 1709 г.' },
        { id: 'don-2', name: 'Черкасск', lat: 47.238440, lng: 40.037454, info: 'Первая столица Войска Донского, центр казачьего самоуправления до переноса столицы в Новочеркасск', activeFrom: 1570, activeTo: 1955, color: '#00008B' },
        { id: 'don-3', name: 'Новочеркасск', lat: 47.4221, lng: 40.0931, info: 'Столица Донского казачества, основана атаманом Платовым как новый административный центр', activeFrom: 1805, activeTo: 1955, color: '#00008B' },
        { id: 'don-4', name: 'Таганрог', lat: 47.2357, lng: 38.8974, info: 'Первый российский порт на Азовском море, основан Петром I как военно-морская база', activeFrom: 1698, activeTo: 1955, color: '#DC143C' },
        { id: 'don-5', name: 'Раздорская', lat: 47.540587, lng: 40.648557, info: `Станица Раздорская считается первой столицей донского казачества. На протяжении нескольких десятилетий станица была центром войска Донского, прежде чем он перешёл в городок «Стыдное имя» (Ебок).

Первое письменное сообщение о городке относится к августу 1571 г. и связано с проездом по Дону в Константинополь русского посланника Ишеина. Его сопровождали из Москвы до Азова Игнатий Кобяков и казачьи атаманы Мамин и Яковлев. В царской грамоте Кобякову предписывалось проводить Ишеина в Азов, а затем «взгребсти вверх Дону о Раздорах Донецких» и там дожидаться государева указа, а атаманам Баламутову, Кошелеву и Носу - быть при Кобяков

В XIX веке в станице бывали русская кавалеристка, офицер Русской Императорской армии, участница Отечественной войны 1812 года кавалерист-девица Н. А. Дурова, ставшая прототипом Шурочки из «Гусарской баллады». Позднее в станице бывали писатели А. С. Серафимович, М. А. Шолохов, В. А. Закруткин и А. В. Калинин.

Здесь проходили съемки фильмов «Донская повесть» 1964 года, по мотивам рассказов «Шибалково семя» и «Родинка» Михаила Шолохова.`, activeFrom: 1570, activeTo: 1955, color: '#00008B', image: 'https://cdn.poehali.dev/files/4133b53a-a3be-4b7d-9e4f-0d7eb349b779.png' },
        { id: 'don-6', name: 'Ростов-на-Дону', lat: 47.217876, lng: 39.711994, info: 'Крупнейший город региона, основан как крепость для защиты южных рубежей России', activeFrom: 1749, activeTo: 1955, color: '#DC143C' },
        { id: 'don-7', name: 'Батайск', lat: 47.1378, lng: 39.7514, info: 'Город на левом берегу Дона, развивался как железнодорожный узел и промышленный центр', activeFrom: 1769, activeTo: 1955, color: '#DC143C' },
        { id: 'don-8', name: 'Койсуг', lat: 47.126363, lng: 39.687106, info: 'Татарское поселение у устья реки Темерник, позже вошло в состав Ростова-на-Дону', activeFrom: 1769, activeTo: 1955, color: '#00008B' },
        { id: 'don-9', name: 'Нахичевань-на-Дону', lat: 47.230393, lng: 39.764744, info: 'Армянский город, основанный переселенцами из Крыма, позже вошел в состав Ростова', activeFrom: 1779, activeTo: 1927, color: '#D2B48C' },
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
        { id: 'don-e10', date: 1807, title: 'Ростов получает статус города', description: 'Поскольку к этому времени крепость св. Дмитрия Ростовского утратила своё военное значение, указом Александра I она получила статус уездного города, с этого времени начинается бурное экономическое развитие Ростова.', category: 'Экономика', objectId: 'don-6', image: 'https://cdn.poehali.dev/files/13624a7f-9769-420f-a1d7-d392ad866669.png' },
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
        { id: 'smuta-e5', date: 1612, title: 'Освобождение Москвы', description: 'Изгнание поляков из Кремля', category: 'Военная история', objectId: 'smuta-1' },
        { id: 'smuta-e6', date: 1613, title: 'Избрание Михаила Романова', description: 'Начало династии Романовых', category: 'Политика', objectId: 'smuta-1' }
      ],
      categories: ['Политика', 'Военная история']
    }
  };

  const selectedMapData = selectedMap ? mapData[selectedMap as keyof typeof mapData] : null;
  const mapObjects = selectedMapData?.objects || [];
  const events = selectedMapData?.events || [];
  const categories = selectedMapData?.categories || [];

  const filteredEvents = eventFilter === 'all' 
    ? events.filter(e => !e.objectId || currentDate >= (mapObjects.find(o => o.id === e.objectId)?.activeFrom || 0))
    : events.filter(e => 
        e.category === selectedCategory && 
        (!e.objectId || currentDate >= (mapObjects.find(o => o.id === e.objectId)?.activeFrom || 0))
      );

  const handleTimeStep = (direction: 'forward' | 'backward') => {
    const currentMap = maps.find(m => m.id === selectedMap);
    if (!currentMap) return;

    const steps: Record<TimeUnit, number> = {
      day: 1/365,
      month: 1/12,
      year: 1,
      decade: 10,
      '50years': 50,
      century: 100
    };

    const step = steps[timeUnit];
    const newDate = direction === 'forward' 
      ? Math.min(currentDate + step, currentMap.maxYear)
      : Math.max(currentDate - step, currentMap.minYear);

    setCurrentDate(Math.round(newDate));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="MapPin" className="text-primary" size={28} />
              <h1 className="text-2xl font-bold">Исторические карты</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {!selectedMap ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-5xl w-full space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-6 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Map" className="text-primary" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Карты</h3>
                      <p className="text-sm text-muted-foreground">Просмотр исторических карт</p>
                    </div>
                  </div>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-6 text-center opacity-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="PenTool" className="text-primary" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Редактор карт</h3>
                      <p className="text-sm text-muted-foreground">Создание и редактирование</p>
                    </div>
                  </div>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-6 text-center opacity-50">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="BookOpen" className="text-primary" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Справочная информация</h3>
                      <p className="text-sm text-muted-foreground">Энциклопедия и источники</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Доступные карты</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {maps.map(map => (
                    <Card
                      key={map.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
                      onClick={() => {
                        setSelectedMap(map.id);
                        setCurrentDate(map.minYear);
                      }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={map.image} 
                          alt={map.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-semibold mb-1">{map.name}</h3>
                          <p className="text-sm opacity-90">{map.period}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-4 p-4 min-h-0">
            <aside className="w-80 flex flex-col gap-4 overflow-auto">
              <Card className="p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMap(null);
                    setSelectedObject(null);
                    setSelectedEvent(null);
                  }}
                  className="mb-4"
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Назад к картам
                </Button>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Дата: {currentDate}</label>
                      <Select value={timeUnit} onValueChange={(v) => setTimeUnit(v as TimeUnit)}>
                        <SelectTrigger className="w-24 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="year">Год</SelectItem>
                          <SelectItem value="decade">Десятилетие</SelectItem>
                          <SelectItem value="50years">50 лет</SelectItem>
                          <SelectItem value="century">Век</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Slider
                      value={[currentDate]}
                      onValueChange={([v]) => setCurrentDate(v)}
                      min={maps.find(m => m.id === selectedMap)?.minYear || 1540}
                      max={maps.find(m => m.id === selectedMap)?.maxYear || 1955}
                      step={1}
                      className="mb-2"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTimeStep('backward')}
                        className="flex-1"
                      >
                        <Icon name="ChevronLeft" size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTimeStep('forward')}
                        className="flex-1"
                      >
                        <Icon name="ChevronRight" size={16} />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Стиль карты</label>
                    <Select value={mapStyle} onValueChange={(v) => setMapStyle(v as typeof mapStyle)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="roadmap">Схема</SelectItem>
                        <SelectItem value="satellite">Спутник</SelectItem>
                        <SelectItem value="terrain">Рельеф</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="flex-1 flex flex-col min-h-0">
                <Tabs defaultValue="objects" className="flex flex-col h-full">
                  <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                    <TabsTrigger value="objects">Объекты</TabsTrigger>
                    <TabsTrigger value="events">События</TabsTrigger>
                  </TabsList>

                  <TabsContent value="objects" className="flex-1 m-0 p-4 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                      <div className="space-y-2">
                        {mapObjects
                          .filter(obj => currentDate >= obj.activeFrom && currentDate <= obj.activeTo)
                          .map(obj => (
                            <div
                              key={obj.id}
                              className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => setSelectedObject(obj)}
                            >
                              <h4 className="font-medium text-sm">
                                {obj.id === 'don-2' && currentDate >= 1805 ? 'Старочеркасская' : obj.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {obj.activeFrom}—{obj.activeTo}
                              </p>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="events" className="flex-1 m-0 p-4 overflow-hidden flex flex-col">
                    <div className="mb-4 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant={eventFilter === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEventFilter('all')}
                          className="flex-1"
                        >
                          Все
                        </Button>
                        <Button
                          variant={eventFilter === 'category' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setEventFilter('category')}
                          className="flex-1"
                        >
                          По категории
                        </Button>
                      </div>

                      {eventFilter === 'category' && (
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
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

                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-2">
                        {filteredEvents
                          .sort((a, b) => a.date - b.date)
                          .map(event => (
                            <div
                              key={event.id}
                              className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-xs font-medium text-primary">{event.date}</span>
                                <span className="text-xs text-muted-foreground">{event.category}</span>
                              </div>
                              <h4 className="font-medium text-sm">{event.title}</h4>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </Card>
            </aside>

            <main className="flex-1 flex flex-col min-h-0">
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
        )}
      </div>

      <Dialog open={!!selectedObject} onOpenChange={() => {
        setSelectedObject(null);
        setShowRelatedEvents(false);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedObject?.id === 'don-2' && currentDate >= 1805 ? 'Старочеркасская' : selectedObject?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedObject?.customDate || (selectedObject?.id === 'don-5' ? 'Первое упоминание: 1571 г.' : `${selectedObject?.activeFrom}—${selectedObject?.activeTo}`)}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
            {selectedObject?.image && (
              <img 
                src={selectedObject.image} 
                alt={selectedObject.name} 
                className="w-full rounded-md"
              />
            )}
            <p className="text-sm text-foreground text-justify whitespace-pre-line">{selectedObject?.info}</p>
            
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
                        .sort((a, b) => a.date - b.date)
                        .map(event => (
                          <div
                            key={event.id}
                            className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
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
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date} • {selectedEvent?.category}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
            {selectedEvent?.image && (
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                className="w-full rounded-md"
              />
            )}
            <p className="text-sm text-foreground text-justify">{selectedEvent?.description}</p>
            
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
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;