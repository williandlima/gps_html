# Changelog

## v1.3.4

- Mostra a **versão do app** no rodapé, para não confundir builds. No app nativo, inclui também o **hash do commit + data** (injetado no build por `scripts/copy-web.mjs`), identificando exatamente de qual commit veio cada APK.

## v1.3.3

- Corrige a **distância exagerada a pé**: o ruído do GPS inflava o valor (numa caminhada real de 100m o método antigo chegava a marcar 180–420m).
  - **Gate de velocidade**: usa a velocidade do GPS (Doppler) para detectar "parado" de forma confiável — abaixo de ~1,8 km/h não acumula, eliminando a distância fantasma mesmo com o sinal oscilando.
  - **Limiar de movimento maior** (max(15m, 1,5 × precisão), antes 0,75×) para reduzir a inflação por zigue-zague ao caminhar.
  - **Descarta leituras piores que 25m** de precisão (antes 35m) e aumenta o `distanceFilter` nativo para 10m.
  - Verificado por simulação (ruído realista): caminhada de 100m → ~95–100m; parado 3min → ~0m; 1000m → ~1050m com boa precisão.

## v1.3.2

- Bússola: usa apenas o evento de orientação **absoluto** (referenciado ao norte) quando disponível, em vez de registrar também o evento relativo. Isso limpa o diagnóstico (que mostrava `rumo bruto: —` do evento relativo) e evita qualquer risco de leitura sem referência ao norte.

## v1.3.1

- Modo **diagnóstico** na bússola (botão "Mostrar diagnóstico"): exibe os valores crus do sensor (`alpha`, `webkitCompassHeading`, rumo bruto, ângulo da tela, rumo magnético, declinação e rumo verdadeiro), para verificar/depurar o comportamento do magnetômetro em cada aparelho.

## v1.3.0

- Nova **bússola de Norte Verdadeiro**: aponta para o norte geográfico, não o magnético.
  - Usa o sensor de orientação do aparelho (`DeviceOrientation`) para o rumo magnético.
  - Corrige para o norte verdadeiro aplicando a **declinação magnética** calculada pela posição (lat/lon) com o modelo **WMM2025** (embutido offline via `geomag.bundle.js`, biblioteca `geomagnetism`, Apache-2.0).
  - Mostra rumo do aparelho, declinação e uma rosa dos ventos que gira para o N apontar ao norte real.
  - No iOS pede permissão do sensor por gesto ("Ativar Bússola"); no Android usa a orientação absoluta.
  - Declinação verificada contra referências do NOAA (ex.: Tóquio -7,9°, São Paulo -21,9°).

## v1.2.3

- Corrige a precisão do VALOR da distância: com o aparelho parado e sinal fraco, o método antigo (limiar fixo de 5m) contava "distância fantasma" (dezenas a centenas de metros parado, quando a precisão era 25–35m).
  - Agora o limiar de movimento é proporcional à precisão: um deslocamento só conta se superar `max(5m, 0.75 × pior precisão dos dois pontos)`.
  - Verificado: caminhada real permanece correta (~198m para 200m) e a distância parada fica em 0m em todas as faixas de precisão testadas.
- A fórmula de Haversine foi conferida contra distâncias de referência (0.001°=111,19m, SP→RJ 360,7km, Equador→Polo 10008km) — correta.

## v1.2.2

- Publica o APK numa Release (`apk-latest`) para download direto no celular, além do artefato do workflow.

## v1.2.1

- Build do APK na nuvem via GitHub Actions: gera o `app-debug.apk` a cada push, sem precisar de Android Studio na máquina local (o APK sai como artefato do workflow).
- Versiona o projeto `android/` já com as permissões de localização em segundo plano no `AndroidManifest.xml`.

## v1.2.0

- Suporte a **app nativo Android** (Capacitor) com rastreamento **real em segundo plano e tela bloqueada**.
  - Integra o plugin `@capacitor-community/background-geolocation` (notificação persistente / serviço em primeiro plano).
  - O mesmo `index.html` detecta o ambiente: no app nativo usa o plugin de background; na web mantém o fallback com a Geolocation do navegador (Wake Lock + costura + persistência).
  - Projeto Capacitor: `package.json`, `capacitor.config.json`, script `scripts/copy-web.mjs` (gera `www/`) e guia de build `NATIVE.md`.
- A web (GitHub Pages) continua funcionando sem alterações.

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
