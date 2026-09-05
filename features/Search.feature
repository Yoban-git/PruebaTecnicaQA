@Search
Feature: Busqueda valida

Scenario: videojeugos
 Given El usuario se encuentra en el Home de la pagina
  When El usuario busca "playstation 5"
  And El usuario aplica un filtro de color "Blanco"
  And El usuario ordena los resultados de "Menor precio"
  Then El usuario ve los resultados de su busqueda
  And El usuario extrae los primeros 5 resultados
  And los resultados de la UI coinciden con al menos 3 productos de la respuesta interceptada
