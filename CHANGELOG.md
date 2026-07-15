# Changelog

## v1.0.0

- Botão "Obter Posição Atual": lê latitude, longitude, precisão e horário via Geolocation API.
- Botão "Iniciar Rastreamento" / "Encerrar Rastreamento": acompanha a posição continuamente (`watchPosition`) e soma a distância percorrida com a fórmula de Haversine até o operador encerrar.
- Painel com tempo decorrido, velocidade atual e velocidade média.
- Interface single-page (`index.html`), sem dependências externas, tema escuro.
