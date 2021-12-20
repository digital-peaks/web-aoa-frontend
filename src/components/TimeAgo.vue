<template>
  <span :title="data.title">{{ data.value }}</span>
</template>

<script>
import isDate from "date-fns/isDate";
import isBefore from "date-fns/isBefore";
import subHours from "date-fns/subHours";
import format from "date-fns/format";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addLocale(en);
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo();

/**
 * Shows the given date in format like "vor 2 Minuten" or (12.12.21, 15:00).
 * After 24 hours the full date will always shown.
 */
export default {
  name: "TimeAgo",
  props: {
    date: String,
  },
  computed: {
    data: function () {
      const dateInstance = new Date(this.date);

      const data = {
        // value will be shown
        value: "",
        // on hover show the full date
        title: "",
      };

      if (!isDate(dateInstance)) {
        return data;
      }

      data.title = format(dateInstance, "yyyy-MM-dd, HH:mm");

      if (isBefore(dateInstance, subHours(new Date(), 24))) {
        // Given date is older than 24 hours
        data.value = data.title;
        data.title = "";
      } else {
        // Less than 24 hours ago.
        // Show e.g. "vor 3 Sekunden"
        data.value = timeAgo.format(dateInstance);
      }
      return data;
    },
  },
};
</script>
