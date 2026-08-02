import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { MapInfo } from '@/types/map';

type MapSelectorProps = {
  maps: MapInfo[];
  onSelectMap: (mapId: string, minYear: number) => void;
};

const MapSelector = ({ maps, onSelectMap }: MapSelectorProps) => {
  return (
    <div className="flex-1 flex items-start md:items-center justify-center p-3 md:p-8 overflow-y-auto">
      <div className="max-w-5xl w-full space-y-1 md:space-y-2 pt-1 md:pt-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 items-center md:items-start">
          <div className="order-1 col-span-2 md:order-2 md:col-span-1 flex items-center justify-center w-fit h-fit mx-auto mt-0 md:mt-20">
            <img 
              src="https://cdn.poehali.dev/projects/1b4b70d3-baad-4bc6-90fd-9ea77f09c262/bucket/30f25ee7-1e02-44e5-82dd-a98d0ef58402.png" 
              alt="Эмблема"
              className="block w-44 h-44 md:w-64 md:h-64 object-contain select-none pointer-events-none scale-[1.2] md:scale-125 transition-transform duration-300 hover:scale-[1.25] md:hover:scale-[1.4]"
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

          <Card className="order-2 md:order-1 cursor-pointer hover:shadow-lg transition-all hover:scale-105 px-3 md:px-6 py-2 md:py-3 text-center h-fit self-center mt-0 md:mt-16">
            <div className="flex flex-col items-center gap-1 md:gap-3">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Map" className="text-primary" size={18} />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1">Карты</h3>
                <p className="text-[11px] md:text-sm text-muted-foreground">Просмотр исторических карт</p>
              </div>
            </div>
          </Card>

          <Card className="order-3 cursor-pointer hover:shadow-lg transition-all hover:scale-105 px-3 md:px-6 py-2 md:py-3 text-center opacity-50 h-fit self-center mt-0 md:mt-16">
            <div className="flex flex-col items-center gap-1 md:gap-3">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="BookOpen" className="text-primary" size={18} />
              </div>
              <div>
                <h3 className="text-sm md:text-lg font-semibold mb-0.5 md:mb-1 leading-tight">Справочная информация</h3>
                <p className="text-[11px] md:text-sm text-muted-foreground">Энциклопедия и источники</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-4 md:-mt-10">
          <h2 className="text-lg md:text-2xl font-semibold text-primary">Доступные карты</h2>
          <hr className="border-t-2 border-muted-foreground/40 my-1 md:my-2" />
          <h3 className="text-sm md:text-lg font-semibold text-primary">История России</h3>
          <hr className="border-t-2 border-muted-foreground/40 mt-1 mb-2 md:mt-2 md:mb-4" />
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