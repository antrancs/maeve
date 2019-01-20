<template>
  <svg :width="size" :height="size">
    <clipPath id="clipCircle">
      <circle
        :r="artworkSize / 2 - barWidth / 2"
        :cx="size / 2 + barWidth / 2"
        :cy="size / 2"
      />
    </clipPath>

    <linearGradient
      ref="gradientRef"
      id="grad2"
      x1="0%"
      y1="0%"
      x2="100%"
      y2="0%"
    >
      <stop offset="0%" style="stop-color:#fc4a1a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f7b733;stop-opacity:1" />
    </linearGradient>

    <filter id="dropShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
      <feOffset dx="2" dy="4" />
      <feColorMatrix
        type="matrix"
        values="1.5   0   0   0   0
            0   1.5   0   0   0
            0   0   1.5   0   0
            0   0   0   1   0"
      />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <g filter="url(#dropShadow)" :class="['imageRef', { playing: isPlaying }]">
      <image
        :xlink:href="artworkUrl"
        :x="artworkX"
        :y="artworkY"
        :width="artworkSize"
        :height="artworkSize"
        clip-path="url(#clipCircle)"
      />
    </g>

    <rect
      :ref="`rect-${index}`"
      class="myClass"
      v-for="(item, index) in items"
      :key="item.i"
      :x="item.x"
      :y="item.y"
      rx="2"
      ry="2"
      :width="item.width"
      height="4"
      fill="url(#grad2)"
      :transform="
        `rotate(${item.angleIndegree}, ${item.center.x}, ${item.center.y})`
      "
    ></rect>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { TimelineLite } from 'gsap';
import { setTimeout } from 'timers';

// @ts-ignore
import CustomEase from '@/vendor/CustomEase.js';
import { Nullable } from '@/@types/model/model';
import { Prop, Watch } from 'vue-property-decorator';
import { State } from 'vuex-class';

@Component
export default class PlayingVisualization extends Vue {
  private numOfItems = 100;
  private items: any[] = [];
  private timeline: Nullable<TimelineLite> = null;
  private repeat = 0;
  private maxRepeat = 8;
  private padding = 75;
  private rectRefs: (Vue | Element | Vue[] | Element[])[] = [];
  private aniData: (number[])[] = [];
  private barWidth = 10;
  private barHeight = 4;
  private gradientColors = [
    ['#e1eec3', '#f05053'],
    ['#FC5C7D', '#6A82FB'],
    ['#FFAFBD', '#ffc3a0'],
    ['#fc4a1a', '#f7b733'],
    ['#12c2e9', '#c471ed'],
    ['#C6FFDD', '#FBD786']
  ];

  @State(state => state.musicPlayer.isPlaying)
  isPlaying!: boolean;

  @Prop() artworkUrl!: string;
  @Prop() size!: number;

  get radius(): number {
    return (this.size - this.padding * 2) / 2;
  }

  get artworkX(): number {
    return this.size / 2 - this.radius / Math.sqrt(2) + this.barWidth / 2; // offset due to the inward bars
  }

  get artworkY(): number {
    return this.size / 2 - this.radius / Math.sqrt(2);
  }

  get artworkSize(): number {
    return this.radius * Math.sqrt(2) + this.barWidth / 2;
  }

  @Watch('isPlaying')
  onPlayingChanged(newValue: boolean) {
    if (!this.timeline) {
      return;
    }
    if (!newValue) {
      this.timeline.pause();
    } else {
      this.timeline.resume();
    }
  }

  @Watch('musicPlayer.currentPlaying')
  onCurrentPlayingChanged(newValue: MusicKit.MediaItem) {
    if (newValue && this.timeline) {
      this.timeline.pause();
      this.repeat = 0;
      this.generateAnimationData();
    }
  }

  mounted() {
    this.rectRefs = this.items.map(
      (item, index) => this.$refs[`rect-${index}`]
    );

    CustomEase.create(
      'hop',
      'M 100 400 Q 150 200 200 350 Q 250 100 300 300 Q 350 0 400 250 C 400 200 450 100 500 300 C 550 50 600 250 600 400'
    );

    this.startTimeline();

    if (!this.isPlaying && this.timeline) {
      this.timeline.pause();
    }
  }

  beforeDestroy() {
    if (this.timeline) {
      this.timeline.kill();
    }
  }

  created() {
    const { myRect } = this.$refs;

    const items = [];
    for (let i = 0; i < this.numOfItems; i++) {
      const angle = (i / (this.numOfItems / 2)) * Math.PI;

      let x = Math.cos(angle) * this.radius + this.size / 2;
      let y = Math.sin(angle) * this.radius + this.size / 2;

      const angleIndegree = (i / (this.numOfItems / 2)) * 180;
      const center = {
        x: x + this.barWidth / 2,
        y: y + this.barHeight / 2
      };
      items.push({ i, x, y, center, angleIndegree, width: this.barWidth });
    }

    this.generateAnimationData();

    this.items = items;
  }

  startTimeline() {
    this.timeline = this.createTimeline();
  }

  createTimeline() {
    const timeline = new TimelineLite({
      onComplete: () => {
        this.repeat++;
        if (this.repeat >= this.maxRepeat) {
          this.repeat = 0;
        }
        if (this.timeline) {
          this.timeline.kill();
        }

        this.startTimeline();
      }
    });

    // animaate the visualization bar width
    this.rectRefs.forEach((ref, index) => {
      timeline.to(
        ref,
        1.5,
        {
          ease: 'hop',
          attr: { width: this.aniData[this.repeat][index] }
        },
        this.getRandomInt(0, 4) / 10
      );
    });

    // Animate the visualization bar colors
    timeline.staggerTo(
      '#grad2 stop',
      1,
      {
        cycle: {
          stopColor: this.gradientColors[
            this.repeat % this.gradientColors.length
          ]
        }
      },
      0.1,
      0
    );

    return timeline;
  }

  generateAnimationData() {
    this.aniData = [];
    for (let i = 0; i < this.maxRepeat; i++) {
      let arr: number[] = [];
      for (let j = 0; j < 100; j++) {
        arr.push(this.getRandomInt(9, 35));
      }
      this.aniData.push(arr);
    }
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
</script>

<style lang="scss" scoped>
.imageRef {
  animation: rotating 8s linear infinite;
  animation-play-state: paused;
  transform-origin: 51% 50%;
}

.imageRef.playing {
  animation-play-state: running;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
