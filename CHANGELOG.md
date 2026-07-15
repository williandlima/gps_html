# Changelog

## v1.1.0

- Continuidade em segundo plano / tela bloqueada (dentro do possível para um app web):
  - **Wake Lock**: mantém a tela ligada durante o rastreamento para o app não ser suspenso.
  - **Costura do trecho perdido**: ao voltar do segundo plano, pega um fix novo e soma, em linha reta, o deslocamento desde o último ponto salvo (o trecho percorrido enquanto o app esteve suspenso).
  - **Persistência da sessão**: distância, tempo e último ponto são salvos no aparelho; se o app for fechado e reaberto, a sessão é recuperada com o botão "Retomar", que continua a contagem e costura o trecho.
- Observação: rastreamento contínuo com a tela realmente apagada/bloqueada só é possível em app nativo; a costura em linha reta é uma aproximação (subestima trajetos curvos feitos com o app suspenso).

## v1.0.5

- Corrige a distância percorrida que ficava em zero num trajeto real a pé.
  - O rastreamento passa a aceitar leituras com precisão até 35m (antes 20m), faixa típica do GPS de celular ao ar livre; acima de 20m tudo era descartado e nada era contado.
  - Substitui o limiar de ruído (que exigia superar a soma das precisões, ~20–40m) por acúmulo em "passos" de ≥5m: filtra o tremor com o aparelho parado, mas captura a caminhada.

## v1.0.4

- Diagnóstico de precisão em níveis: detecta quando o aparelho entrega **localização aproximada** (rede/Wi-Fi, erro em nível de cidade) em vez do GPS e orienta o usuário a ativar "Localização Precisa" e o modo "Alta precisão".
- Aumenta o tempo de estabilização do fix de 20s para 30s.
- Mensagens distintas para precisão boa (≤20m), moderada (≤200m) e aproximada (>200m).

## v1.0.3

- App agora é instalável na tela inicial (PWA): abre em tela cheia (`display: standalone`), com ícone e nome próprios.
- Adiciona `manifest.json`, ícones (`icon-192.png`, `icon-512.png`), `theme-color` e meta tags para iOS (`apple-mobile-web-app-*`).
- `viewport-fit=cover` para melhor uso da tela em celulares com notch.

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
