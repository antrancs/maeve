<template>
  <svg
    ref="worldMap"
    :width="width"
    height="100%"
    :viewBox="`0 0 ${width} ${height}`"
  >
    <g ref="countriesGroup" class="countriesGroup" :transform="mapTransform">
      <path
        :class="['country', { active: path.country === centered }]"
        v-for="(path, index) in paths"
        :key="index"
        :d="path.d"
        @click="() => handleCountryClicked(path.country)"
      >
        <title>{{ path.title }}</title>
      </path>
    </g>
  </svg>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  GeoProjection,
  GeoPath,
  select,
  zoom,
  event,
  geoNaturalEarth1,
  geoPath,
  tsv,
  json,
  ZoomBehavior,
  zoomIdentity
} from 'd3';
import { feature } from 'topojson';
import { State } from 'vuex-class';
import { Nullable } from '@/@types/model/model';

@Component
export default class WorldMap extends Vue {
  private projection!: GeoProjection;
  private geoPath!: GeoPath;
  private paths: any[] = [];
  private mapTransform = '';
  private svg: any = null;
  // private countriesGroupRef: any = null;
  private scaleFactor: number = 1;
  private translateX: number = 0;
  private translateY: number = 0;
  private width = 0;
  private height = 0;
  private centered: any = null;
  private zoom!: ZoomBehavior<Element, {}>;
  private countriesGeoMap: { [id: string]: any } = {};
  // Map from countries code (number) to their full name and a2 code (2-letter)
  private countriesNameMap: {
    [id: string]: { name: string; a2: string };
  } = {};
  @State(state => state.musicPlayer.currentPlaying)
  currentPlaying!: MusicKit.MediaItem | null;

  mounted() {
    this.setupMap();
    this.getMapData();
  }

  @Watch('currentPlaying')
  onCurrentPlayingChanged(
    newValue: MusicKit.MediaItem,
    oldValue: Nullable<MusicKit.MediaItem>
  ) {
    if (newValue && !oldValue) {
      // substract the player bar height (96) and offset a bit
      this.height -= 96 - 6;
    }
  }

  setupMap() {
    this.svg = select(this.$refs.worldMap as any);
    const svgParent = (this.$refs.worldMap as Element).parentElement!
      .parentElement;
    if (svgParent) {
      const boundRect = svgParent.getBoundingClientRect();
      this.width = boundRect.width;
      this.height = boundRect.height;
    }

    this.zoom = zoom()
      .scaleExtent([1, 10])
      .on('zoom', this.onMapZoomed);
    this.svg.call(this.zoom);

    this.projection = geoNaturalEarth1()
      .translate([this.width / 2.2, this.height / 1.6])
      .scale(this.width / 1.5 / Math.PI);

    this.geoPath = geoPath().projection(this.projection);
  }

  getMapData() {
    Promise.all([
      tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ]).then(([tsvData, toppoJsonData]) => {
      const jsonData = toppoJsonData as any;

      // the json file contains country Id. The tsv file contains countries name and code
      tsvData.forEach((data: any) => {
        if (data) {
          this.countriesNameMap[data.iso_n3] = {
            name: data.name,
            a2: data.iso_a2
          };
        }
      });
      const countries = feature(jsonData, jsonData.objects.countries) as any;
      this.paths = Object.freeze(
        countries.features.map((feature: any) => {
          return {
            d: this.geoPath(feature),
            title: this.countriesNameMap[feature.id].name,
            country: feature
          };
        })
      );

      // This map is used to lookup the country code to the country geo detail
      const map: { [id: string]: any } = {};
      countries.features.forEach((feature: any) => {
        const countryA2Code = this.countriesNameMap[feature.id].a2;
        map[countryA2Code] = feature;
      });

      this.countriesGeoMap = Object.freeze(map);
    });
  }

  onMapZoomed() {
    this.mapTransform = event.transform;
  }

  handleCountryClicked(country: any) {
    let x: number, y: number, k: number;
    if (country && country !== this.centered) {
      // get bounds of the path of the selected country
      const bounds = this.geoPath.bounds(country);

      let dx = bounds[1][0] - bounds[0][0], //get bounding box
        dy = bounds[1][1] - bounds[0][1];

      // For small countries, just set a fixed dx to limit zoom
      if (dx <= 70) {
        dx = 70;
      }

      switch (country.id) {
        case '250': // France
          k = 7.012;
          x = -(bounds[1][0] + bounds[0][0]) / 1.8;
          y = -(bounds[1][1] + bounds[0][1]) / 3.6;
          break;

        case '840': // US
          k = 2.5;
          y = -(bounds[1][1] + bounds[0][1]) / 1.5;
          x = -(bounds[1][0] + bounds[0][0]) / 3;
          break;

        case '643': // Russia
          k = 1.5;
          y = -(bounds[1][1] + bounds[0][1]) / 1.5;
          x = -(bounds[1][0] + bounds[0][0]) / 1.15;
          break;

        case '554': //New Zealand
          k = 5;
          y = -(bounds[1][1] + bounds[0][1]) / 1.75;
          x = -(bounds[1][0] + bounds[0][0]) / 0.88;
          break;

        case '528': //Netherlands
          k = 10;
          y = -(bounds[1][1] + bounds[0][1]) / 2.9;
          x = -(bounds[1][0] + bounds[0][0]) / 1.45;
          break;
        default:
          k = 0.55 / Math.max(dx / this.width, dy / this.height);
          y = -(bounds[1][1] + bounds[0][1]) / 1.9;
          x = -(bounds[1][0] + bounds[0][0]) / 2 - this.width / k / 3.5;
      }

      this.centered = country;

      this.$emit('zoom-in', this.countriesNameMap[country.id]);
    } else {
      x = -this.width / 2.2;
      y = -this.height / 1.6;
      k = 1;
      this.centered = null;
      this.$emit('zoom-out');
    }

    // offset the player bar at the bottom
    if (this.currentPlaying) {
      y -= 96 / k;
    }

    const pt = this.projection.translate();

    this.resizeMap(k, pt[0] + x * k, pt[1] + y * k);
  }

  /**
   * Resize the map (scale & translate)
   */
  resizeMap(scale: number, translateX: number, translateY: number) {
    this.svg
      .transition()
      .duration(750)
      .call(
        this.zoom.transform,
        zoomIdentity.translate(translateX, translateY).scale(scale)
      );
    // .attr(
    //   'transform',
    //   'translate(' + translateX + ',' + translateY + ')scale(' + scale + ')'
    // );
  }

  zoomOut(countryCode: string) {
    this.handleCountryClicked(this.countriesGeoMap[countryCode]);
  }
}
</script>

<style lang="scss" scoped>
path {
  fill: var(--v-accent-lighten4);
}

.country:hover {
  fill: var(--v-accent-base);
  stroke: black;
}

.country {
  transition: fill 0.3s ease-out;
  stroke-width: 0.05px;
}

.active {
  fill: var(--v-accent-base);
  stroke: #444;
}

/* .countriesGroup {
  transition: transform 750ms ease-in-out;
} */

svg {
  width: 100%;
  // height: auto;
}
</style>
