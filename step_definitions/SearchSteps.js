const { I, SearchPage } = inject();
const { crossValidate } = require('../helpers/matcher');
const assert = require('assert');

// Guardamos los resultados de la UI entre steps para comparar en el step final.
let uiResultados = [];

Given(/^El usuario se encuentra en el Home de la pagina$/, () => {
    SearchPage.home();
});

When(/^El usuario busca "([^"]+)"$/, async (producto) => {
    // Nos suscribimos a la red ANTES de disparar la búsqueda: la petición
    // puede resolverse muy rápido tras el Enter y no queremos perdérnosla.
    await I.startInterceptingSearchResponses();
    SearchPage.buscaquedaValida(producto);
});

When(/^El usuario aplica un filtro de color "([^"]+)"$/, (color) => {
    SearchPage.filtroColor(color);
});

When(/^El usuario ordena los resultados de "([^"]+)"$/, (orden) => {
    SearchPage.filtroPrecios(orden);
});

Then(/^El usuario ve los resultados de su busqueda$/, () => {
    SearchPage.resultado();
});

Then(/^El usuario extrae los primeros 5 resultados$/, async () => {
    uiResultados = await SearchPage.extraerProductos(5);
    assert.strictEqual(uiResultados.length, 5, 'Se esperaban 5 resultados en la UI');
});

Then(/^los resultados de la UI coinciden con al menos 3 productos de la respuesta interceptada$/, async () => {
    const apiResultados = await I.getInterceptedProducts();
    I.stopInterceptingSearchResponses();

    console.log('\n=== Productos interceptados (respuesta de red) ===');
    console.table(apiResultados);

    const report = crossValidate(uiResultados, apiResultados);

    console.log(`\nCoincidencias: ${report.matched.length}/${uiResultados.length}`);

    if (report.discrepancies.length > 0) {
        console.log('⚠️  Discrepancias de nombre/precio entre UI y API:');
        console.table(report.discrepancies);
    }
    if (report.unmatched.length > 0) {
        console.log('⚠️  Resultados de la UI sin match en la respuesta interceptada:');
        console.table(report.unmatched);
    }

    assert.ok(
        report.matched.length >= 3,
        `Se esperaban al menos 3 coincidencias, se encontraron ${report.matched.length}`
    );
});
