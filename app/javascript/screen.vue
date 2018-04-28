<template>
  <div>
    <div class="background">
      {{ background }}
    </div>
    <div class="icon">
      <transition name="slide-fade"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
      >
        <div v-if="karaokeIcon || showSocial">
          <div v-html="karaokeIcon"></div>
          <div v-show="showSocial">
            <a v-if="social" :href="social.link" target="_blank">
              <i  :class="`fa fa-${social.name}`"></i>
            </a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import Velocity from 'velocity-animate'

  export default {
    props: ['icon', 'background', 'social', 'showSocial'],
    data() {
      return {
        karaokeIcon: this.icon,
      }
    },
    methods: {
      beforeEnter: function (el) {
        el.style.opacity = 0
      },
      enter: function (el, done) {
        Velocity(el,
          {
            opacity: 1
          },
          {
            easing: [Math.random(), -0.27,0.83, 0.67],
            duration: Math.random() * 500 ,
            complete: done
          }
        )
      },
      leave: function (el, done) {
        Velocity(el, {
          translateX: ((10 + Math.random() * 10) * _.sample([1,-1])) + 'px',
          opacity: 0
          },
          { duration: Math.random() * 1000, easing: [Math.random() / 2 + 0.5, -0.27,0.83, 0.67] },
          { complete: done })
      },
    },
    watch: {
      icon: function(val, oldVal) {
        this.karaokeIcon = val
        return setTimeout(() => {
          this.karaokeIcon = ''
        }, 1000)
      }
    }
  }
</script>
