import ProductCarousel from '@/components/products/ProductCarousel'
import ProductItem from '@/components/products/ProductItem'
import productService from '@/lib/services/productService'
import { convertDocToObj } from '@/lib/utils'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description:
    process.env.NEXT_PUBLIC_APP_DESC ||
    'Nextjs, Server components, Next auth, daisyui, zustand',
}

export default async function Home() {

  const latestProducts = await productService.getLatest()
  const baixos = latestProducts.filter((product) =>  product.category?.toLowerCase().includes('baixos')
  )
  const teclados = latestProducts.filter((product) => product.category?.toLocaleLowerCase().includes('teclados'))

  return (
    <>
      <h2 className="text-2xl py-2 mb-6 mt-6">Lançamentos</h2>
      <div className="w-full">
        <ProductCarousel products={latestProducts} />
      </div>
      <h2 className="text-2xl py-2 mb-6">Baixos</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {baixos.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
      <h2 className="text-2xl py-2 mb-6">Teclados</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {teclados.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
    </>
  )
}
