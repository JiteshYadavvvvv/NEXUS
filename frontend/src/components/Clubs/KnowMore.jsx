import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CiFacebook } from 'react-icons/ci';
import { FaInstagram, FaGlobe } from 'react-icons/fa';

export default function KnowMore({
  open = false,
  onClose = () => {},
  club = {},
}) {
  if (!open) return null;

  const images = club.media;

  return (
    <div className="fixed z-[20] left-0 right-0 flex justify-center bg-black/50">
      <div className="relative w-[95%] max-w-[920px] h-120 overflow-y-auto rounded-xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.3)]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute z-[999] right-2.5 top-2.5 h-9 w-9 cursor-pointer rounded-lg border-none bg-gray-200 text-lg leading-9"
        >
          ×
        </button>
        <div className="flex flex-col gap-2 p-4 justify-center items-center mt-10">
          <Carousel className="w-[90%] max-w-xs">
            <CarouselContent>
              {images.map((img, id) => {
                return (
                  <CarouselItem key={id}>
                    
                      <Card>
                        <div className="max-h-100">
                          <CardContent className="flex aspect-square items-center justify-center ">
                            <img
                              src={img}
                              className="w-full min-h-full object-cover rounded-xl"
                              alt={id}
                            />
                          </CardContent>
                        </div>
                      </Card>
                    
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="flex gap-4">
            <span><CiFacebook /></span>
            <span><FaInstagram/></span>
            <span><FaGlobe/></span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
