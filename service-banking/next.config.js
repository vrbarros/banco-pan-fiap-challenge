// eslint-disable-next-line @typescript-eslint/no-var-requires
const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withImages = require('next-images');

module.exports = withImages(calendarTranspile({}));
