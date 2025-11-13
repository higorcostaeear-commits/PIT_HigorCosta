'use client'

import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useState, useEffect } from 'react'

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [pixKey, setPixKey] = useState<string | null>(null)
  const [loadingQR, setLoadingQR] = useState(false)

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Pedido entregue com sucesso!')
        : toast.error(data.message)
    }
  )

  const { data: session } = useSession()
  console.log(session)

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  // Gerar QR Code PIX quando o pedido for carregado e o método for PIX
  useEffect(() => {
    if (data && data.paymentMethod === 'PIX' && !data.isPaid && !qrCode) {
      generatePixQRCode()
    }
  }, [data, qrCode])

  async function generatePixQRCode() {
    if (!data) return
    
    setLoadingQR(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/generate-pix-qrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.totalPrice,
        }),
      })
      
      const result = await res.json()
      if (res.ok) {
        setQrCode(result.qrCode)
        setPixKey(result.pixKey)
      } else {
        toast.error('Erro ao gerar QR Code PIX')
      }
    } catch (err) {
      toast.error('Erro ao gerar QR Code PIX')
    } finally {
      setLoadingQR(false)
    }
  }

  async function markPixAsPaid() {
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm-pix-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await res.json()
      if (res.ok) {
        toast.success('Pagamento confirmado com sucesso!')
        // Recarregar os dados do pedido
        window.location.reload()
      } else {
        toast.error(result.message || 'Erro ao confirmar pagamento')
      }
    } catch (err) {
      toast.error('Erro ao confirmar pagamento')
    }
  }

  if (error) return error.message
  if (!data) return 'Loading...'
  
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div>
      <h1 className="text-2xl py-4">Pedido {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Endereço de Entrega</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Entregue em: {deliveredAt}</div>
              ) : (
                <div className="text-error">Não Entregue</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Método de Pagamento</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Pago em {paidAt}</div>
              ) : (
                <div className="text-error">Não Pago</div>
              )}
            </div>
          </div>
          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>R$ {item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Resumo da Compra</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>R$ {itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Taxa</div>
                    <div>R$ {taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Entrega</div>
                    <div>R$ {shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>R$ {totalPrice}</div>
                  </div>
                </li>
                {!isPaid && paymentMethod === 'PIX' && (
                  <li>
                    <div className="mt-4">
                      <h3 className="font-bold mb-2">Pagar com PIX</h3>
                      {loadingQR ? (
                        <div className="flex justify-center">
                          <span className="loading loading-spinner"></span>
                        </div>
                      ) : qrCode ? (
                        <div className="flex flex-col items-center gap-2">
                          <img
                            src={qrCode}
                            alt="QR Code PIX"
                            className="w-48 h-48 border-2 border-gray-300 p-2 rounded"
                          />
                          <p className="text-sm text-gray-600 text-center">
                            Escaneie o QR Code com seu aplicativo bancário
                          </p>
                          {pixKey && (
                            <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded w-full text-center break-all">
                              Chave PIX: {pixKey}
                            </div>
                          )}
                          <button
                            onClick={markPixAsPaid}
                            className="btn btn-sm btn-success w-full mt-2"
                          >
                            Confirmar Pagamento
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={generatePixQRCode}
                          className="btn btn-primary w-full"
                        >
                          Gerar QR Code PIX
                        </button>
                      )}
                    </div>
                  </li>
                )}
                {!isPaid && paymentMethod === 'Pagamento na Entrega' && (
                  <li>
                    <div className="alert alert-info mt-4">
                      <p>Pagamento será realizado na entrega do pedido</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
