'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { convertDocToObj } from '@/lib/utils'
import ProductItem from '@/components/products/ProductItem'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


export default function ProductCarousel({ products }: { products: any[] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      autoplay={{ delay: 3500 }}
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.slug}>
          <ProductItem product={convertDocToObj(product)} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
