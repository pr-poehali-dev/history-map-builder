import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Event, MapObject } from '@/types/map';

type EventDialogProps = {
  event: Event | null;
  mapObjects: MapObject[];
  onClose: () => void;
  onObjectClick?: (object: MapObject) => void;
};

const EventDialog = ({ event, mapObjects, onClose, onObjectClick }: EventDialogProps) => {
  if (!event) return null;

  const getRelatedObjects = () => {
    if (!event.objectId) return [];
    
    const objectIds = Array.isArray(event.objectId) ? event.objectId : [event.objectId];
    return mapObjects.filter(obj => objectIds.includes(obj.id));
  };

  const relatedObjects = getRelatedObjects();

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-x-auto md:overflow-x-hidden overflow-y-hidden">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">{event.title}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            {event.date} • {event.category}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] md:max-h-[65vh] pr-2 md:pr-4">
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            {event.image && (
              <div className="space-y-2">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full rounded-md"
                />
                {event.imageCaption && (
                  <p className="text-xs text-center text-muted-foreground">{event.imageCaption}</p>
                )}
              </div>
            )}
            <div className="overflow-x-auto md:overflow-x-visible">
              <p className="text-xs md:text-sm text-foreground text-justify whitespace-pre-line">{event.description}</p>
            </div>
            
            {relatedObjects.length > 0 && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Место события:</p>
                <div className="flex flex-wrap gap-2">
                  {relatedObjects.map(obj => (
                    <Button
                      key={obj.id}
                      variant="link"
                      className="h-auto p-0 text-sm text-foreground hover:text-primary"
                      onClick={() => {
                        if (onObjectClick) {
                          onObjectClick(obj);
                        }
                      }}
                    >
                      {obj.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;