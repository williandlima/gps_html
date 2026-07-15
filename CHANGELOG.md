# Changelog

## v1.0.2

- Reavalia a obtenção de coordenadas ("Obter Posição Atual"), que retornava um ponto com erro de quilômetros (nível de bairro/CEP).
  - Causa: `getCurrentPosition` entregava o primeiro fix disponível, quase sempre uma estimativa grosseira por IP/Wi-Fi, antes do GPS estabilizar.
  - Agora o botão colhe leituras por até 20s e mantém a de menor raio de erro, encerrando assim que atinge precisão ≤ 20m.
  - Feedback em tempo real ("Refinando precisão... X m") e aviso explícito quando a precisão final ainda estiver ruim.

## v1.0.1

- Corrige método de filtragem de precisão do GPS, que causava erro grande no cálculo de distância.
  - Leituras com precisão pior que 20m agora são descartadas do cálculo (antes o limite era 50m).
  - O deslocamento só é somado se superar a soma das margens de erro dos dois pontos comparados (antes usava um limiar fixo de 0.5m, que contava ruído do GPS como movimento real).

## v1.0.0

- Botão "Obter Posição Atual": lê latitude, longitude, precisão e horário via Geolocation API.
- Botão "Iniciar Rastreamento" / "Encerrar Rastreamento": acompanha a posição continuamente (`watchPosition`) e soma a distância percorrida com a fórmula de Haversine até o operador encerrar.
- Painel com tempo decorrido, velocidade atual e velocidade média.
- Interface single-page (`index.html`), sem dependências externas, tema escuro.
