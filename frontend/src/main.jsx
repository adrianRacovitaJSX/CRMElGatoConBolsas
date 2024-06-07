import { createRoot } from 'react-dom/client';
import RootApp from './RootApp';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://b1d019445be010b6027744d9d13fbc7c@o4507379651706880.ingest.de.sentry.io/4507379654525008",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        // Additional SDK configuration goes in here, for example:
        colorScheme: "light",
        triggerLabel: "Reportar un error",
        formTitle: "¿Qué salió mal?",
        submitButtonLabel: "Enviar",
        cancelButtonLabel: "Cancelar",
        confirmButtonLabel: "Confirmar",
        addScreenshotButtonLabel: "Añadir captura",
        removeScreenshotButtonLabel: "Eliminar captura",
        nameLabel: "Nombre",
        namePlaceholder: "Tu nombre",
        messageLabel: "Descripción",
        messagePlaceholder: "Describe el problema que encontraste",
        successMessageText: "¡Gracias por tu ayuda!"
    }),
    ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<RootApp />);
