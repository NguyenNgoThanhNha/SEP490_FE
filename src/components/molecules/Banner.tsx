import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/atoms/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/utils/cn.ts'

interface BannerProps {
  classContent?: string
  images: { id: number; url: string }[]
}

const Banner = ({ classContent, images }: BannerProps) => {
  return (
    <div>
      <Carousel
        className={cn('w-full h-screen items-center flex justify-center', classContent)}
        opts={{
          align: 'start',
          loop: true
        }}
        plugins={[
          Autoplay({
            delay: 4000
          })
        ]}
      >
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <img
                src={image.url}
                loading={'lazy'}
                alt={`banner-${image.id}`}
                className={'h-[600px] object-cover w-full rounded-md'}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default Banner
