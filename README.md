# vue-datepicker
Vue.js datepicker component
## Usage
```html
<script src="https://unpkg.com/vue@2.2.6/dist/vue.js"></script>
<script src="js/vue-datepicker.js"></script>
<link rel="stylesheet" href="css/vue-datepicker.css">
<div id="app">
  <input v-model="birth_date" @focus="pickVisible = true" type="text" placeholder="1980-01-05"/>
  <date-picker v-if="pickVisible" v-model="birth_date" @blur="pickVisible = false" @change="pickChanged"></date-picker>
</div>
<script>
  var app = new Vue({
    el: '#app',
    data: {
      pickVisible: false,
      birth_date: ''
    },
    methods: {
      pickChanged: function(pick_date) {
        this.birth_date = pick_date;
      }
    }
  });
</script>
```
## Config
You can pass configuration as a prop into the component

Here is a sample configuration:
```javascript
{
  names: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  },
  mondayFirst: true, // monday as first weekday
  startDate: '02/02/2002', // initial date
  format: 'mm/dd/yyyy' // date exchange format.
}
```