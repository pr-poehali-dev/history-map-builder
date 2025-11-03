import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MapInfo } from '@/types/map';

type MapSelectorProps = {
  maps: MapInfo[];
  onSelectMap: (mapId: string, minYear: number) => void;
};

const MapSelector = ({ maps, onSelectMap }: MapSelectorProps) => {
  return (
    <div className="flex-1 flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="max-w-5xl w-full space-y-6 md:space-y-8 pt-4 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-4 md:p-6 text-center">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Map" className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-1">Карты</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Просмотр исторических карт</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-4 md:p-6 text-center opacity-50">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <img 
                  src="https://cdn.poehali.dev/files/c139dabc-3851-42aa-b3be-89ec941aaa12.png" 
                  alt="Эмблема"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-1">Редактор карт</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Создание и редактирование</p>
              </div>
            </div>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-4 md:p-6 text-center opacity-50">
            <div className="flex flex-col items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="BookOpen" className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold mb-1">Справочная информация</h3>
                <p className="text-xs md:text-sm text-muted-foreground">Энциклопедия и источники</p>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Доступные карты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {maps.map(map => (
              <Card
                key={map.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
                onClick={() => onSelectMap(map.id, map.minYear)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={map.image} 
                    alt={map.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                    <h3 className="text-base md:text-xl font-semibold mb-1">{map.name}</h3>
                    <p className="text-xs md:text-sm opacity-90">{map.period}</p>
                  </div>
                </div>
                {map.description && (
                  <div className="p-3 md:p-4">
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed text-justify">{map.description}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelector;