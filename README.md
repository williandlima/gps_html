# GPS HTML

App HTML/JS single-page para:

1. Obter a posição GPS atual do dispositivo.
2. Calcular a distância percorrida a partir do ponto atual até o operador encerrar o rastreamento.

## Uso

Abra `index.html` em um navegador com suporte a Geolocation API (requer HTTPS ou `localhost`).

- **Obter Posição Atual**: mostra latitude, longitude, precisão e horário da última leitura.
- **Iniciar Rastreamento**: acompanha a posição continuamente e soma a distância percorrida (fórmula de Haversine), exibindo tempo decorrido, velocidade atual e velocidade média.
- **Encerrar Rastreamento**: para o rastreamento e mostra a distância total percorrida.
