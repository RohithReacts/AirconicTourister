import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function ReusableCarousel({
  items = [],
  className,
  itemClassName,
  opts,
  plugins = [],
  showControls = true,
  ...props
}) {
  if (!items?.length) return null;

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true }),
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        breakpoints: {
          "(min-width: 768px)": { watchDrag: false },
        },
        ...opts,
      }}
      plugins={[plugin.current, ...plugins]}
      className={cn("w-full relative group", className)}
      {...props}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item, index) => (
          <CarouselItem
            key={index}
            className={cn("pl-2 md:pl-4", itemClassName)}
          >
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      {showControls && (
        <>
          <CarouselPrevious className="hidden sm:flex absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-white text-black transition-colors z-20 shadow-xl border-border/20 w-10 h-10" />
          <CarouselNext className="hidden sm:flex absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-white text-black transition-colors z-20 shadow-xl border-border/20 w-10 h-10" />
        </>
      )}
    </Carousel>
  );
}
