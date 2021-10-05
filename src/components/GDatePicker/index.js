import proxy from 'g-proxy'

import { unVue } from 'unvue'

import { isValidDate } from '../../utils/validators'

import render from './render'

const _ = { chunk: require('lodash/chunk') }

const today = new Date()
today.setHours(0, 0, 0, 0)

export default {
  name: 'GDatePicker',

  mixins: [ proxy() ],

  props: {
    localeTag: {
      type: String,
      default: 'en'
    },
    yearsFill: {
      type: [ Number, String ],
      default: 50
    },

    min: [ Number, String, Date ],
    max: [ Number, String, Date ],

    range: {
      type: Boolean,
      default: true
    },

    filter: {
      type: Function,
      default: v => v
    }
  },

  data() {
    return {
      date: {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate()
      },

      hoveringDate: undefined,

      state: 'days'
    }
  },

  computed: {
    daysOfWeek() {
      const date = new Date()
      const day = date.getDay()
      const firstDay = new Date(date.setDate(date.getDate() - day + (day === 0 ? -6 : 1)))
      const days = []

      for (let i = 0; i < 7; i++) {
        days.push(firstDay.toLocaleString(this.localeTag, { weekday: 'narrow' }))
        firstDay.setDate(firstDay.getDate() + 1)
      }

      return days
    },
    months() {
      const months = []

      for (let index = 0; index < 12; index++) {
        months.push({
          full: new Date(0, index).toLocaleString(this.localeTag, { month: 'long' }),
          short: new Date(0, index).toLocaleString(this.localeTag, { month: 'short' })
            .substring(0, 3),
          number: index
        })
      }

      return months
    },
    years() {
      const years = []

      for (let year = this.date.year + this.yearsFill; year >= this.date.year - this.yearsFill; year--) {
        years.push(year)
      }

      return years.reverse()
    },

    computedMin() {
      if (this.min) {
        return new Date(this.min).getTime()
      }
    },
    computedMax() {
      if (this.max) {
        return new Date(this.max).getTime()
      }
    },

    computedDate() {
      const date = new Date(this.date.year, this.date.month, this.date.day)
      const dayOfFirstDate = new Date(this.date.year, this.date.month, 1).getDay()
      const dayAmount = new Date(this.date.year, this.date.month + 1, 0).getDate()
      const daysMatrix = []

      const diff = dayOfFirstDate - 1
      const prepend = diff < 0 ? 7 + diff : diff

      for (let index = 0; index < prepend; index++) {
        daysMatrix.push(undefined)
      }

      for (let index = 1; index <= dayAmount; index++) {
        daysMatrix.push(index)
      }

      return {
        date,
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        daysMatrix: _.chunk(daysMatrix, 7),
        monthsMatrix: _.chunk(this.months, 3)
      }
    },

    chosenDate() {
      const date = unVue(new Date(this.proxy[0]))
      if (isValidDate(date)) {
        return {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
      }
    },

    datePicker() {
      return this.$refs && this.$refs['date-picker'] && (this.$refs['date-picker'].$el || this.$refs['date-picker'])
    },
    yearsList() {
      return this.$refs && this.$refs['years-list'] && (this.$refs['years-list'].$el || this.$refs['years-list'])
    }
  },

  watch: {
    state() {
      this.scrollYearsList()
    },

    'date.year'() {
      this.scrollYearsList()
    },

    date: {
      handler() {
        if (this.date.month < 0) {
          this.date.year--
          this.date.month = 11
          this.date.day = 1
        } else if (this.date.month > 11) {
          this.date.year++
          this.date.month = 0
          this.date.day = 1
        }
      },
      deep: true
    }
  },

  mounted() {
    if (this.chosenDate) {
      this.date.year = this.chosenDate.year
      this.date.month = this.chosenDate.month
      this.date.day = this.chosenDate.day
    }
  },

  beforeDestroy() {
    this.state = 'days'
  },

  methods: {
    _inputFilter(data) {
      if (!Array.isArray(data)) {
        data = [ data ]
      }

      let result = data.reduce((result, value) => {
        if (value) {
          const date = new Date(value)
          if (isValidDate(date)) {
            date.setHours(0, 0, 0, 0)
            result.push(date.getTime())
          }
        }
        return result
      }, [])

      if (result.length && result[0] === result[1]) {
        result = [ result[0] ]
      }

      return result
    },
    _outputFilter(data) {
      data = this.filter(data)
      if (this.range) {
        return data
      } else {
        return data[0]
      }
    },

    watchProxyHandler() {
      if (JSON.stringify(this.value) !== JSON.stringify(this.proxy)) {
        this.transmitValue()
      }
    },

    changeState(date) {
      if (!date) {
        if (this.proxy[0]) {
          date = new Date(this.proxy[0])
        } else {
          date = new Date()
        }
      }

      this.date.month = date.getMonth()
      this.date.year = date.getFullYear()
      this.state = 'days'
    },

    scrollYearsList() {
      if (this.state === 'years') {
        setTimeout(() => {
          this.yearsList.scrollTop = this.yearsList.querySelector('.g-date-picker__years-list-item--active').offsetTop - this.datePicker.offsetHeight / 2
        }, 100)
      }
    },

    pickDateHandler(day) {
      if (day && !isNaN(day)) {
        const pickedDate = this.getUnixTimeByDay(day)

        this.date.day = day

        if (this.range && this.proxy.length < 2 && pickedDate !== this.proxy[0]) {
          const dates = unVue(this.proxy)
          dates.push(pickedDate)
          dates.sort()
          this.proxy = dates
        } else if (!this.range || this.proxy.length === 2) {
          this.proxy = [ pickedDate ]
        }
      }
    },

    convertDate(input) {
      const output = new Date(input)
      output.setHours(0, 0, 0, 0)

      return output.getTime()
    },

    getUnixTimeByDay(day) {
      return new Date(this.date.year, this.date.month, day).getTime()
    },

    /**
     * @param {number} unixTime 0000000000000 мс
     * @return {object}
     */
    isActiveDay(unixTime) {
      const isActiveDate = this.proxy.some(value => {
        if (value) {
          const timeToCompare = this.convertDate(value)
          if (unixTime === timeToCompare) {
            return true
          }
        }

        return false
      })

      let isInRange = false
      if (this.proxy.length > 1) {
        isInRange = unixTime < this.proxy[1] && unixTime > this.proxy[0]
      }

      let isLeftActiveEdge = false
      let isRightActiveEdge = false

      if (this.proxy.length === 2) {
        const leftEdge = this.convertDate(this.proxy[0])
        const rightEdge = this.convertDate(this.proxy[1])
        if (leftEdge === unixTime) {
          isLeftActiveEdge = true
        }
        if (rightEdge === unixTime) {
          isRightActiveEdge = true
        }
      }

      return {
        isActiveDate,
        isInRange,
        isLeftActiveEdge,
        isRightActiveEdge
      }
    },

    isActiveHoverDay(unixTime) {
      if (this.hoveringDate && this.proxy.length === 1) {
        return unixTime < Math.max(this.proxy[0], this.hoveringDate) && unixTime > Math.min(this.proxy[0], this.hoveringDate)
      } else {
        return false
      }
    },

    isActiveMonth(year, month) {
      if (!this.proxy.length) {
        return false
      }

      const monthForCheck = new Date(year, month)

      if (this.proxy.length < 2) {
        return (
          new Date(this.proxy[0]).getMonth() === monthForCheck.getMonth() &&
          new Date(this.proxy[0]).getFullYear() === monthForCheck.getFullYear()
        )
      }

      const leftBorder = new Date(this.proxy[0])
      leftBorder.setDate(1)
      leftBorder.setHours(0, 0, 0, 0)

      const rightBorder = new Date(this.proxy[1])
      rightBorder.setDate(1)
      rightBorder.setHours(0, 0, 0, 0)

      return leftBorder.getTime() <= monthForCheck.getTime() && rightBorder.getTime() >= monthForCheck.getTime()
    },

    isActiveYear(year) {
      if (!this.proxy.length) {
        return false
      }

      if (this.proxy.length < 2) {
        return new Date(this.proxy[0]).getFullYear() === year
      }

      const topBorder = new Date(this.proxy[0])
      const bottomBorder = new Date(this.proxy[1])

      return topBorder.getFullYear() <= year && bottomBorder.getFullYear() >= year
    },

    isDisabledDay(unixTime) {
      if (!isNaN(this.computedMin) || !isNaN(this.computedMax)) {
        return unixTime < this.computedMin || unixTime > this.computedMax
      }
    }
  },

  render
}
