import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel from '@/lib/models/OrderModel'

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

    if (order.isPaid) {
      return Response.json(
        { message: 'Este pedido já foi pago' },
        {
          status: 400,
        }
      )
    }

    // Marcar pedido como pago
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: `PIX-${Date.now()}`,
      status: 'COMPLETED',
      email_address: req.auth.user?.email || 'unknown@example.com',
    }

    const updatedOrder = await order.save()

    return Response.json({
      message: 'Pagamento confirmado com sucesso!',
      order: updatedOrder,
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
