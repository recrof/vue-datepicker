Vue.component('date-picker', {
	template: '<div>'+
		'<div class="picker-clickcatcher" @click="$emit(\'blur\')"></div>'+
		'<div class="picker-container">'+
		'	<div class="picker-header">'+
		'		<select v-model="currentMonth" class="picker-month">'+
		'			<option :value="month.number - 1" v-for="month in months" >'+
		'				{{ month.caption }}'+
		'			</option>'+
		'		</select>'+
		'		<select v-model="currentYear" class="picker-year">'+
		'			<option v-for="year in years">'+
		'				{{ year }}'+
		'			</option>'+
		'		</select>'+
		'	</div>'+
		'	<div class="picker-days">'+
		'		<ul class="picker-captions">'+
		'			<li v-for="day in days">{{ day.caption }}</li>'+
		'		</ul>'+
		'		<ul v-for="(day, dayNum) in days" class="picker-data" :class="{ weekend: cfg.mondayFirst ? dayNum > 4 : dayNum == 0 || dayNum == 6 }">'+
		'			<li v-if="day.numbers[0] == 0" class="dummy">&nbsp;</li>'+
		'			<li v-for="number in day.numbers" v-if="number > 0" :class="{ selected: currentDay == number }" @click="dayChanged(number)">{{ number }}</li>'+
		'		</ul>'+
		'	</div>'+
		'</div>'+
		'</div>',
	data: function() {
		return {
			days: [], months: [], years: [],
			dateStr: '',
			currentMonth: new Date().getMonth(),
			currentYear: new Date().getFullYear(),
			currentDay: new Date().getDate(),
			cfg: JSON.parse(JSON.stringify(this.config))
		};
	},
	beforeMount: function() {
		var cfg = this.cfg;
		cfg.names = cfg.names || {};
		cfg.names.months = cfg.names.months || [
			'January', 'Feburary', 'March',
			'April', 'May', 'June', 'July',
			'August', 'September', 'October',
			'November', 'December'
		];
		cfg.names.days = cfg.names.days || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		cfg.mondayFirst = cfg.mondayFirst || 0;

		this.fillYearData();
		this.fillMonthData();
		this.fillDayData();
		this.convert = this.parseFormat(cfg.format || 'yyyy-mm-dd');
		this.convert.get();
	},
	methods: {
		fillYearData: function(startYear, endYear) {
			var year = endYear || new Date().getFullYear();
			startYear = startYear || 1900;

			if(endYear < startYear) throw('startYear('+ startYear +') must be lower than endYear('+ endYear +')');
			while(year > startYear) { this.years.unshift(year--); }
		},
		fillMonthData: function() {
			this.months = this.cfg.names.months.map(function(text, i) {
				return { caption: text, number: i + 1 };
			});
		},
		fillDayData: function() {
			var dt = new Date(this.currentYear, this.currentMonth, this.currentDay),
				mDay = 1,
				days = this.cfg.names.days.map(function(name, i) { return { caption: name, index: i, numbers: []};}),
				wDay = 0,
				i = 0;
			while(dt.setDate(mDay) && dt.getMonth() === this.currentMonth) {
				wDay = dt.getDay();
				days[wDay].numbers.push(mDay++);
			}
			if(this.cfg.mondayFirst) days.push(days.shift());
			while(days[i].numbers[0] !== 1) days[i++].numbers.unshift(0);
			this.days = days;
		},
		dayChanged: function(day) {
			this.currentDay = day;
			this.$emit('change', this.convert.set());
		},
		parseFormat: function(format) {
			var regFormat = format.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
				matches = { dd: '(\\d\\d)', mm: '(\\d\\d)', yyyy: '(\\d{4})' },
				order = [],
				self = this;
			order = format.match(/dd|mm|yyyy/g);
			Object.keys(matches).forEach(function(ph) {
				regFormat = regFormat.replace(ph, matches[ph]);
			});
			regFormat = new RegExp('^'+regFormat+'$');
			if(order.length !== 3)
				throw 'Invalid format "'+ format +'", also make sure that you include all 3 placeholders for year, month and day.';
			return {
				get: function() { // dateStr -> date
					var match = (self.value.match(regFormat) || []).splice(1,4);
					if(match.length === 0) return;
					match.forEach(function(val, i) {
						if(order[i] === 'dd') { self.currentDay = val; }
						else if (order[i] === 'mm') { self.currentMonth = val - 1; }
						else if (order[i] === 'yyyy') { self.currentYear = val; }
					});
				},
				set: function() { // date -> dateStr
					var val = format;
					val = val.replace('dd', ('0' + self.currentDay).slice(-2) );
					val = val.replace('mm', ('0' + (self.currentMonth + 1)).slice(-2) );
					val = val.replace('yyyy', self.currentYear );

					return val;
				}
			};
		}
	},
	props: [
		'value', 'config'
	],
	watch: {
		currentMonth: function() {
			this.fillDayData();
			this.$emit('change', this.dateStr = this.convert.set());
		},
		currentYear: function() {
			this.fillDayData();
			this.$emit('change', this.dateStr = this.convert.set());
		},
		value: function() {
			if(this.dateStr === this.value) return;
			this.convert.get();
		}
	}
});