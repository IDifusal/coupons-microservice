function prepareTitle(title) {
  const sizeTitle = 9;
  let titlePrepared = title;

  if (title.length > sizeTitle) {
    throw new Error(
      `The size of the title of the debug message must be less than ${
        sizeTitle + 1
      }`
    );
  }
  const count = sizeTitle - title.length;

  for (let i = 0; i < count; i += 1) {
    titlePrepared += ' ';
  }
  return titlePrepared;
}

function apiLogger(title, message) {
  // eslint-disable-next-line no-console
  console.log(`${title}: `, message);
}

function apiDebug(title, message, payload) {
  const dateISO = new Date().toISOString().split('T')[1];
  const hour = dateISO.split('.')[0];

  // eslint-disable-next-line no-console
  console.log(`[${hour}] | ${prepareTitle(title)} | ${message}`);
  // eslint-disable-next-line no-console
  if (payload) console.table(payload);
}

module.exports = { apiLogger, apiDebug };
