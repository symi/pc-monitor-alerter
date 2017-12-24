<template>
  <screen ref='screen' :smartCSR="true" :keys="true">
    <line-graph :lineData="data" :style="style"/>
  </screen>
</template>

<script>
import LineGraph from './line.js'
let counter = 12;

export default {
  props: ['data'],
  name: 'Dashboard',
  components: {
    LineGraph
  },
  data: () => {
    return {
      data: this.props.data,
      style: {
        bg: 'black',
        fg: 'white',
        border: {
          fg: 'green',
          // bg: 'red'
        }
      }
    }
  },
  mounted () {
    this.$refs.screen.key(['C-c'], () => {
      process.exit(0)
    })
    setInterval(() => {
      this.data = {
        x: [...this.data.x.slice(1), `t${++counter}`],
        y: [...this.data.y.slice(1), Math.floor(Math.random() * 10 % 10) + 1]
      }
    }, 1000)
  }
}
</script>