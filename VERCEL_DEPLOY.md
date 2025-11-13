# Configuração para Deploy na Vercel

## Variáveis de Ambiente Necessárias

Após fazer o deploy na Vercel, configure as seguintes variáveis de ambiente no painel da Vercel:

### Variáveis Obrigatórias

1. **NEXTAUTH_URL**
   - **Valor**: A URL completa do seu site na Vercel
   - **Exemplo**: `https://seu-projeto.vercel.app`
   - **Importante**: Sem o `/` no final

2. **NEXTAUTH_SECRET**
   - **Valor**: Uma string aleatória segura
   - **Como gerar**: Execute `openssl rand -base64 32` no terminal
   - **Exemplo**: `sua-chave-secreta-aleatoria-aqui`

3. **MONGODB_URI**
   - **Valor**: String de conexão do MongoDB
   - **Exemplo local**: `mongodb://localhost:27017/instrumentos-musicais`
   - **Exemplo Atlas**: `mongodb+srv://usuario:senha@cluster.mongodb.net/instrumentos-musicais`

### Variáveis Opcionais (mas recomendadas)

4. **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**
   - Nome do seu cloud no Cloudinary

5. **NEXT_PUBLIC_CLOUDINARY_API_KEY**
   - API Key do Cloudinary

6. **CLOUDINARY_SECRET**
   - Secret do Cloudinary

7. **NEXT_PUBLIC_APP_NAME** (opcional)
   - Nome da aplicação

8. **NEXT_PUBLIC_APP_DESC** (opcional)
   - Descrição da aplicação

## Como Configurar na Vercel

1. Acesse o painel da Vercel: https://vercel.com
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Key**: Nome da variável (ex: `NEXTAUTH_URL`)
   - **Value**: Valor da variável
   - **Environment**: Selecione todas as opções (Production, Preview, Development)
5. Clique em **Save**
6. Faça um novo deploy ou aguarde o próximo deploy automático

## Verificação

Após configurar as variáveis:

1. Faça um novo deploy (ou aguarde o próximo)
2. Acesse seu site na Vercel
3. Teste fazer login
4. Verifique se as requisições estão indo para o domínio correto (não localhost)

## Problemas Comuns

### Requisições indo para localhost:3000

**Solução**: 
- Verifique se `NEXTAUTH_URL` está configurada corretamente
- Certifique-se de que o valor não tem `/` no final
- Faça um novo deploy após adicionar a variável

### Erro de autenticação

**Solução**:
- Verifique se `NEXTAUTH_SECRET` está configurada
- Certifique-se de que `MONGODB_URI` está correta e acessível

### Imagens não carregam

**Solução**:
- Verifique as variáveis do Cloudinary
- Certifique-se de que as imagens estão em `/public/images/` ou no Cloudinary

## Nota Importante

O código foi atualizado para usar `trustHost: true` no NextAuth, o que permite que o NextAuth detecte automaticamente a URL base do ambiente. No entanto, ainda é recomendado configurar `NEXTAUTH_URL` explicitamente para garantir o funcionamento correto.

