<template>
  <span :title="data.title">{{ data.value }}</span>
</template>

<script>
import isDate from "date-fns/isDate";
import isBefore from "date-fns/isBefore";
import subHours from "date-fns/subHours";
import format from "date-fns/format";
import TimeAgo from "javascript-time-ago";
import de from "javascript-time-ago/locale/de.json";

TimeAgo.addLocale(de);
TimeAgo.addDefaultLocale(de);
const timeAgo = new TimeAgo();

export default {
  name: "TimeAgo",
  props: {
    date: String,
  },
  computed: {
    data: function () {
      const dateInstance = new Date(this.date);

      const data = {
        value: "",
        title: "",
      };

      if (!isDate(dateInstance)) {
        return data;
      }

      data.title = format(dateInstance, "dd.MM.yy, HH:mm");

      if (isBefore(dateInstance, subHours(new Date(), 24))) {
        data.value = data.title;
        data.title = "";
      } else {
        data.value = timeAgo.format(dateInstance);
      }
      return data;
    },
  },
};
</script>
