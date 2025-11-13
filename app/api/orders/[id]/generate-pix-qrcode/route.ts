import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'
import { pix } from '@/lib/pix'

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request
  
  if (!req.auth) {
    return Response.json(
      { message: 'Não autorizado' },
      {
        status: 401,
      }
    )
  }

  await dbConnect()
  
  try {
    const order = await OrderModel.findById(params.id)
    
    if (!order) {
      return Response.json(
        { message: 'Pedido não encontrado' },
        {
          status: 404,
        }
      )
    }

    if (order.paymentMethod !== 'PIX') {
      return Response.json(
        { message: 'Este pedido não é para pagamento via PIX' },
        {
          status: 400,
        }
      )
    }

    // Gerar QR Code PIX
    const pixData = await pix.generateQRCode(order.totalPrice)

    return Response.json({
      qrCode: pixData.qrCode,
      pixKey: pixData.pixKey,
      amount: pixData.amount,
      success: true,
    })
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
