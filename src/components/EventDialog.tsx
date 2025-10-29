import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Event, MapObject } from '@/types/map';

type EventDialogProps = {
  event: Event | null;
  mapObjects: MapObject[];
  onClose: () => void;
};

const EventDialog = ({ event, mapObjects, onClose }: EventDialogProps) => {
  if (!event) return null;

  const getEventLocation = () => {
    if (!event.objectId) return null;
    
    const objectIds = Array.isArray(event.objectId) ? event.objectId : [event.objectId];
    const relatedObjects = mapObjects.filter(obj => objectIds.includes(obj.id));
    
    if (relatedObjects.length === 0) return null;
    
    return relatedObjects.map(obj => obj.name).join(', ');
  };

  const eventLocation = getEventLocation();

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">{event.title}</DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            {event.date} • {event.category}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] md:max-h-[65vh] pr-2 md:pr-4">
          <div className="space-y-3 md:space-y-4 py-2 md:py-4">
            {event.image && (
              <div>
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full rounded-md"
                />
                {event.imageCaption && (
                  <p className="text-xs text-muted-foreground text-center mt-2">{event.imageCaption}</p>
                )}
              </div>
            )}
            <p className="text-xs md:text-sm text-foreground text-justify whitespace-pre-line">{event.description}</p>
            
            {eventLocation && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Место события:</p>
                <p className="text-sm text-foreground">{eventLocation}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;