<template>
  <div class="container">
    <table class="table text-start">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Created</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>Job 1</td>
          <td>2021-11-19 08:55:21</td>
          <td>...</td>
        </tr>
        <tr>
          <th scope="row">2</th>
          <td>Job 2</td>
          <td>2021-11-19 08:55:21</td>
          <td>...</td>
        </tr>
        <tr>
          <th scope="row">3</th>
          <td>AOA Test</td>
          <td>2021-11-19 08:55:21</td>
          <td>...</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "JobsList",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
