<template>
  <div class="comp-scanner">
    <video class="realtime-video" autoplay ref="video"
      @playing="handleVideoPlaying" @timeupdate="handleVideoTimeUpdate"></video>
    <canvas class="frame" ref="frame" :width="videoWidth" :height="videoHeight"></canvas>
    <div class="ui-layer">
      <div class="device-picker">
        <select v-model="sourceId" @change="handleSourceIdChange" title="Devices">
          <option v-for="device in devices" :value="device.deviceId">{{device.label}}</option>
        </select>
      </div>
      <div class="text-parsed">
        <a :href="parsedText" target="_self" v-if="isUrl">{{parsedText}}</a>
        <span v-else>{{parsedText}}</span>
      </div>
      <div class="text-error">
        <span>{{videoErrorText}}</span>
        <span>{{decodeErrorText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import QrCode from 'qrcode-reader'

export default {
  name: 'scanner',
  data () {
    return {
      parsedText: '',
      videoErrorText: '',
      decodeErrorText: '',

      videoWidth: 360,
      videoHeight: 360,

      sourceId: '',
      devices: []
    }
  },
  computed: {
    isUrl() {
      return /https?:\/\//.test(this.parsedText)
    }
  },
  methods: {
    handleSourceIdChange() {
      let sourceId = this.sourceId
      let devices = this.devices
      let deviceIndex = 0
      for (var i = devices.length - 1; i >= 0; i--) {
        if (devices[i].deviceId === sourceId) {
          deviceIndex = i
          break
        }
      }
      // somehow, call updateVideoSource directly does not work
      // refresh the page to enforce video change
      this.$root.$setHash('device', deviceIndex)
      this.$nextTick(function () {
        location.reload()
      })
    },
    updateVideoSource() {
      navigator.mediaDevices.getUserMedia({
          video: {
              optional: [
                {
                  sourceId: this.sourceId
                }
              ]
          }
      }).then(stream => {
          let video = this.$refs.video
          video.src = window.URL.createObjectURL(stream)
      }).catch(err => {
          this.videoErrorText = err.name + ' ' + err.message
      })
    },

    handleVideoPlaying({target}) {
      this.videoWidth = target.videoWidth
      this.videoHeight = target.videoHeight
    },

    handleVideoTimeUpdate() {
      let video = this.$refs.video
      let context = this.frameContext
      let qr = this.qrCode
      context.drawImage(video, 0, 0, this.videoWidth, this.videoHeight)
      let imageData = context.getImageData(0, 0, this.videoWidth, this.videoHeight)
      qr.decode(imageData)
    },

    hanleQrCodeDecoded(result, error) {
      if (result) {
        this.parsedText = result
      }
      else {
        this.decodeErrorText = error
      }
    }
  },
  mounted() {
    this.frameContext = this.$refs.frame.getContext('2d')


    let qr = new QrCode()
    qr.callback = this.hanleQrCodeDecoded
    this.qrCode = qr

    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices = devices.filter(device => device.kind == 'videoinput')
      if (devices.length) {
        this.devices = devices.sort((a, b) => a.label > b.label ? 1 : -1)
        let deviceIndex = this.$root.$hashParams.device || 0
        this.sourceId = devices[Math.min(deviceIndex, devices.length - 1)].deviceId
        this.updateVideoSource()
      }
      else {
        this.videoErrorText = 'No available cameras'
      }
    })
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

.realtime-video {
  width: 100%;
  height: 100%;
}

.frame {
  display: none;
}

.ui-layer {
  display: flex;
  justify-content: center;
  align-content: space-between;
  flex-wrap: wrap;

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.ui-layer > div {
  width: 100%;
  line-height: 2;
  text-align: center;
}

[class^=text-] {
  color: white;
  word-wrap: break-word;
  padding-left: .3em;
  padding-right: .3em;
}

.text-error {
  font-size: .8em;
}
.text-parsed {
  font-size: 1.5em;
  text-shadow: 1px 1px 0 black, 0 0 1px black;
  line-height: 1;
}
</style>
