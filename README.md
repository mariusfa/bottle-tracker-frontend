# Bottle Tracker Frontend

Dette er en frontend-app for å holde oversikt over vinflasker i ett eller flere vinskap. Appen kommuniserer med [bottle-tracker-go-api](https://github.com/mariusfa/bottle-tracker-go-api).

## Funksjonalitet
- Registrer vinflasker manuelt eller ved å scanne strekkode
- Sett inn flasker i et vinskap
- Fjern flasker fra vinskap
- Se oversikt over alle flasker og vinskap
- Web-app for enkel tilgang fra alle enheter

## Teknologi
- **React** og **TypeScript**
- **Tanstack Query** og **Tanstack Route** (mulig også Tanstack Form)
- **Testing:** Vitest, React Testing Library med user-events
- **Tailwind CSS v4** for styling

## Komme i gang
1. Installer avhengigheter:
	```bash
	npm install
	```
2. Start utviklingsserver:
	```bash
	npm run dev
	```

## API
Denne appen bruker [bottle-tracker-go-api](https://github.com/mariusfa/bottle-tracker-go-api) som backend.
