export const Streams = {
  imperialValley: {
    id: "imperial-valley",
    name: "Imperial Valley",
    frequency: "95.7 FM",
    url: "https://ssl-2.stream.miriamtech.net/jp2radio/jp2radio.mp3",
    scheduleUrl: "https://jp2radio.com/schedulewidget/index-elcentro.html",
  },
  sanDiego: {
    id: "san-diego",
    name: "San Diego",
    frequency: "93.7 FM",
    url: "https://ssl-2.stream.miriamtech.net/jp2radio/san-diego",
    scheduleUrl: "https://jp2radio.com/schedulewidget/index-sandiego.html",
  },
};

export const Links = {
  donate: "https://give.cornerstone.cc/Saint+John+Paul+II+Radio",
  events: "https://jp2radio.com/events/",
  podcasts: "https://jp2radio.com/podcasts/",
  blog: "https://jp2radio.com/blog/",
  blogFeed: "https://jp2radio.com/feed/",
  youtube: "https://www.youtube.com/@jp2radio",
  facebook: "https://www.facebook.com/JP2Radio/",
  instagram: "https://www.instagram.com/jp2catholicradio/",
  privacy: "https://jp2radio.com/privacy-policy-2/",
  terms: "https://jp2radio.com/terms-and-conditions/",
  website: "https://jp2radio.com/",
};

export const Contact = {
  phone: "888-388-8821",
  email: "info@jp2radio.com",
  address: "P.O. Box 2507, El Centro, CA 92244",
};

export const AppConfig = {
  name: "JP2 Radio",
  tagline: "Faithful. Catholic.",
  version: "2.2.0",
  maxRecordingDuration: 120, // seconds
  defaultStream: "imperial-valley",
  sleepTimerOptions: [15, 30, 60], // minutes — add/remove options here
};

// Banner configuration
export const Banners = {
  hero: {
    xmlUrl: "https://jp2radio.com/mobile-app/imagepanels/panel540.xml",
    fallbackImage: null,
  },
  sponsor: {
    xmlUrl: "https://jp2radio.com/mobile-app/imagepanels/panel270.xml",
    fallbackImage: null,
  },
  // Hero: 1080x540 (2:1) → images in /mobile-app/imagepanels/1080x540/
  // Sponsor: 1080x270 (4:1) → images in /mobile-app/imagepanels/1080x270/
  rotationInterval: 5000, // 5 seconds
};

// OneSignal configuration
export const OneSignalConfig = {
  appId: "695e4a88-67c8-454f-b969-5f61fd18ff25",
};
