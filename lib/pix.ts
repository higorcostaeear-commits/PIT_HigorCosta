import QRCode from 'qrcode'

/**
 * Gera um QR Code PIX aleatório para teste
 * Retorna uma string base64 da imagem do QR Code
 */
export const pix = {
  generateQRCode: async function generateQRCode(amount: number) {
    try {
      // Gera um identificador aleatório para o PIX (chave aleatória)
      const randomKey = generateRandomPixKey()
      
      // Cria a string PIX (formato simplificado para teste)
      // Em produção, isso seria um EMV QR Code completo
      const pixString = `00020126580014br.gov.bcb.brcode01051.0.063047B6E2B0-E8E3-4B5E-8C7A-9F2D1E3C5A7B52040000530398654061${amount.toFixed(2).replace('.', '')}5802BR5913Test Shop6009SAO PAULO62410503***63041D3D`
      
      // Gera o QR Code em base64
      const qrCodeDataUrl = await QRCode.toDataURL(pixString, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      
      return {
        qrCode: qrCodeDataUrl,
        pixKey: randomKey,
        amount: amount,
        pixString: pixString,
      }
    } catch (err: any) {
      throw new Error(`Erro ao gerar QR Code PIX: ${err.message}`)
    }
  },
}

/**
 * Gera uma chave PIX aleatória para teste
 */
function generateRandomPixKey(): string {
  // Formato: UUID aleatório (simulado)
  const chars = '0123456789abcdef'
  let uuid = ''
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else {
      uuid += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }
  return uuid
}
