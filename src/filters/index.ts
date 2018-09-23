import Vue from 'vue';

/**
 * Format a song duration in seconds into minutes and seconds
 * @param value song duration in seconds
 */
function formatSongDuration(value: number) {
  if (!value) {
    return '0:00';
  }

  const durationInSeconds = Math.floor(value / 1000);
  const NUMBER_OF_SECONDS_IN_A_MINUTE = 60;
  const minutes = Math.trunc(durationInSeconds / NUMBER_OF_SECONDS_IN_A_MINUTE);
  const seconds = durationInSeconds % NUMBER_OF_SECONDS_IN_A_MINUTE;
  return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
}

Vue.filter('formattedDuration', formatSongDuration);
