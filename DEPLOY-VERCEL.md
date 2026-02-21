# 🚀 Deploy no Vercel - Guia Completo

## Passo 1: Fazer Push para o GitHub

```bash
git add .
git commit -m "Configuração para deploy no Vercel"
git push origin main
```

## Passo 2: Conectar ao Vercel

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Selecione o repositório: `dfc-analyzer`
5. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (deixe vazio)
   - Build Command: `npm run build` (padrão)
   - Output Directory: `.next` (padrão)
   - Install Command: `npm install` (padrão)

## Passo 3: Deploy

1. Clique em "Deploy"
2. Aguarde 2-3 minutos
3. Seu site estará disponível em: `https://dfc-analyzer-[seu-usuario].vercel.app`

## ✅ Checklist de Configuração

- [x] `package.json` com todas as dependências
- [x] `next.config.js` configurado
- [x] `vercel.json` criado
- [x] `.vercelignore` criado
- [x] Código commitado no GitHub
- [ ] Projeto importado no Vercel
- [ ] Deploy realizado

## 🔧 Solução de Problemas

### Erro: "Module not found: pdf-parse"
- Verifique se `pdf-parse` está no `package.json` dependencies
- Faça rebuild no Vercel

### Erro: "Build failed"
- Verifique os logs no Vercel Dashboard
- Certifique-se que não há erros de TypeScript

### Erro: "API route not working"
- Verifique se as rotas estão em `app/api/`
- Certifique-se que são arquivos `route.ts`

## 📱 Testando o Deploy

Após o deploy, teste:
1. Acesse a URL do Vercel
2. Faça upload dos PDFs de teste
3. Verifique se a análise funciona
4. Confira os gráficos e relatórios

## 🔄 Atualizações Futuras

Para atualizar o site:
```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

O Vercel fará deploy automático!

## 📊 Monitoramento

- Dashboard: https://vercel.com/dashboard
- Logs: Clique no projeto > Deployments > Ver logs
- Analytics: Disponível no dashboard do Vercel

---

**Pronto! Seu DFC Analyzer estará online e funcionando! 🎉**
