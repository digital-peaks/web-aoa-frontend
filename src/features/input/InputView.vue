<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="form-column">
      <div class="m-3">
        <h3>Job erstellen</h3>

        <div class="form-floating mt-3 mb-3">
          <input type="text" class="form-control" id="name" placeholder="Jo" />
          <label for="name" class="form-label">Name</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="algorithm"
            class="form-select"
            style="width: auto; min-width: 200px"
            aria-label="Algorithmus auswählen"
          >
            <option selected>Random Forest</option>
            <option>Weitere...</option>
          </select>
          <label for="algorithm" class="form-label">Algorithmus</label>
        </div>

        <div class="mb-3">
          <!-- Hide input file and trigger it via the button -->
          <input
            type="file"
            ref="aoiInput"
            @change="onChangeAOIInput"
            accept="application/JSON"
            class="d-none"
          />
          <div v-if="aoiFile">
            {{ aoiFile.name }}
          </div>
          <button
            type="button"
            @click="selectAOIFile"
            class="btn btn-secondary"
          >
            Area of Interest hochladen (*.json)
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-light">Abbrechen</button>
          <button type="button" class="btn btn-primary ms-2">Erstellen</button>
        </div>
      </div>
    </div>
    <div class="bg-success map-column">Map</div>
  </div>
</template>

<script>
export default {
  name: "InputView",
  data: () => ({
    aoiFile: undefined,
  }),
  methods: {
    selectAOIFile() {
      this.$refs.aoiInput.click();
    },
    onChangeAOIInput(event) {
      const [file] = event.target.files;
      console.log(file);
      this.$data.aoiFile = file;
    },
  },
};
</script>

<style scoped>
.form-column {
  flex: auto;
}
.map-column {
  flex: auto;
  min-height: 350px;
  height: 50%;
}
@media (min-width: 992px) {
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    min-height: 0;
  }
  .map-column {
    flex: 1;
    min-height: auto;
    height: 100%;
  }
}
</style>
