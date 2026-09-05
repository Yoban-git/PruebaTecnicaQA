# TestQA — Liverpool E2E

## Instalación

```bash
npm install
npx playwright install --with-deps chromium
```

## Ejecución

### Headless sin interfaz grafica

```bash
npm test
```

### Headed con interfaz grafica

```bash
npm run test:headed
```

Esto exporta `HEADED=true` antes de correr CodeceptJS. Si `cross-env` no está
disponible en tu entorno, puedes forzarlo manualmente:

```bash
HEADED=true npx codeceptjs run --steps        # Linux/Mac
$env:HEADED="true"; npx codeceptjs run --steps    # PowerShell
```

## Generar reporte de Allure

```bash
npm run allure:generate
npm run allure:report
```
