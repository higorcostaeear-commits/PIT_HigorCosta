import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/lib/models/UserModel'

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const user = await UserModel.findById(params.id)
  if (!user) {
    return Response.json(
      { message: 'usuario não encontrado' },
      {
        status: 404,
      }
    )
  }
  return Response.json(user)
}) as any
export const PUT = auth(async (...p: any) => {
  const [req, { params }] = p
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  const { name, email, isAdmin } = await req.json()
  try {
    await dbConnect()
    const user = await UserModel.findById(params.id)
    if (user) {
      user.name = name
      user.email = email
      user.isAdmin = Boolean(isAdmin)
      const updatedUser = await user.save()
      return Response.json({
        message: 'Informações de usuario atualizadas!',
        user: updatedUser,
      })
    } else {
      return Response.json(
        { message: 'Usuario não encontrado' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'não autorizado' },
      {
        status: 401,
      }
    )
  }
  try {
    await dbConnect()
    const user = await UserModel.findById(params.id)
    if (user) {
      if (user.isAdmin)
        return Response.json(
          { message: 'Usuario é admin' },
          {
            status: 400,
          }
        )
      await user.deleteOne()
      return Response.json({ message: 'Usuario deletado com sucesso' })
    } else {
      return Response.json(
        { message: 'Usuario não encontrado' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
