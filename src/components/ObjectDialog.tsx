import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MapObject, Event } from '@/types/map';

type ObjectDialogProps = {
  object: MapObject | null;
  currentDate: number;
  relatedEvents: Event[];
  showRelatedEvents: boolean;
  onClose: () => void;
  onToggleRelatedEvents: () => void;
  onSelectEvent: (event: Event) => void;
};

const ObjectDialog = ({
  object,
  currentDate,
  relatedEvents,
  showRelatedEvents,
  onClose,
  onToggleRelatedEvents,
  onSelectEvent
}: ObjectDialogProps) => {
  if (!object) return null;

  let displayName = object.name;
  if (object.id === 'don-2' && currentDate >= 1805) {
    displayName = 'Старочеркасская';
  }
  if (object.nameChanges) {
    const applicableChange = object.nameChanges
      .filter(change => currentDate >= change.year)
      .sort((a, b) => b.year - a.year)[0];
    if (applicableChange) {
      displayName = applicableChange.newName;
    }
  }

  return (
    <Dialog open={!!object} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            {displayName}
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            {object.customDate || (object.id === 'don-5' ? 'Первое упоминание: 1571 г.' : `${object.activeFrom}—${object.activeTo}`)}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] md:max-h-[65vh] pr-2 md:pr-4">
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            {object.image && (
              <div className="space-y-2">
                <img 
                  src={object.image} 
                  alt={object.name} 
                  className="w-full rounded-md"
                />
                {object.imageCaption && (
                  <p className="text-xs text-center text-muted-foreground">{object.imageCaption}</p>
                )}
              </div>
            )}
            <p className="text-xs md:text-sm text-foreground whitespace-pre-line break-words">{object.info}</p>
            
            {relatedEvents.length > 0 && (
              <>
                <Separator />
                
                {!showRelatedEvents ? (
                  <Button 
                    variant="outline" 
                    onClick={onToggleRelatedEvents}
                    className="w-full"
                  >
                    Показать связанные события ({relatedEvents.length})
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Связанные события</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onToggleRelatedEvents}
                      >
                        Скрыть
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {relatedEvents
                        .sort((a, b) => a.date - b.date)
                        .map(event => (
                          <div
                            key={event.id}
                            className="p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => {
                              onSelectEvent(event);
                              onClose();
                            }}
                          >
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-[10px] md:text-xs font-medium text-primary">{event.date}</span>
                              <span className="text-[10px] md:text-xs text-muted-foreground">{event.category}</span>
                            </div>
                            <h5 className="text-xs md:text-sm font-medium">{event.title}</h5>
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
  );
};

export default ObjectDialog;