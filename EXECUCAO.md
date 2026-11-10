# Execução dos testes de sistema

Este fork contém testes de sistema da aplicação TodoMVC com Playwright.

## Execução local

```bash
npm ci
npx playwright install --with-deps
npm test
```

São cinco cenários executados no Chromium e Firefox, totalizando dez testes.

## GitHub Actions

O workflow CI em `.github/workflows/ci.yml` executa automaticamente a cada push ou pull request. Ele instala as dependências e os navegadores, executa os testes e disponibiliza o relatório no artefato `playwright-report`.

As execuções e seus resultados podem ser consultados em https://github.com/SuzanStockey/playwright-ui-tests/actions.
