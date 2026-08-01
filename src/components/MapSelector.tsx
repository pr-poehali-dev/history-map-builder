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
      <div className="max-w-5xl w-full space-y-2 md:space-y-2 pt-4 md:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
          <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-4 md:p-6 text-center h-fit self-center order-2 md:order-1">
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

          <div className="flex items-start justify-center order-1 md:order-2 w-fit h-fit mx-auto mt-10 md:mt-16">
            <img 
              src="https://cdn.poehali.dev/projects/1b4b70d3-baad-4bc6-90fd-9ea77f09c262/bucket/30f25ee7-1e02-44e5-82dd-a98d0ef58402.png" 
              alt="Эмблема"
              className="block w-48 h-48 md:w-64 md:h-64 object-contain select-none pointer-events-none transition-transform duration-300 hover:scale-110"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 p-4 md:p-6 text-center opacity-50 h-fit self-center order-3">
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
          <h2 className="text-lg md:text-xl font-semibold text-primary">Доступные карты</h2>
          <hr className="border-t-2 border-muted-foreground/40 my-2" />
          <h3 className="text-base md:text-lg font-semibold text-primary">История России</h3>
          <hr className="border-t-2 border-muted-foreground/40 mt-2 mb-3 md:mb-4" />
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
                    <p className="text-xs md:text-sm opacity-90">{map.period} гг. от Р.Х.</p>
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