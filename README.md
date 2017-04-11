# vue-datepicker
Vue.js datepicker component
## Usage
```html
<script src="https://unpkg.com/vue@2.2.6/dist/vue.min.js"></script>
<script src="js/vue-datepicker.js"></script>
<link ref="stylesheet" href="css/vue-datepicker.css">
<div id="app">
  <input v-model="birth_date" @focus="pickVisible = true" type="text" placeholder="1980-01-05"/>
  <date-picker v-if="pickVisible" @blur="pickVisible = false" @change="pickChanged" :format="'yyyy-mm-dd'"></date-picker>
</div>
<script>
  var app = new Vue({
      el: '#app',
      router: router,
      data: {
          pickVisible: false,
          birth_date: ''
      },
      methods: {
        pickChanged: function(pick_date) {
          this.birth_date = pick_date
        }
      }
  });
</script>
```
