<template>
  <div class="container text-start">
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
        Machine learning has become a popular method to classify remote sensing
        data. method for the classification of remote sensing data. Possible
        classifications can be found in the context of LU/LC. The possibility of
        using machine learning to capture non-linear correlations and thus to
        enable complex classifications is certainly one of the main reasons for
        this. for this. Usually, such models are trained for spaces in which the
        actual values of the target variables are known.
        <br />
        In addition, however, methods have to be found methods must be found and
        provided, which allow the user to estimate how good an already how well
        an already trained model can be applied to a new space, i.e. a space
        where the target variables are a space, in which the target variables
        are to be determined first. The Area of Applicability method, as
        proposed by Meyer and Pebesma (Meyer and Pebesma 2021), solves exactly
        this problem and allows the user to make a spatial estimate of how
        reliable the target variables are.
        <br />
        Since currently knowledge of the language R language is required for the
        use of the AOA method, an infrastructure shall be created which allows a
        much larger spectrum of users to use the AOA method for their own
        purposes.
      </p>

      <h5>Who are we?</h5>
      <p>
        Our company is a five-person project team, which is specialized in the
        development of modern modern web applications with a focus on geospatial
        data processing. The business partner is WWU Münster. The order was
        submitted by the department 14 - Geosciences.
      </p>
    </v-row>

    <br />

    <v-btn
      elevation="0"
      color="white"
      href="https://github.com/digital-peaks"
      target="_blank"
    >
      <v-icon>mdi-github</v-icon> Github
    </v-btn>
  </div>
</template>
