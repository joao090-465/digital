# Linho Holdings

Site institucional e painel administrativo com catálogo de produtos digitais, gestão de estoque/preço/custo, dashboard de faturamento, estimativa de lucro bruto, gráfico de receita com atualização periódica e webhook para pedidos da Kiwify.

## Antes de publicar

Este projeto não contém suas senhas nem credenciais do banco. Configure as variáveis abaixo na Vercel em **Settings → Environment Variables**.

- `DATABASE_URL`: URL pooled do Neon para a aplicação.
- `DIRECT_URL`: URL direta do Neon para comandos Prisma.
- `ADMIN_SESSION_SECRET`: string aleatória longa, no mínimo 32 caracteres.
- `ADMIN_PASSWORD_HASH`: hash bcrypt da senha do painel.
- `KIWIFY_WEBHOOK_SECRET`: segredo compartilhado com o webhook.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: opcional, apenas se for adicionar contato no futuro.
- `NEXT_PUBLIC_SITE_URL`: domínio público do site.

### Criar o hash da senha administrativa

No computador, com Node.js instalado, execute:

```bash
node -e "require('bcryptjs').hash('COLOQUE-SUA-SENHA-FORTE-AQUI',12).then(console.log)"
```

Copie o resultado para `ADMIN_PASSWORD_HASH`. Não coloque a senha em arquivos públicos do GitHub.

## Neon / Prisma

1. Crie um banco PostgreSQL no Neon.
2. Copie a URL pooled para `DATABASE_URL`.
3. Copie a URL direta para `DIRECT_URL` (se disponível).
4. Configure ambas na Vercel.
5. Depois da primeira instalação local ou build, execute `npx prisma db push` a partir de um ambiente com as variáveis configuradas, ou use um job/terminal seguro. O schema cria as tabelas `Product` e `KiwifyOrder`.

## Vercel

1. Envie o conteúdo do ZIP para um repositório GitHub.
2. Na Vercel, escolha **Add New → Project** e importe o repositório.
3. Framework preset: **Next.js**. Root directory: `./`.
4. Cadastre as variáveis de ambiente antes do deploy.
5. Faça o deploy e valide `/` e `/admin/login`.

## Configurar Kiwify

1. Na Kiwify, crie um webhook para eventos de venda aprovada e, se disponível, reembolso/chargeback.
2. URL: `https://SEU-DOMINIO/api/kiwify/webhook?secret=SEU_SEGREDO`.
3. Use o mesmo segredo em `KIWIFY_WEBHOOK_SECRET`.
4. Cadastre o produto no painel com o nome correspondente ao produto da Kiwify, o preço/custo e a URL do checkout.
5. Faça uma venda de teste e confira se o formato do payload corresponde aos campos tratados no endpoint. O payload de eventos pode variar por configuração/versão da Kiwify, portanto valide com o evento real antes de confiar nos relatórios.

## Acessos

- Site: `/`
- Catálogo: `/produtos`
- Login administrativo: `/admin/login`
- Painel: `/admin`
- Produtos: `/admin/produtos`

## Observações importantes

- Os relatórios não inventam vendas: começam zerados e passam a refletir pedidos armazenados pelo webhook.
- O lucro bruto é uma estimativa simples: faturamento menos custo unitário cadastrado. Não inclui automaticamente taxas de checkout, impostos, anúncios, reembolsos ou despesas fixas.
- O gráfico é uma visualização SVG em perspectiva, não um motor WebGL 3D.
- Estoque é informativo; o sistema não substitui a gestão de entrega/acesso da Kiwify.
- Revise o payload real do webhook e teste autenticação antes de operar em produção.
