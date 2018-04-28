<template>
  <div id="app">
    <div
      class="preload-emoji"
      v-for="songEmoji in songsEmojis"
      v-html="emoji.replace_unified(songEmoji)"
    />
    <div class="main-screen" v-for="(screen, index) in screens">
      <screen
        v-if="index % 2 === 0"
        class="screen"
        :background="screen.background"
        :icon="screen.icon"
        :social="screen.social"
        :show-social="showSocial"
        :key="'s' + index"
      />
      <reactive-screen
        v-else
        :class="reactiveScreenClass"
        :icon="screen.icon"
        :background="screen.background"
        :key="'r' + index"
        :social-trigger="screen.socialScreen"
        :audio="screen.audio"
      />
    </div>
  </div>
</template>

<script>
import EmojiConvertor from 'emoji-js'
import { map, forEach, sample, shuffle, flatMap, compact } from 'lodash'
import Bus from './bus.js'
import songs from './songs.js'

import screen from './screen.vue'
import reactiveScreen from './reactiveScreen.vue'

export default {
  components: {screen, reactiveScreen},
  data: function() {
    return {
      screens: [],
      reactiveIndexes: [0,2,4,6,8],
      karaokeTimeouts: [],
      shuffledScreens: [],
      audioIsPlaying: false,
      showSocial: false,
      synchronizer: null,
      emoji: new EmojiConvertor()
    }
  },
  methods: {
    karaoke(song) {
      const self = this
      this.karaokeTimeouts = _.compact(_.map(songs[song.audio], function(emoji, timeout) {
        if (timeout < parseInt(song.mp3.currentTime * 1000)) return;
        return setTimeout(() => {
          self.screens[self.nextScreen()].icon = self.emoji.replace_unified(emoji)
        }, timeout - parseInt(song.mp3.currentTime * 1000))
      }))
    },
    nextScreen() {
      if (this.shuffledScreens.length === 0) {
        this.shuffledScreens = _.shuffle(this.reactiveIndexes)
      }
      return this.shuffledScreens.pop()
    },
    clearKaraoke() {
      _.forEach(this.karaokeTimeouts, function(timeout) {
        return clearTimeout(timeout)
      })
      return this.karaokeTimeouts = []
    }
  },
  computed: {
    reactiveScreenClass() {
      return { 'reactive-screen': true, 'blinking-screen': !this.audioIsPlaying }
    },
    songsEmojis() {
      return _.flatMap(songs, function(song, emojis) {
        return Object.values(song)
      })
    }
  },
  mounted() {
    const emoji = this.emoji

    const social = {
      bandcamp: { name: 'bandcamp', link: 'https://netvoydrug.bandcamp.com' },
      soundcloud: { name: 'soundcloud', link: 'https://soundcloud.com/netvoydrug' },
      fb: { name: 'facebook', link: 'https://facebook.com/netvoydrug' },
      vk: { name: 'vk', link: 'https://vk.com/nicheydrug' },
    }

    this.screens =
    [
     {background: 'T', icon: '', social: social.bandcamp}, {background: 'В', icon: '🙅‍♂️', socialScreen: 'true'}, {background: 'О', icon: '', social: social.soundcloud},
     {background: 'Й', icon: '🚘', audio: 'pinkCar'}, {background: '', icon: ''}, {background: 'Д', icon: '🛌', audio: 'bored'},
     {background: 'Р', icon: '', social: social.fb},{background: 'У', icon: '🤣', audio: 'ha'}, {background: 'Г', icon: '', social: social.vk}
    ]
    forEach(this.screens, function(screen) {
      screen.icon = emoji.replace_unified(screen.icon)
    })
    Bus.$on('audioPlay', payload => {
      this.audioIsPlaying = true
      this.showSocial = false
      clearInterval(this.synchronizer)
      this.synchronizer = setInterval(() => {
        this.clearKaraoke()
        this.karaoke(payload)
      }, 500)
    })
    Bus.$on('audioPause', payload => {
      this.audioIsPlaying = false
      clearInterval(this.synchronizer)
      this.clearKaraoke()
    })
    Bus.$on('showSocial', () => {
      if (this.audioIsPlaying) return
      this.showSocial = true
      setTimeout(() => { this.showSocial = false }, 5000)
      }
    )
    Bus.$on('hideSocial', () => this.showSocial = false)
  }
}
</script>

<style scoped lang="scss">
  * {
    display: flex;
  }

  #app {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: row;
    flex-wrap: wrap;
    min-height: 100%;
  }

  .main-screen {
    display: flex;
    width: 30vw;
    height: 30vh;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .reactive-screen {
    background-color: #e44780;
  }

  .screen {
    background-color: #e44780;
  }

  .screen, .reactive-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 100%;
    font-size: 200%;
  }

  .blinking-screen {
    animation-name: blinking_screen;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    box-shadow: inset 0 0 10px 20px #e44780;
    height: 90%;
  }

  .preload-emoji {
    visibility: hidden;
    position: absolute;
    top: -10000px;
  }

  @keyframes blinking_screen {
    0%   { background-color: #e44780; }
    50%  { background-color: rgba(34, 26, 55, 0.3); }
    100% { background-color: #e44780; }
  }
</style>
