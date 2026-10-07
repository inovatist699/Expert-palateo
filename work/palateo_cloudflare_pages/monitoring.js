/* Error monitoring only: no replay, analytics, form data or account identifiers. */
(function () {
  if (!window.Sentry) return;
  let sent = 0;
  const clean = value => String(value || '').slice(0, 500)
    .replace(/https?:\/\/[^\s"'<>]+/g, '[url]')
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[email]')
    .replace(/(?:Bearer\s+)?eyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+/g, '[token]')
    .replace(/\b(?:re_|sb_secret_)[A-Za-z0-9_-]+/g, '[secret]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[number]');
  Sentry.init({
    dsn: 'https://cdc11205be7e35e04095427bf02641ab@o4512210066210816.ingest.de.sentry.io/4512210072109136',
    environment: 'production', release: 'palateo-2026-10-06-monitoring',
    sendDefaultPii: false, autoSessionTracking: false, sendClientReports: false,
    defaultIntegrations: false,
    integrations: [Sentry.globalHandlersIntegration(), Sentry.dedupeIntegration()],
    tracesSampleRate: 0, maxBreadcrumbs: 0,
    beforeSend(event) {
      if (sent++ >= 5) return null; // ponytail: five errors per page load; tune after measuring the free quota.
      const safe = {event_id:event.event_id, timestamp:event.timestamp, platform:'javascript',
        level:event.level || 'error', environment:'production', release:'palateo-2026-10-06-monitoring',
        tags:{surface:location.pathname.startsWith('/app') ? 'app' : 'waitlist'}};
      if (event.message) safe.message = /^[a-z_]{1,60}$/.test(event.message) ? event.message : 'Browser error';
      if (event.exception) safe.exception = {values:(event.exception.values || []).slice(0, 3).map(error => ({
        type:/^(Error|TypeError|SyntaxError|ReferenceError|RangeError|URIError|EvalError)$/.test(error.type) ? error.type : 'Error', value:'Unhandled browser error',
        stacktrace:{frames:(error.stacktrace?.frames || []).slice(-20).map(frame => {
          let filename = '[external]';
          try { const url = new URL(frame.filename, location.origin); if (url.origin === location.origin) filename = url.origin + url.pathname; } catch {}
          return {filename, function:clean(frame.function), lineno:frame.lineno, colno:frame.colno};
        })}
      }))};
      return safe;
    }
  });
  window.reportPalateoError = code => {
    if (/^[a-z_]{1,60}$/.test(code)) Sentry.captureMessage(code, 'error');
  };
})();
