<template>
  <div>
    <div class="background">
      {{ background }}
    </div>
    <div :class="iconClass" @click="clicked" v-html="icon">
    </div>

  </div>
</template>

<script>
  import Bus from './bus.js'
  export default {
    props: ['icon', 'background', 'audio', 'socialTrigger'],
    data() {
      return {
        mp3Audio: this.audio ? this.buildMp3()  : null,
        isPlaying: false
      }
    },
    methods: {
      clicked() {
        if (this.socialTrigger) Bus.$emit('showSocial')
        if (!this.mp3Audio) return
        if (this.mp3Audio.paused) {
          this.mp3Audio.play()
          Bus.$emit('audioPlay', { audio: this.audio, mp3: this.mp3Audio })
          this.isPlaying = true
        } else {
          this.mp3Audio.pause()
          this.isPlaying = false
          Bus.$emit('audioPause', { audio: this.audio })
        }
      },
      buildMp3() {
        if (!this.audio) return
        const audio = new Audio(`/mp3/${this.audio}.mp3`)
        audio.onended = () => {
          this.isPlaying = false
          Bus.$emit('audioPause', { audio: this.audio })
        }
        return audio
      }
    },
    computed: {
      iconClass() {
        return { icon: true, [`${this.audio}Animation`]: this.isPlaying }
      }
    },
    mounted() {
      Bus.$on('audioPlay', payload => {
        if (payload.audio === this.audio || !this.mp3Audio) return
        this.isPlaying = false
        this.mp3Audio.pause()
      })
    }
  }
</script>

<style scoped lang="scss">
  .icon {
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 3;
    position: absolute;
    cursor: pointer;
  }
  .pinkCarAnimation {
    animation-name: pink_car;
    animation-duration: 5s;
    animation-iteration-count: infinite;
  }
  .haAnimation {
    animation-name: ha;
    animation-duration: 10s;
    transform-origin: bottom left;
    animation-iteration-count: infinite;
  }
  .boredAnimation:after {
    animation-name: bored;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    content: '💤  ';
    position: absolute;
    top: -30px;
    right: -20px;
    font-size: 30pt;
  }
  @keyframes bored {
    0% { content: '💤  '; transform: scale(1); }
    25% { content: '💤💤 '; transform: scale(0.85); }
    50% { content: '💤💤💤'; transform: scale(0.7); }
    75% { content: ' 💤💤'; transform: scale(0.85); }
    100% { content: '  💤'; transform: scale(1); }
  }
  @keyframes ha {
    0% { transform: rotate(0deg) translate(-50%, -50%); }
    25% { transform: rotate(30deg) translate(-100%, -50%); }
    50% { transform: rotate(0deg)  translate(-50%, -50%); }
    75% { transform: rotate(-30deg) translate(0%, -50%); }
    100% { transform: rotate(0deg) translate(-50%, -50%); }
  }
  @keyframes pink_car {
    0%   { transform: scale(1) translate(-50%,-50%); }
    50%  { transform: scale(1.15) translate(-50%,-50%); }
    100% { transform: scale(1) translate(-50%,-50%); }
  }
  </style>
