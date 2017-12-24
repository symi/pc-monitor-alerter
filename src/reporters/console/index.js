import VueBlessed from 'blessed-vue'
import Dashboard from './dashboard.vue'
import { name } from '../../../package.json'

const el = VueBlessed.dom.createElement()

VueBlessed.dom.append(el)

const instance = new VueBlessed({
  name,
  data: {
    temps: {
      x: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12'],
      y: [5, 1, 7, 5, 2, 4, 9, 1, 7, 3, 4, 5]
   }
  },
  components: {
    Dashboard
  },
  template: '<dashboard :data="temps" />'
}).$mount(el);

export default instance;