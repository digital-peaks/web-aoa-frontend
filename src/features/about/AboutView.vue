<template>
  <div class="container text-start pt-10">
    <h1>About</h1>
    <v-row justify="center">
      <h5>What kind of website is this?</h5>
      <p>
        This web application aims to implement the AOA method according to Meyer
        & Pebesma (2021). For this purpose the LU/LC classification was used.
      </p>
      <br />
      <br />

      <h5>Project reference</h5>
      <p>
        Machine learning has become a popular method for remote sensing data
        classification. Possible classifications can be found in the context of
        LULC. Machine learning offers the possibility to capture also nonlinear
        relationships. This makes complex classifications possible. Usually,
        such models are trained for spaces in which the actual values of the
        target variables are known. In this case, methods must also be found and
        made available, which perform an estimation. This estimation determines
        how well an already trained model is suitable for a new application
        space. In this new application area, the target variables must first be
        determined.
        <br />
        The area of applicability method, as proposed by Meyer and Pebesma
        (Meyer and Pebesma 2021), solves exactly this problem. This method
        generates a spatial estimate that represents the reliability of the
        machine classification algorithm in a new application area. Currently,
        the use of the AOA method requires knowledge of the R language.
        <br />
        The goalnow is to create an infrastructure that makes the AOA method
        available to a much wider range of users. This will allow users who do
        not know the R programming language well to use the AOA method for their
        purposes and research.
      </p>

      <h5>Who are we?</h5>
      <p>
        Our company is a five-person project team, which is specialized in the
        development of modern modern web applications with a focus on geospatial
        data processing. The business partner is WWU Münster. The order was
        submitted by the department 14 - Geosciences.
      </p>
    </v-row>

    <v-btn
      class="pt-10"
      elevation="0"
      color="white"
      href="https://github.com/digital-peaks"
      target="_blank"
    >
      <v-icon>mdi-github</v-icon> Github
    </v-btn>
  </div>
</template>

<style scoped>
.v-btn:not(.v-btn--round).v-size--default {
  height: 36px;
  min-width: 64px;
  padding: 0 3px;
}
</style>
