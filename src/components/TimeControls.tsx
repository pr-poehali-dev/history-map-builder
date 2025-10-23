import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { TimeUnit } from '@/types/map';

type TimeControlsProps = {
  currentDate: number;
  timeUnit: TimeUnit;
  minYear: number;
  maxYear: number;
  mapStyle: 'roadmap' | 'satellite' | 'terrain';
  onDateChange: (date: number) => void;
  onTimeUnitChange: (unit: TimeUnit) => void;
  onTimeStep: (direction: 'forward' | 'backward') => void;
  onMapStyleChange: (style: 'roadmap' | 'satellite' | 'terrain') => void;
  onBack: () => void;
};

const TimeControls = ({
  currentDate,
  timeUnit,
  minYear,
  maxYear,
  mapStyle,
  onDateChange,
  onTimeUnitChange,
  onTimeStep,
  onMapStyleChange,
  onBack
}: TimeControlsProps) => {
  return (
    <Card className="p-3 md:p-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-3 md:mb-4 w-full md:w-auto"
      >
        <Icon name="ArrowLeft" size={16} className="mr-2" />
        Назад к картам
      </Button>

      <div className="space-y-3 md:space-y-4">
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <label className="text-xs md:text-sm font-medium">Дата: {currentDate}</label>
            <Select value={timeUnit} onValueChange={(v) => onTimeUnitChange(v as TimeUnit)}>
              <SelectTrigger className="w-full md:w-24 h-8 text-xs">
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
            onValueChange={([v]) => onDateChange(v)}
            min={minYear}
            max={maxYear}
            step={1}
            className="mb-2"
          />

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTimeStep('backward')}
              className="w-full"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTimeStep('forward')}
              className="w-full"
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <div>
          <label className="text-xs md:text-sm font-medium mb-2 block">Стиль карты</label>
          <Select value={mapStyle} onValueChange={(v) => onMapStyleChange(v as typeof mapStyle)}>
            <SelectTrigger className="h-9 text-xs md:text-sm">
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
  );
};

export default TimeControls;
