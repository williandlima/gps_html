# App nativo Android (Capacitor) — guia de build

Este guia transforma o app web (`index.html`) em um **app Android nativo** que
rastreia o GPS **em segundo plano e com a tela bloqueada**, usando o plugin
`@capacitor-community/background-geolocation` (gratuito). O mesmo `index.html`
funciona nos dois modos: na web usa a Geolocation do navegador; no app nativo
usa o plugin de background automaticamente.

Todos os comandos abaixo são rodados **no seu Mac**.

## 1. Pré-requisitos (instalar uma vez)

- **Node.js 18+**: https://nodejs.org (ou `brew install node`)
- **Android Studio**: https://developer.android.com/studio
  - Ao abrir pela primeira vez, deixe instalar o **Android SDK**, **Platform-Tools**
    e um **Android Virtual Device** (emulador) ou use um celular físico.
- **JDK 17** (o Android Studio já inclui um; se faltar: `brew install openjdk@17`)

## 2. Preparar o projeto

No terminal, dentro da pasta do repositório (onde está o `index.html`):

```bash
npm install                 # baixa Capacitor + plugin de background
npm run copy:web            # gera a pasta www/ com os arquivos do app
npx cap add android         # cria a pasta android/ (projeto nativo)
npm run sync                # copia o web + registra os plugins no Android
```

## 3. Permissões de localização em segundo plano

Abra `android/app/src/main/AndroidManifest.xml` e, dentro da tag `<manifest>`
(antes de `<application>`), garanta que existam estas permissões:

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

> O plugin de background já declara o serviço em primeiro plano; você só precisa
> garantir as permissões acima. Ao rodar o app, aceite a localização e escolha
> **"Permitir o tempo todo"** para funcionar com a tela bloqueada.

## 4. Rodar / gerar o APK

Abra o projeto no Android Studio:

```bash
npm run open:android
```

Depois, no Android Studio:

- **Testar num emulador ou celular** (celular via cabo USB com "Depuração USB"
  ligada): clique no botão **Run ▶**.
- **Gerar um APK instalável**: menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
  O APK sai em `android/app/build/outputs/apk/debug/app-debug.apk` — copie para o
  celular e instale (permita "fontes desconhecidas").

## 5. Depois de mudar o `index.html`

Sempre que editar o app web, ressincronize antes de rodar de novo:

```bash
npm run sync
```

## Observações

- **Bateria**: para o Android não matar o rastreamento, desative a otimização de
  bateria para o app (Configurações → Apps → GPS Tracker → Bateria → Sem restrições).
- **Notificação persistente**: enquanto rastreia, aparece uma notificação fixa —
  é ela que mantém o app vivo em segundo plano (exigência do Android).
- **iOS**: este guia cobre Android. Para iOS o mesmo código serve, mas o build
  usa Xcode e um plano Apple — fora do escopo desta versão.
